package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"github.com/user/ai-ride-hailing/ambulance_service/internal/models"
	"gorm.io/gorm"
)

type AmbulanceService struct {
	db *gorm.DB
}

func NewAmbulanceService(db *gorm.DB) *AmbulanceService {
	return &AmbulanceService{db: db}
}

// --- Dispatch Logic ---

func (s *AmbulanceService) DispatchEmergency(priority string, lat, lng float64, incidentType string) (*models.Ambulance, error) {
	var ambulance models.Ambulance
	err := s.db.Where("status = ?", "AVAILABLE").
		Order(fmt.Sprintf("ABS(current_lat - %f) + ABS(current_lng - %f) ASC", lat, lng)).
		First(&ambulance).Error

	if err != nil {
		return nil, fmt.Errorf("NO_AMBULANCE_AVAILABLE")
	}

	hospitalID, _ := s.getAIBasedHospital(lat, lng, incidentType)

	incident := models.EmergencyIncident{
		Priority:     priority,
		IncidentType: incidentType,
		Lat:          lat,
		Lng:          lng,
		Status:       "DISPATCHED",
		AmbulanceID:  &ambulance.ID,
		HospitalID:   hospitalID,
	}
	s.db.Create(&incident)

	ambulance.Status = "EN_ROUTE"
	s.db.Save(&ambulance)

	return &ambulance, nil
}

func (s *AmbulanceService) getAIBasedHospital(lat, lng float64, incidentType string) (*uint, error) {
	hospitals := []map[string]interface{}{
		{"id": 1, "lat": 25.27, "lng": 55.33, "wait_time": 10, "specialties": "TRAUMA,CARDIAC"},
	}

	payload, _ := json.Marshal(map[string]interface{}{
		"incident_type": incidentType,
		"current_lat":   lat,
		"current_lng":   lng,
		"hospitals":     hospitals,
	})

	resp, err := http.Post("http://localhost:9005/heuristics/hospital_router", "application/json", bytes.NewBuffer(payload))
	if err != nil || resp.StatusCode != 200 {
		return nil, fmt.Errorf("AI_UNAVAILABLE")
	}

	var result struct {
		RecommendedHospitalID uint `json:"recommended_hospital_id"`
	}
	json.NewDecoder(resp.Body).Decode(&result)
	return &result.RecommendedHospitalID, nil
}

// --- Fleet & Telemetry Logic ---

func (s *AmbulanceService) ProcessTelemetry(ambulanceID uint, oxygen float64) error {
	var inv models.EquipmentInventory
	s.db.Where("ambulance_id = ? AND equipment_type = ?", ambulanceID, "OXYGEN_TANK").First(&inv)
	inv.OxygenLevelPct = oxygen
	if oxygen < 25.0 {
		inv.Status = "DEPLETED"
		s.db.Model(&models.Ambulance{}).Where("id = ?", ambulanceID).Update("status", "MAINTENANCE")
	}
	return s.db.Save(&inv).Error
}

func (s *AmbulanceService) VerifyCrew(crewID uint, hours float64) (bool, string) {
	payload, _ := json.Marshal(map[string]interface{}{
		"crew_id": crewID,
		"hours_on_duty": hours,
		"incident_count_last_4h": 3,
		"avg_incident_stress_level": 0.6,
	})

	resp, err := http.Post("http://localhost:9005/heuristics/crew_fatigue_predictor", "application/json", bytes.NewBuffer(payload))
	if err != nil || resp.StatusCode != 200 {
		return hours < 12.0, "FALLBACK_VERIFICATION"
	}

	var result struct {
		Action string `json:"action_recommendation"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	if result.Action == "IMMEDIATE_STAND_DOWN" {
		return false, "FATIGUE_LOCKOUT"
	}
	return true, "FIT_FOR_DUTY"
}

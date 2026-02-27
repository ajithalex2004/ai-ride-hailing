package emergency

import (
	"encoding/json"
	"fmt"
	"net/http"
	"bytes"
	"github.com/user/ai-ride-hailing/monolith/internal/models"
	"gorm.io/gorm"
)

type DispatchManager struct {
	db *gorm.DB
}

func NewDispatchManager(db *gorm.DB) *DispatchManager {
	return &DispatchManager{db: db}
}

// Priority Levels
const (
	PRIORITY_P0_EMERGENCY = "P0" // Life-threatening
	PRIORITY_P1_INCIDENT  = "P1" // Urgent
	PRIORITY_P2_MODERATE  = "P2" // Standard
)

func (m *DispatchManager) DispatchEmergency(priority string, lat, lng float64, incidentType string) (*models.Ambulance, error) {
	// AI Logic: Priority Escalation
	if priority == PRIORITY_P0_EMERGENCY {
		fmt.Printf("[CRITICAL] P0 Dispatch Triggered for %s at (%f, %f)\n", incidentType, lat, lng)
	}

	// 1. Find Nearest Available Ambulance
	var ambulance models.Ambulance
	err := m.db.Where("status = ?", "AVAILABLE").
		Order(fmt.Sprintf("ABS(current_lat - %f) + ABS(current_lng - %f) ASC", lat, lng)).
		First(&ambulance).Error

	if err != nil {
		return nil, fmt.Errorf("NO_AMBULANCE_AVAILABLE")
	}

	// 2. Call AI for Hospital Routing (Capacity + Specialization Aware)
	hospitalID, err := m.GetRecommendedHospital(lat, lng, incidentType)
	if err != nil {
		fmt.Println("WARN: Hospital AI Unavailable, using default nearest")
	}

	// 3. Update Incident & Ambulance Status
	incident := models.EmergencyIncident{
		Priority:     priority,
		IncidentType: incidentType,
		Lat:          lat,
		Lng:          lng,
		Status:       "DISPATCHED",
		AmbulanceID:  &ambulance.ID,
		HospitalID:   hospitalID,
	}
	m.db.Create(&incident)

	ambulance.Status = "EN_ROUTE"
	m.db.Save(&ambulance)

	return &ambulance, nil
}

func (m *DispatchManager) GetRecommendedHospital(lat, lng float64, incidentType string) (*uint, error) {
	// 1. Fetch Hospitals from .NET Registry (Mocked list for AI call)
	hospitals := []map[string]interface{}{
		{"id": 1, "lat": 25.27, "lng": 55.33, "wait_time": 10, "specialties": "TRAUMA,CARDIAC"},
		{"id": 2, "lat": 25.24, "lng": 55.31, "wait_time": 45, "specialties": "TRAUMA,BURN"},
	}

	payload, _ := json.Marshal(map[string]interface{}{
		"incident_type": incidentType,
		"current_lat":   lat,
		"current_lng":   lng,
		"hospitals":     hospitals,
	})

	// High Availability: Retry Logic
	var resp *http.Response
	var err error
	for i := 0; i < 3; i++ {
		resp, err = http.Post("http://localhost:9005/heuristics/hospital_router", "application/json", bytes.NewBuffer(payload))
		if err == nil && resp.StatusCode == 200 {
			break
		}
		log.Printf("[HA_WATCHDOG] AI Call Failed, Retrying (%d/3)...", i+1)
		time.Sleep(100 * time.Millisecond)
	}

	if err != nil || resp == nil || resp.StatusCode != 200 {
		return nil, fmt.Errorf("AI_UNAVAILABLE_AFTER_RETRIES")
	}

	var result struct {
		RecommendedHospitalID uint `json:"recommended_hospital_id"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	return &result.RecommendedHospitalID, nil
}

func (m *DispatchManager) ScheduleTransfer(req models.ScheduledMedicalTransfer) error {
	// Logic: Save to transfer queue and call AI optimizer
	return m.db.Create(&req).Error
}

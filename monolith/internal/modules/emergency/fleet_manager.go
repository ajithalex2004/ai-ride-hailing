package emergency

import (
	"encoding/json"
	"fmt"
	"net/http"
	"bytes"
	"github.com/user/ai-ride-hailing/monolith/internal/models"
	"gorm.io/gorm"
)

type FleetManager struct {
	db *gorm.DB
}

func NewFleetManager(db *gorm.DB) *FleetManager {
	return &FleetManager{db: db}
}

func (m *FleetManager) ProcessEquipmentTelemetry(ambulanceID uint, oxygenLevel float64, defibOk bool) error {
	// 1. Update Inventory State
	var inv models.EquipmentInventory
	m.db.Where("ambulance_id = ? AND equipment_type = ?", ambulanceID, "OXYGEN_TANK").First(&inv)
	inv.OxygenLevelPct = oxygenLevel
	if oxygenLevel < 25.0 {
		inv.Status = "DEPLETED"
		// Trigger Auto-Maintenance Status for Ambulance
		m.db.Model(&models.Ambulance{}).Where("id = ?", ambulanceID).Update("status", "MAINTENANCE")
	}
	m.db.Save(&inv)

	return nil
}

func (m *FleetManager) VerifyCrewFitness(crewID uint, hoursOnDuty float64) (bool, string) {
	// 1. Call AI for Fatigue Prediction
	payload, _ := json.Marshal(map[string]interface{}{
		"crew_id": crewID,
		"hours_on_duty": hoursOnDuty,
		"incident_count_last_4h": 4, // Mocked from DB
		"avg_incident_stress_level": 0.7,
	})

	resp, err := http.Post("http://localhost:9005/heuristics/crew_fatigue_predictor", "application/json", bytes.NewBuffer(payload))
	if err != nil || resp.StatusCode != 200 {
		return hoursOnDuty < 12.0, "AI_UNAVAILABLE_FALLBACK"
	}

	var result struct {
		FatigueScore float64 `json:"fatigue_score"`
		RiskLevel    string  `json:"risk_level"`
		Action       string  `json:"action_recommendation"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	// Persist Fatigue Telemetry
	m.db.Create(&models.FatigueTelemetry{
		CrewID: crewID,
		FatigueScore: result.FatigueScore,
		HoursOnDuty: hoursOnDuty,
		AlertTriggered: result.RiskLevel != "STABLE",
		LockoutActive: result.Action == "IMMEDIATE_STAND_DOWN",
	})

	if result.Action == "IMMEDIATE_STAND_DOWN" {
		return false, "CRITICAL_FATIGUE_LOCKOUT"
	}

	return true, "FIT_FOR_DUTY"
}

func (m *FleetManager) LogResponseMetric(incidentID uint, zoneID string, priority string, responseSec int) {
	isSLA := (priority == "P1" && responseSec <= 480) || (priority == "P2" && responseSec <= 900)
	
	m.db.Create(&models.ResponsePerformance{
		ZoneID: zoneID,
		Priority: priority,
		ResponseTimeSec: responseSec,
		IsSLACompliant: isSLA,
		IncidentID: incidentID,
	})
}

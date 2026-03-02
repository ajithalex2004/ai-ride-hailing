package workforce

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"bytes"
	"time"
	"github.com/user/ai-ride-hailing/monolith/models"
	"gorm.io/gorm"
)

type WorkforceManager struct {
	db *gorm.DB
}

func NewWorkforceManager(db *gorm.DB) *WorkforceManager {
	return &WorkforceManager{db: db}
}

func (m *WorkforceManager) StartShift(driverID uint) (bool, string) {
	// 1. Fatigue Enforcement
	// Check last actual end time - must have 10 hours rest
	var lastShift models.WorkforceShift
	m.db.Where("driver_id = ? AND actual_end IS NOT NULL", driverID).Order("actual_end desc").First(&lastShift)

	if lastShift.ID != 0 {
		restDuration := time.Since(*lastShift.ActualEnd)
		if restDuration < 10*time.Hour {
			return false, fmt.Sprintf("Fatigue Guard: Insufficient rest. %.1f hours since last shift.", restDuration.Hours())
		}
	}

	// 2. Certification Check (Simulated .NET call)
	// In production, this would call GET /api/erp/Workforce/certs/{driverID}
	
	now := time.Now()
	shift := models.WorkforceShift{
		DriverID:    driverID,
		ActualStart: &now,
		ShiftType:   "ON_DEMAND",
	}
	m.db.Create(&shift)
	
	return true, "Shift Started Successfully"
}

func (m *WorkforceManager) IngestBehavioralEvent(event models.BehavioralLog) error {
	// Store the event
	if err := m.db.Create(&event).Error; err != nil {
		return err
	}

	// Trigger Risk Score Logic if thresholds exceeded
	var logs []models.BehavioralLog
	m.db.Where("driver_id = ? AND created_at > ?", event.DriverID, time.Now().Add(-24*time.Hour)).Find(&logs)

	if len(logs) > 5 {
		// Call Python AI for Risk Assessment
		go m.evaluateDriverRisk(event.DriverID, logs)
	}

	return nil
}

func (m *WorkforceManager) evaluateDriverRisk(driverID uint, logs []models.BehavioralLog) {
	harshBraking := 0
	overSpeed := 0
	for _, l := range logs {
		if l.EventType == "HARSH_BRAKING" { harshBraking++ }
		if l.EventType == "OVERSPEED" { overSpeed++ }
	}

	payload := fmt.Sprintf(`{"driver_id": %d, "harsh_braking_count": %d, "overspeed_events": %d, "mileage_total": 150.0}`, driverID, harshBraking, overSpeed)
	resp, _ := http.Post("http://localhost:9005/heuristics/behavioral_risk_score", "application/json", bytes.NewBuffer([]byte(payload)))
	
	if resp != nil && resp.StatusCode == 200 {
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		log.Printf("[WorkforceAI] Risk Assessment for Driver %d: Grade %v, Recommendation: %v", driverID, result["safety_grade"], result["recommendation"])
	}
}

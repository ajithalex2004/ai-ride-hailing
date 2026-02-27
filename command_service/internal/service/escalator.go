package service

import (
	"log"
	"time"
	"github.com/user/ai-ride-hailing/command_service/internal/models"
	"gorm.io/gorm"
)

type EscalationEngine struct {
	db *gorm.DB
}

func NewEscalationEngine(db *gorm.DB) *EscalationEngine {
	return &EscalationEngine{db: db}
}

func (e *EscalationEngine) StartSLAWatcher(incidentID uint, thresholdMin int) {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()

	expiry := time.Now().Add(time.Duration(thresholdMin) * time.Minute)

	for {
		select {
		case <-ticker.C:
			// Check if incident is resolved or status changed to EN_ROUTE
			var timeline models.IncidentTimeline
			e.db.Where("incident_id = ? AND event_name IN (?, ?)", incidentID, "EN_ROUTE", "RESOLVED").First(&timeline)
			
			if timeline.ID != 0 {
				log.Printf("SLA Watcher for INC-%d: SLA MET. Stopping.", incidentID)
				return
			}

			if time.Now().After(expiry) {
				log.Printf("SLA Watcher for INC-%d: SLA BREACHED. Triggering Escalation.", incidentID)
				e.TriggerEscalation(incidentID)
				return
			}
		}
	}
}

func (e *EscalationEngine) TriggerEscalation(incidentID uint) {
	// 1. Log Escalation
	e.db.Create(&models.IncidentTimeline{
		IncidentID: incidentID,
		EventName:  "ESCALATED",
		Timestamp:  time.Now(),
		Details:    "Auto-escalated due to zero response from assigned resource.",
	})

	// 2. Mark SLA Alert
	e.db.Create(&models.SLAAlert{
		IncidentID:      incidentID,
		SLAThresholdMin: 3,
		EscalationLevel: 1,
		AutoReassigned:  true,
	})

	// 3. Trigger Reassignment (Calling internal Dispatcher or AI)
	log.Printf("Initiating Auto-Reassignment for INC-%d...", incidentID)
	// Logic: Send gRPC/REST signal to Ambulance/Incident service to re-dispatch
}

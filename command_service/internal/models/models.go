package models

import (
	"gorm.io/gorm"
	"time"
)

type C2Session struct {
	gorm.Model
	SessionName     string    `json:"session_name"`
	ActiveUserCount int       `json:"active_user_count"`
	TargetZone      string    `json:"target_zone"` // Municipality, EMS, Industrial
	Status          string    `json:"status"`      // "OPERATIONAL", "ELEVATED_ALERT", "CRITICAL_HALT"
}

type IncidentTimeline struct {
	gorm.Model
	IncidentID      uint      `gorm:"index" json:"incident_id"`
	EventName       string    `json:"event_name"` // "REPORTED", "DISPATCH_ASSIGNED", "EN_ROUTE", "ESCALATED"
	Timestamp       time.Time `json:"timestamp"`
	ActorID         string    `json:"actor_id"`
	Details         string    `json:"details"`
}

type SLAAlert struct {
	gorm.Model
	IncidentID      uint      `gorm:"index" json:"incident_id"`
	SLAThresholdMin int       `json:"sla_threshold_min"`
	CurrentDelayMin int       `json:"current_delay_min"`
	EscalationLevel int       `json:"escalation_level"` // 0: None, 1: Supervisor, 2: City Authority
	IsResolved      bool      `json:"is_resolved"`
	AutoReassigned  bool      `json:"auto_reassigned"`
}

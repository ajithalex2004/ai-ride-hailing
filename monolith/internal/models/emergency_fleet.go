package models

import (
	"gorm.io/gorm"
	"time"
)

type EquipmentInventory struct {
	gorm.Model
	AmbulanceID     uint      `gorm:"index" json:"ambulance_id"`
	EquipmentType   string    `json:"equipment_type"` // "OXYGEN_TANK", "DEFIBRILLATOR", "TRAUMA_KIT"
	SerialNumber    string    `json:"serial_no"`
	Status          string    `json:"status"` // "READY", "DEPLETED", "MAINTENANCE_REQUIRED"
	OxygenLevelPct  float64   `json:"oxygen_level_pct"`
	LastSelfTest    time.Time `json:"last_self_test"`
	InServiceDate   time.Time `json:"in_service_date"`
}

type CrewSchedule struct {
	gorm.Model
	CrewID          uint      `gorm:"index" json:"crew_id"`
	ShiftStart      time.Time `json:"shift_start"`
	ShiftEnd        time.Time `json:"shift_end"`
	AmbulanceID     uint      `json:"ambulance_id"`
	Status          string    `json:"status"` // "SCHEDULED", "ACTIVE", "COMPLETED"
	CertificationVerified bool `json:"certification_verified"`
}

type FatigueTelemetry struct {
	gorm.Model
	CrewID          uint      `gorm:"index" json:"crew_id"`
	FatigueScore    float64   `json:"fatigue_score"` // 0.0 to 1.0 (AI generated)
	HoursOnDuty     float64   `json:"hours_on_duty"`
	IncidentIntensity float64 `json:"incident_intensity"` // Heavy vs light workload
	AlertTriggered  bool      `json:"alert_triggered"`
	LockoutActive   bool      `json:"lockout_active"`
}

type ResponsePerformance struct {
	gorm.Model
	ZoneID          string    `gorm:"index" json:"zone_id"`
	Priority        string    `json:"priority"` // "P1", "P2", "P3"
	ResponseTimeSec int       `json:"response_time_sec"`
	IsSLACompliant  bool      `json:"is_sla_compliant"`
	IncidentID      uint      `json:"incident_id"`
	Timestamp       time.Time `json:"timestamp"`
}

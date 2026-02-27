package workforce

import (
	"gorm.io/gorm"
	"time"
)

type ShiftStatus string

const (
	ShiftActive   ShiftStatus = "ACTIVE"
	ShiftEnded    ShiftStatus = "ENDED"
	ShiftOnBreak  ShiftStatus = "ON_BREAK"
	ShiftPending  ShiftStatus = "PENDING"
)

type DriverShift struct {
	gorm.Model
	DriverID      uint        `gorm:"index" json:"driver_id"`
	StartTime     time.Time   `json:"start_time"`
	EndTime       *time.Time  `json:"end_time"`
	Status        ShiftStatus `json:"status"`
	ActualHours   float64     `json:"actual_hours"`
	PlannedHours  float64     `json:"planned_hours"`
}

type FatigueScore struct {
	gorm.Model
	DriverID      uint      `gorm:"index" json:"driver_id"`
	Score         float64   `json:"score"` // 0-100, where 100 is highly fatigued
	LastCheckAt   time.Time `json:"last_check_at"`
	AlertTriggered bool      `json:"alert_triggered"`
}

type DriverSkill struct {
	gorm.Model
	DriverID      uint   `gorm:"index" json:"driver_id"`
	SkillName     string `json:"skill_name"` // e.g., "ACLS", "BLS", "Limo-VVIP"
	CertifiedUntil time.Time `json:"certified_until"`
}

package models

import (
	"gorm.io/gorm"
	"time"
)

type DriverCertification struct {
	gorm.Model
	DriverID        uint      `gorm:"index" json:"driver_id"`
	CertType        string    `json:"cert_type"` // "LICENSE", "EMERGENCY_DRIVING", "FIRST_AID"
	IssueDate       time.Time `json:"issue_date"`
	ExpiryDate      time.Time `json:"expiry_date"`
	Status          string    `json:"status"` // "ACTIVE", "EXPIRED", "PENDING_RENEWAL"
	CertificateURL  string    `json:"certificate_url"`
}

type TrainingRecord struct {
	gorm.Model
	DriverID        uint      `gorm:"index" json:"driver_id"`
	CourseName      string    `json:"course_name"`
	CompletionDate  time.Time `json:"completion_date"`
	ResultScore     float64   `json:"result_score"`
	Mandatory       bool      `json:"mandatory"`
}

type BehavioralLog struct {
	gorm.Model
	DriverID        uint      `gorm:"index" json:"driver_id"`
	EventType       string    `json:"event_type"` // "HARSH_BRAKING", "OVERSPEED", "SHARP_TURN"
	Severity        float64   `json:"severity"`   // G-force or km/h over limit
	Latitude        float64   `json:"latitude"`
	Longitude       float64   `json:"longitude"`
	Timestamp       time.Time `json:"timestamp"`
	TripID          *uint     `json:"trip_id"`
}

type WorkforceShift struct {
	gorm.Model
	DriverID        uint      `gorm:"index" json:"driver_id"`
	StartTime       time.Time `json:"start_time"`
	EndTime         time.Time `json:"end_time"`
	ActualStart     *time.Time `json:"actual_start"`
	ActualEnd       *time.Time `json:"actual_end"`
	ShiftType       string    `json:"shift_type"` // "MORNING", "EVENING", "NIGHT"
	IsOvertime      bool      `json:"is_overtime"`
	FatigueScore    float64   `json:"fatigue_score"` // Final fatigue score for the shift
}

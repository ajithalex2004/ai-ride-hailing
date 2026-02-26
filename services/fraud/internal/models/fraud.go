package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RiskStatus string

const (
	StatusClean   RiskStatus = "CLEAN"
	StatusFlagged RiskStatus = "FLAGGED"
	StatusBlocked RiskStatus = "BLOCKED"
)

type RiskAssessment struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key;" json:"id"`
	EntityID  uuid.UUID      `gorm:"type:uuid;index:idx_risk_entity" json:"entity_id"` // User or Ride ID
	EntityType string        `gorm:"index:idx_risk_entity" json:"entity_type"` // "USER", "RIDE", "PAYMENT"
	Score     float64        `json:"score"`      // 0.0 to 1.0
	Status    RiskStatus     `gorm:"index" json:"status"`
	Reasons   []string       `gorm:"type:text[]" json:"reasons"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}

func (r *RiskAssessment) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New()
	return
}

type FraudSignal struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	EntityID  uuid.UUID `gorm:"type:uuid;index" json:"entity_id"`
	Type      string    `gorm:"index" json:"type"` // GPS_SPOOFING, VELOCITY_ANOMALY, PAYMENT_VELOCITY
	Value     string    `json:"value"`
	Severity  float64   `json:"severity"`
	CreatedAt time.Time `gorm:"index" json:"created_at"`
}

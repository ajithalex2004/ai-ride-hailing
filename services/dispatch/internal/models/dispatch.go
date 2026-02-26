package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DispatchStatus string

const (
	DispatchPending   DispatchStatus = "PENDING"
	DispatchMatched   DispatchStatus = "MATCHED"
	DispatchTimeout   DispatchStatus = "TIMEOUT"
	DispatchCancelled DispatchStatus = "CANCELLED"
)

type DispatchRequest struct {
	gorm.Model
	RequestID   uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"request_id"`
	RideID      uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"ride_id"`
	PassengerID uint           `gorm:"index" json:"passenger_id"`
	Category    string         `gorm:"index" json:"category"` // TAXI or LIMO
	FleetID     *uint          `gorm:"index" json:"fleet_id"` // Optional: Match only to specific fleet
	Status      DispatchStatus `gorm:"type:string;index;default:'PENDING'" json:"status"`
	
	// Constraints
	PickupLat   float64        `json:"pickup_lat"`
	PickupLng   float64        `json:"pickup_lng"`
	MaxDistance float64        `gorm:"default:10.0" json:"max_distance"` // in km
	
	StartedAt   time.Time      `json:"started_at"`
}

type DriverMatch struct {
	gorm.Model
	RequestID   uuid.UUID `gorm:"index" json:"request_id"`
	DriverID    uint      `gorm:"index" json:"driver_id"`
	FleetID     uint      `gorm:"index" json:"fleet_id"` // Provider fleet
	ETA         int       `json:"eta"`             // in minutes
	Distance    float64   `json:"distance"`        // in km
	RankingScore float64  `gorm:"index" json:"ranking_score"`   // AI-calculated score
}

func (d *DispatchRequest) BeforeCreate(tx *gorm.DB) (err error) {
	d.RequestID = uuid.New()
	d.StartedAt = time.Now()
	return
}

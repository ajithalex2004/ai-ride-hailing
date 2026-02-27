package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	DispatchPending   DispatchStatus = "PENDING"
	DispatchMatched   DispatchStatus = "MATCHED"
	DispatchTimeout   DispatchStatus = "TIMEOUT"
	DispatchCancelled DispatchStatus = "CANCELLED"
)

type PriorityLevel string

const (
	PriorityP1       PriorityLevel = "P1"       // Life Threatening (Ambulance)
	PriorityP2       PriorityLevel = "P2"       // Urgent (Incident)
	PriorityP3       PriorityLevel = "P3"       // Scheduled Transfer / Priority Commercial
	PriorityStandard PriorityLevel = "STANDARD" // Normal Ride
)

type DispatchRequest struct {
	gorm.Model
	RequestID   uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"request_id"`
	RideID      uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"ride_id"`
	PassengerID uint           `gorm:"index" json:"passenger_id"`
	Category    string         `gorm:"index" json:"category"` // TAXI or LIMO
	FleetID     *uint          `gorm:"index" json:"fleet_id"` // Optional: Match only to specific fleet
	Priority    PriorityLevel  `gorm:"type:string;index;default:'STANDARD'" json:"priority"`
	Status      DispatchStatus `gorm:"type:string;index;default:'PENDING'" json:"status"`
	
	// Constraints
	PickupLat   float64        `json:"pickup_lat"`
	PickupLng   float64        `json:"pickup_lng"`
	MaxDistance float64        `gorm:"default:10.0" json:"max_distance"` // in km
	
	StartedAt   time.Time      `json:"started_at"`
	SLADeadline time.Time      `json:"sla_deadline"`   // Target time for matching/pickup
	ActualResponseTime int     `json:"actual_response_time"` // in seconds
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
	
	// Default SLAs: P1=2mins, P2=5mins, P3/Standard=10mins
	switch d.Priority {
	case PriorityP1:
		d.SLADeadline = d.StartedAt.Add(2 * time.Minute)
	case PriorityP2:
		d.SLADeadline = d.StartedAt.Add(5 * time.Minute)
	default:
		d.SLADeadline = d.StartedAt.Add(10 * time.Minute)
	}
	return
}

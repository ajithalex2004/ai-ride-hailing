package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RideCategory string

const (
	CategoryTaxi RideCategory = "TAXI"
	CategoryLimo RideCategory = "LIMO"
)

type RideStatus string

const (
	StatusSearching        RideStatus = "SEARCHING_DRIVER"
	StatusDriverAssigned   RideStatus = "DRIVER_ASSIGNED"
	StatusArriving        RideStatus = "ARRIVING"
	StatusStarted         RideStatus = "STARTED"
	StatusCompleted       RideStatus = "COMPLETED"
	StatusCancelled       RideStatus = "CANCELLED"
	StatusPreBooked       RideStatus = "PRE_BOOKED" // For Limo
)

type Location struct {
	Lat     float64 `json:"lat"`
	Lng     float64 `json:"lng"`
	Address string  `json:"address"`
}

type Ride struct {
	gorm.Model
	RideID            uuid.UUID    `gorm:"type:uuid;uniqueIndex;not null" json:"ride_id"`
	PassengerID       uint         `gorm:"index" json:"passenger_id"`
	DriverID          *uint        `gorm:"index" json:"driver_id"`
	Category          RideCategory `gorm:"type:string;index;not null" json:"category"`
	Status            RideStatus   `gorm:"type:string;index;default:'SEARCHING_DRIVER'" json:"status"`
	FleetID           *uint        `gorm:"index" json:"fleet_id"` // Fulfilling operator
	
	// Locations
	PickupLat         float64      `json:"pickup_lat"`
	PickupLng         float64      `json:"pickup_lng"`
	PickupAddress     string       `json:"pickup_address"`
	DropoffLat        float64      `json:"dropoff_lat"`
	DropoffLng        float64      `json:"dropoff_lng"`
	DropoffAddress    string       `json:"dropoff_address"`

	// Pricing
	EstimatedFare     float64      `json:"estimated_fare"`
	ActualFare        float64      `json:"actual_fare"`
	Currency          string       `gorm:"default:'AED'" json:"currency"`
	SurgeMultiplier   float64      `gorm:"default:1.0" json:"surge_multiplier"`

	// Timing
	ScheduledTime     *time.Time   `json:"scheduled_time"` // For Limo pre-bookings
	StartedAt         *time.Time   `json:"started_at"`
	CompletedAt       *time.Time   `json:"completed_at"`

	// GCC Compliance
	VATAmount         float64      `json:"vat_amount"`
}

func (r *Ride) BeforeCreate(tx *gorm.DB) (err error) {
	r.RideID = uuid.New()
	return
}

package models

import (
	"gorm.io/gorm"
	"time"
)

type TripStatus string

const (
	StatusPending    TripStatus = "PENDING"
	StatusSearching  TripStatus = "SEARCHING"
	StatusArriving   TripStatus = "ARRIVING"
	StatusOnTrip     TripStatus = "ON_TRIP"
	StatusCompleted  TripStatus = "COMPLETED"
	StatusCancelled  TripStatus = "CANCELLED"
	StatusPreEmpted TripStatus = "PRE_EMPTED"
)

type UnifiedTrip struct {
	gorm.Model
	Domain         string     `gorm:"index" json:"domain"`
	RequestType    string     `gorm:"index" json:"request_type"`
	Status         TripStatus `gorm:"index" json:"status"`
	Priority       string     `json:"priority"`
	
	// Passenger/Requester
	RequesterID    uint       `json:"requester_id"`
	
	// Locations
	PickupLat      float64    `json:"pickup_lat"`
	PickupLng      float64    `json:"pickup_lng"`
	PickupAddress  string     `json:"pickup_address"`
	DropoffLat     float64    `json:"dropoff_lat"`
	DropoffLng     float64    `json:"dropoff_lng"`
	DropoffAddress string     `json:"dropoff_address"`
	
	// Dispatch Info (Previously separate)
	AssignedDriverID *uint     `json:"assigned_driver_id"`
	VehicleID        *uint     `json:"vehicle_id"`
	MatchedAt        *time.Time `json:"matched_at"`
	
	// Dynamic Metadata (EPOD, Patient Data, etc.)
	MetadataJSON     string     `gorm:"type:text" json:"metadata_json"`
	
	// Business Rules Applied
	AutoDispatch     bool       `json:"auto_dispatch"`
	SLAEnforced      bool       `json:"sla_enforced"`
	ApprovalRequired bool       `json:"approval_required"`

	// Corporate & SLA Tracking
	IsCorporate      bool       `gorm:"index" json:"is_corporate"`
	ContractID       *uint      `gorm:"index" json:"contract_id"`
	CostCenterID     *uint      `gorm:"index" json:"cost_center_id"`
	ScheduleID       *uint      `gorm:"index" json:"schedule_id"`
	
	ActualPickupAt   *time.Time `json:"actual_pickup_at"`
	ActualDropoffAt  *time.Time `json:"actual_dropoff_at"`
	SLAStatus        string     `json:"sla_status"` // "MET", "BREACHED", "PENDING"
}

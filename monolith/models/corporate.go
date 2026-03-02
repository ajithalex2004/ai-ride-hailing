package models

import (
	"gorm.io/gorm"
	"time"
)

type CorporateContract struct {
	gorm.Model
	TenantID        uint      `json:"tenant_id"`
	CompanyName     string    `json:"company_name"`
	ContractStart   time.Time `json:"contract_start"`
	ContractEnd     time.Time `json:"contract_end"`
	PenaltyRate     float64   `json:"penalty_rate"` // % penalty for SLA breach
	ReservedVehicles int      `json:"reserved_vehicles"`
}

type CostCenter struct {
	gorm.Model
	ContractID uint    `json:"contract_id"`
	Name       string  `json:"name"` // "Sales", "Engineering", "Exec"
	Tag        string  `json:"tag"`
	Budget     float64 `json:"budget"`
	Spent      float64 `json:"spent"`
}

type RecurringSchedule struct {
	gorm.Model
	ContractID   uint      `json:"contract_id"`
	CostCenterID uint      `json:"cost_center_id"`
	PickupLat    float64   `json:"pickup_lat"`
	PickupLng    float64   `json:"pickup_lng"`
	DropoffLat   float64   `json:"dropoff_lat"`
	DropoffLng   float64   `json:"dropoff_lng"`
	Frequency    string    `json:"frequency"` // "DAILY", "WEEKLY"
	ScheduledTime time.Time `json:"scheduled_time"`
	IsActive     bool      `json:"is_active"`
}

type FleetAllocation struct {
	gorm.Model
	ContractID uint `json:"contract_id"`
	VehicleID  uint `gorm:"uniqueIndex" json:"vehicle_id"`
	IsLocked   bool `json:"is_locked"` // True = Dedicated to this contract
}

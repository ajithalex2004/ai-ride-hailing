package models

import (
	"gorm.io/gorm"
)

type DomainType string

const (
	DomainTransport  DomainType = "TRANSPORT"
	DomainEmergency  DomainType = "EMERGENCY"
	DomainRescue     DomainType = "RESCUE"
	DomainLogistics  DomainType = "LOGISTICS"
)

type DomainConfiguration struct {
	gorm.Model
	DomainType      DomainType `gorm:"uniqueIndex;not null" json:"domain_type"`
	SortOrder       int        `json:"sort_order"`
	
	// Vehicle Configuration
	VehicleClasses  string     `json:"vehicle_classes"` // Comma-separated list
	VehicleGroups   string     `json:"vehicle_groups"`
	VehicleUsages   string     `json:"vehicle_usages"`
	
	// Business Rules
	PickupBufferMin     int     `gorm:"default:60" json:"pickup_buffer_min"`
	AutoDispatchBuffer  int     `gorm:"default:30" json:"auto_dispatch_buffer"`
	PricingSource       string  `gorm:"default:'DYNAMIC'" json:"pricing_source"`
	
	// Advanced Toggles
	ApprovalWorkflow    bool    `gorm:"default:false" json:"approval_workflow"`
	EPODRequired       bool    `gorm:"default:true" json:"epod_required"`
	AutoDispatch       bool    `gorm:"default:true" json:"auto_dispatch"`
	AutoTripCreation   bool    `gorm:"default:true" json:"auto_trip_creation"`
	AutoTripMerging    bool    `gorm:"default:false" json:"auto_trip_merging"`
	
	// Governance Rules (Expanded)
	StrictSLAEnforcement bool    `gorm:"default:false" json:"strict_sla_enforcement"`
	CrewReadinessCheck   bool    `gorm:"default:false" json:"crew_readiness_check"`
	PriorityPreemption   bool    `gorm:"default:false" json:"priority_preemption"`
	FleetQuotaReserve    float64 `gorm:"default:0.0" json:"fleet_quota_reserve"` // e.g., 0.20 for 20%
}

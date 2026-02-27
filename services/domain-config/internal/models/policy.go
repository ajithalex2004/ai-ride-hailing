package models

import (
	"gorm.io/gorm"
)

type PolicyType string

const (
	PolicyPricing      PolicyType = "PRICING"
	PolicyCancellation PolicyType = "CANCELLATION"
	PolicyMaintenance  PolicyType = "MAINTENANCE"
	PolicyEfficiency   PolicyType = "EFFICIENCY"
)

type GlobalPolicy struct {
	gorm.Model
	PolicyName  string     `gorm:"uniqueIndex;not null" json:"policy_name"`
	Type        PolicyType `gorm:"index" json:"type"`
	RulesJSON   string     `gorm:"type:text" json:"rules_json"` // Flexible rule storage
	IsActive    bool       `gorm:"default:true" json:"is_active"`
}

type CancellationRule struct {
	TimeWindowMin int     `json:"time_window_min"`
	PenaltyAmount float64 `json:"penalty_amount"`
	Currency      string  `json:"currency"`
	TargetRole    string  `json:"target_role"` // PASSENGER or DRIVER
}

type PricingPolicy struct {
	SurgeEnabled      bool    `json:"surge_enabled"`
	PlatformFeeTiered bool    `json:"platform_fee_tiered"`
	BaseMultiplier    float64 `json:"base_multiplier"`
}

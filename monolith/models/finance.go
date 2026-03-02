package models

import (
	"gorm.io/gorm"
	"time"
)

type CommissionStructure struct {
	gorm.Model
	TenantID        uint    `gorm:"index" json:"tenant_id"`
	Type            string  `json:"type"` // "TIER_BASED", "PERFORMANCE_BASED"
	BaseRate        float64 `json:"base_rate"`
	ThresholdAmount float64 `json:"threshold_amount"`
	IncentiveRate   float64 `json:"incentive_rate"`
	Description     string  `json:"description"`
}

type RevenueShare struct {
	gorm.Model
	ContractID      uint    `gorm:"index" json:"contract_id"`
	PlatformPercent float64 `json:"platform_percent"`
	FleetPercent    float64 `json:"fleet_percent"`
	CorporateBonus  float64 `json:"corporate_bonus"`
	IsActive        bool    `json:"is_active"`
}

type CurrencyConfig struct {
	gorm.Model
	Code            string  `gorm:"uniqueIndex" json:"code"` // "AED", "USD", "SAR"
	Symbol          string  `json:"symbol"`
	ExchangeRate    float64 `json:"exchange_rate"` // Rate to Base Currency (AED)
	IsSystemBase    bool    `json:"is_system_base"`
}

type FinancialForecast struct {
	gorm.Model
	TenantID        uint      `gorm:"index" json:"tenant_id"`
	ProjectionDate  time.Time `json:"projection_date"`
	ProjectedRevenue float64  `json:"projected_revenue"`
	ProjectedCost    float64  `json:"projected_cost"`
	ConfidenceScore  float64  `json:"confidence_score"`
	Scenario         string    `json:"scenario"` // "OPTIMISTIC", "REALISTIC", "PESSIMISTIC"
}

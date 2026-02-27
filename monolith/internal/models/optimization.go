package models

import (
	"gorm.io/gorm"
	"time"
)

type FleetUtilization struct {
	gorm.Model
	VehicleID       uint      `gorm:"index" json:"vehicle_id"`
	Date            time.Time `json:"date"`
	TotalShiftHours float64   `json:"total_shift_hours"`
	ActiveTripHours float64   `json:"active_trip_hours"`
	IdleHours       float64   `json:"idle_hours"`
	UtilizationRate float64   `json:"utilization_rate"` // Active / Total
}

type DemandForecast struct {
	gorm.Model
	ZoneID          string    `gorm:"index" json:"zone_id"`
	ForecastTime    time.Time `json:"forecast_time"`
	ProbabilityScore float64  `json:"probability_score"` // 0.0 to 1.0
	ExpectedVolume  int       `json:"expected_volume"`
	IsSurgeLikely   bool      `json:"is_surge_likely"`
}

type CancellationRisk struct {
	gorm.Model
	TripID          uint      `gorm:"uniqueIndex" json:"trip_id"`
	RiskScore       float64   `json:"risk_score"` // 0.0 to 1.0
	PrimaryFactor   string    `json:"primary_factor"` // "ETA_TOO_HIGH", "DRIVER_FAR", "HISTORICAL_AREA"
	LastChecked     time.Time `json:"last_checked"`
}

type CorporateElasticity struct {
	gorm.Model
	CorporateID     uint      `gorm:"index" json:"corporate_id"`
	PriceSensitivity float64  `json:"price_sensitivity"` // Elasticity coefficient
	ServiceIntegrity float64  `json:"service_integrity"` // Impact of delays on demand
	RecommendedBuffer float64 `json:"recommended_buffer"` // % of extra vehicles to reserve
}

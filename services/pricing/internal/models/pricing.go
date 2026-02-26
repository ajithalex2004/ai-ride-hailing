package models

import (
	"time"

	"gorm.io/gorm"
)

type PricingCategory string

const (
	CategoryTaxi PricingCategory = "TAXI"
	CategoryLimo PricingCategory = "LIMO"
)

type PricingRule struct {
	gorm.Model
	Category    PricingCategory `gorm:"type:string;not null" json:"category"`
	BaseFare    float64         `json:"base_fare"`
	PerKmRate   float64         `json:"per_km_rate"`
	PerMinRate  float64         `json:"per_min_rate"`
	ZoneID      string          `json:"zone_id"`
}

type SurgeMultiplier struct {
	gorm.Model
	ZoneID      string    `gorm:"uniqueIndex" json:"zone_id"`
	Multiplier  float64   `gorm:"default:1.0" json:"multiplier"`
	ExpiresAt   time.Time `json:"expires_at"`
}

type QuoteRequest struct {
	Category    PricingCategory `json:"category" binding:"required"`
	DistanceKm  float64         `json:"distance_km" binding:"required"`
	DurationMin int             `json:"duration_min" binding:"required"`
	ZoneID      string          `json:"zone_id" binding:"required"`
}

type QuoteResponse struct {
	BaseFare        float64 `json:"base_fare"`
	DistanceFare    float64 `json:"distance_fare"`
	DurationFare    float64 `json:"duration_fare"`
	SurgeMultiplier float64 `json:"surge_multiplier"`
	Subtotal        float64 `json:"subtotal"`
	VATAmount       float64 `json:"vat_amount"`
	TotalFare       float64 `json:"total_fare"`
	Currency        string  `json:"currency"`
}

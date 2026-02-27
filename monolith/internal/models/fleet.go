package models

import (
	"gorm.io/gorm"
	"time"
)

type VehicleAsset struct {
	gorm.Model
	VehicleID       uint      `gorm:"uniqueIndex" json:"vehicle_id"`
	VIN             string    `gorm:"uniqueIndex" json:"vin"`
	Make            string    `json:"make"`
	ModelName       string    `json:"model_name"`
	Year            int       `json:"year"`
	PurchaseDate    time.Time `json:"purchase_date"`
	PurchasePrice   float64   `json:"purchase_price"`
	CurrentValue    float64   `json:"current_value"`
	DepreciationRate float64  `json:"depreciation_rate"`
	Status          string    `json:"status"` // "ACTIVE", "MAINTENANCE", "RETIRED", "SOLD"
}

type FuelLog struct {
	gorm.Model
	VehicleID       uint      `json:"vehicle_id"`
	FuelCardID      string    `json:"fuel_card_id"`
	AmountLiters    float64   `json:"amount_liters"`
	Cost            float64   `json:"cost"`
	Odometer        float64   `json:"odometer"`
	Location        string    `json:"location"`
	AnomalyDetected bool      `json:"anomaly_detected"`
}

type PartMaintenance struct {
	gorm.Model
	VehicleID       uint      `json:"vehicle_id"`
	PartName        string    `json:"part_name"` // "TIRE_FL", "BRAKE_PAD", "OIL_FILTER"
	LastReplaceDate time.Time `json:"last_replace_date"`
	CurrentWear     float64   `json:"current_wear"` // 0.0 to 1.0
	PredictiveFailDate time.Time `json:"predictive_fail_date"`
}

type AssetValuation struct {
	gorm.Model
	VehicleID       uint      `json:"vehicle_id"`
	ValuationDate   time.Time `json:"valuation_date"`
	AIEstimatedPrice float64  `json:"ai_estimated_price"`
	MarketTrend     string    `json:"market_trend"` // "UP", "DOWN", "STABLE"
}

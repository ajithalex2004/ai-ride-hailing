package models

import (
	"time"

	"gorm.io/gorm"
)

type DemandPrediction struct {
	gorm.Model
	ZoneID         string    `gorm:"index" json:"zone_id"`
	PredictionTime time.Time `gorm:"index" json:"prediction_time"`
	PredictedCount int       `json:"predicted_count"`
	Confidence     float64   `json:"confidence"` // 0.0 - 1.0
	DemandLevel    string    `json:"demand_level"` // LOW, MEDIUM, HIGH, CRITICAL
}

type EventSignal struct {
	gorm.Model
	Name      string    `json:"name"`
	Location  string    `json:"location"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Impact    float64   `json:"impact"` // Multiplier for demand
}

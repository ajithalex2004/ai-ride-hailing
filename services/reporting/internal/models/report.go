package models

import (
	"time"

	"gorm.io/gorm"
)

type ReportType string

const (
	TypeFinancial ReportType = "FINANCIAL"
	TypeOperational ReportType = "OPERATIONAL"
	TypeDriverPerformance ReportType = "DRIVER_PERFORMANCE"
)

type DailyMetric struct {
	gorm.Model
	Date            time.Time `gorm:"uniqueIndex" json:"date"`
	TotalRides      int       `json:"total_rides"`
	TotalRevenue    float64   `json:"total_revenue"`
	TotalVAT        float64   `json:"total_vat"`
	CompletedRides  int       `json:"completed_rides"`
	CancelledRides  int       `json:"cancelled_rides"`
	AvgETAMinutes   float64   `json:"avg_eta_minutes"`
}

type TripReport struct {
	RideID      string    `json:"ride_id"`
	PassengerID uint      `json:"passenger_id"`
	DriverID    uint      `json:"driver_id"`
	FleetID     uint      `json:"fleet_id"`
	Fare        float64   `json:"fare"`
	VAT         float64   `json:"vat"`
	Status      string    `json:"status"`
	Timestamp   time.Time `json:"timestamp"`
}

package models

import (
	"gorm.io/gorm"
	"time"
)

type RoadIncident struct {
	gorm.Model
	ReporterID      uint      `gorm:"index" json:"reporter_id"`
	IncidentType    string    `json:"incident_type"` // "ACCIDENT", "BREAKDOWN", "STALL", "OBSTRUCTION"
	Severity        string    `json:"severity"`      // "MINOR", "MODERATE", "CRITICAL"
	SeverityScore   float64   `json:"severity_score"` // 0 to 1 (AI Scored)
	Lat             float64   `json:"lat"`
	Lng             float64   `json:"lng"`
	Description     string    `gorm:"type:text" json:"description"`
	MediaURLs       string    `gorm:"type:text" json:"media_urls"` // S3/CDN URLs for photos/videos
	Status          string    `json:"status"`       // "REPORTED", "DISPATCHED", "CLEARING", "RESOLVED"
	TowTruckID      *uint     `json:"tow_truck_id"`
	EscalatedAt     *time.Time `json:"escalated_at"`
	
	// Traffic Impact Fields
	CongestionRadiusKm  float64 `json:"congestion_radius_km"`
	EstimatedDelayMins  float64 `json:"estimated_delay_mins"`
	ClearanceTimeEstMin float64 `json:"clearance_time_est_min"`
	DiversionPolygon    string  `gorm:"type:text" json:"diversion_polygon"` // JSON string of lat/lng vertices
}

type TowTruck struct {
	gorm.Model
	VehicleNo       string    `gorm:"uniqueIndex" json:"vehicle_no"`
	Class           string    `json:"class"`        // "LIGHT", "HEAVY", "FLATBED", "ROTATOR"
	CurrentLat      float64   `json:"current_lat"`
	CurrentLng      float64   `json:"current_lng"`
	Status          string    `json:"status"`       // "AVAILABLE", "ON_JOB", "MAINTENANCE"
	IsActive        bool      `json:"is_active"`
}

type BreakdownAssistance struct {
	gorm.Model
	IncidentID      uint      `gorm:"index" json:"incident_id"`
	Type            string    `json:"type"`         // "BATTERY_JUMP", "TIRE_CHANGE", "FUEL_DELIVERY"
	FuelType        string    `json:"fuel_type"`   // "PETROL", "DIESEL"
	BatteryVoltage  string    `json:"battery_voltage"`
	AssignedTechID  uint      `json:"assigned_tech_id"`
	Status          string    `json:"status"`
}

type IncidentMetric struct {
	gorm.Model
	ZoneID          string    `gorm:"index" json:"zone_id"`
	ClearanceTimeSec int       `json:"clearance_time_sec"`
	IncidentID      uint      `json:"incident_id"`
	IsSLACompliant  bool      `json:"is_sla_compliant"`
}

package models

import (
	"gorm.io/gorm"
	"time"
)

type IncidentSeverity string

const (
	SeverityP1 IncidentSeverity = "P1_CRITICAL"
	SeverityP2 IncidentSeverity = "P2_URGENT"
	SeverityP3 IncidentSeverity = "P3_MINIMUM"
)

type RoadIncident struct {
	gorm.Model
	Type          string           `gorm:"index" json:"type"` // "CRASH", "STALL", "HAZARD"
	Severity      IncidentSeverity `json:"severity"`
	Description   string           `json:"description"`
	Latitude      float64          `json:"latitude"`
	Longitude     float64          `json:"longitude"`
	Address       string           `json:"address"`
	ReporterID    uint             `json:"reporter_id"` // 0 for anonymous citizen
	Status        string           `json:"status"`      // "PENDING", "VERIFIED", "RESPONDING", "CLOSED"
	
	// Media References
	MediaURLs     string           `json:"media_urls"` // Comma-separated
	
	// Dispatched Resources (References to UnifiedTrip)
	AmbulanceTripID *uint `json:"ambulance_trip_id"`
	TowTruckTripID  *uint `json:"tow_truck_trip_id"`
	PoliceUnitID    *uint `json:"police_unit_id"`
	
	VerifiedAt     *time.Time `json:"verified_at"`
	ClosedAt       *time.Time `json:"closed_at"`
}

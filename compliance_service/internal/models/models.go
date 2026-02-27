package models

import (
	"gorm.io/gorm"
	"time"
)

type AuditLog struct {
	gorm.Model
	ResourceID      string    `gorm:"index" json:"resource_id"` // E.g., INC-123 or AMB-404
	ResourceType    string    `json:"resource_type"`           // "INCIDENT", "DISPATCH", "ASSET"
	Action          string    `json:"action"`                  // "CREATED", "DISPATCHED", "RESOLVED"
	ActorID         string    `json:"actor_id"`
	IPAddress       string    `json:"ip_address"`
	Payload         string    `gorm:"type:text" json:"payload"` // JSON snapshot of the state
	Hash            string    `json:"hash"`                   // SHA-256 hash for integrity
}

type EmergencyKPI struct {
	gorm.Model
	ZoneID          string    `gorm:"index" json:"zone_id"`
	Date            time.Time `gorm:"index" json:"date"`
	AvgResponseTime float64   `json:"avg_response_time"` // Minutes
	SurvivalRate    float64   `json:"survival_rate"`    // Percentage within "Golden Hour"
	FleetReadiness  float64   `json:"fleet_readiness"`  // Percentage of units active
	IncidentCount   int       `json:"incident_count"`
}

type ComplianceReport struct {
	gorm.Model
	ReportType      string    `json:"report_type"` // "GOVERNMENT_MONTHLY", "LEGAL_AUDIT"
	GeneratedBy     string    `json:"generated_by"`
	PeriodStart     time.Time `json:"period_start"`
	PeriodEnd       time.Time `json:"period_end"`
	FileURL         string    `json:"file_url"`    // S3/CDN link to PDF/CSV
	Status          string    `json:"status"`      // "GENERATING", "COMPLETED", "FAILED"
}

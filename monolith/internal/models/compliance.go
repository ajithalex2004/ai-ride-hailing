package models

import (
	"gorm.io/gorm"
	"time"
)

type AuditLog struct {
	gorm.Model
	ActorID         uint      `gorm:"index" json:"actor_id"`
	ActorType       string    `json:"actor_type"` // "ADMIN", "SYSTEM", "DRIVER"
	Action          string    `json:"action"` // "DISPATCH_OVERRIDE", "FINANCIAL_EDIT", "CONFIG_CHANGE"
	Resource        string    `json:"resource"`
	ResourceID      string    `json:"resource_id"`
	OldValue        string    `gorm:"type:text" json:"old_value"`
	NewValue        string    `gorm:"type:text" json:"new_value"`
	IPAddress       string    `json:"ip_address"`
	EntryHash       string    `json:"entry_hash"` // Cryptographic hash for immutability
}

type DriverCompliance struct {
	gorm.Model
	DriverID        uint      `gorm:"uniqueIndex" json:"driver_id"`
	LicenseStatus   string    `json:"license_status"` // "VALID", "EXPIRED", "SUSPENDED"
	MedicalCertExpiry time.Time `json:"medical_cert_expiry"`
	BackgroundCheckStatus string `json:"background_check_status"`
	PoliceClearanceExpiry time.Time `json:"police_clearance_expiry"`
	IsEmergencyQualified bool   `json:"is_emergency_qualified"`
}

type FleetRegulatoryRecord struct {
	gorm.Model
	VehicleID       uint      `gorm:"index" json:"vehicle_id"`
	PermitNumber    string    `json:"permit_number"`
	PermitExpiry    time.Time `json:"permit_expiry"`
	InspectionStatus string   `json:"inspection_status"`
	EmissionCertified bool    `json:"emission_certified"`
	InsuranceCarrier string   `json:"insurance_carrier"`
	InsuranceExpiry  time.Time `json:"insurance_expiry"`
}

type TaxRule struct {
	gorm.Model
	RegionCode      string    `gorm:"uniqueIndex" json:"region_code"` // "UAE", "KSA", "QAT"
	VATRate         float64   `json:"vat_rate"`
	CorporateTaxRate float64  `json:"corporate_tax_rate"`
	IsTaxExempt     bool      `json:"is_tax_exempt"`
	LastUpdated     time.Time `json:"last_updated"`
}

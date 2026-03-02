package compliance

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
	"github.com/user/ai-ride-hailing/monolith/models"
	"gorm.io/gorm"
)

type ComplianceManager struct {
	db *gorm.DB
}

func NewComplianceManager(db *gorm.DB) *ComplianceManager {
	return &ComplianceManager{db: db}
}

func (m *ComplianceManager) LogAction(actorID uint, actorType, action, resource, resourceID, oldVal, newVal, ip string) error {
	// Create entry
	log := models.AuditLog{
		ActorID:    actorID,
		ActorType:  actorType,
		Action:     action,
		Resource:   resource,
		ResourceID: resourceID,
		OldValue:   oldVal,
		NewValue:   newVal,
		IPAddress:  ip,
	}

	// Generate Integrity Hash
	data := fmt.Sprintf("%d|%s|%s|%s|%s|%s|%s|%s", actorID, actorType, action, resource, resourceID, oldVal, newVal, time.Now().String())
	hash := sha256.Sum256([]byte(data))
	log.EntryHash = hex.EncodeToString(hash[:])

	return m.db.Create(&log).Error
}

func (m *ComplianceManager) IsDriverCompliant(driverID uint) (bool, string) {
	var compliance models.DriverCompliance
	if err := m.db.Where("driver_id = ?", driverID).First(&compliance).Error; err != nil {
		return false, "COMPLIANCE_RECORD_MISSING"
	}

	if compliance.LicenseStatus != "VALID" {
		return false, "LICENSE_INVALID"
	}

	if time.Now().After(compliance.MedicalCertExpiry) {
		return false, "MEDICAL_CERT_EXPIRED"
	}

	return true, "OK"
}

func (m *ComplianceManager) ValidateVehicle(vehicleID uint) (bool, string) {
	var record models.FleetRegulatoryRecord
	if err := m.db.Where("vehicle_id = ?", vehicleID).First(&record).Error; err != nil {
		return false, "REGULATORY_RECORD_MISSING"
	}

	if time.Now().After(record.PermitExpiry) {
		return false, "PERMIT_EXPIRED"
	}

	if record.InspectionStatus != "PASSED" {
		return false, "INSPECTION_REQUIRED"
	}

	return true, "OK"
}

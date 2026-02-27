package models

import (
	"gorm.io/gorm"
)

type BusinessRule struct {
	gorm.Model
	Key         string `gorm:"uniqueIndex" json:"key"` // "SLA_P1_MINUTES", "MAX_DRIVER_HOURS"
	Value       string `json:"value"`
	Category    string `json:"category"` // "COMPLIANCE", "OPERATIONAL", "SAFETY"
	Scope       string `json:"scope"`    // "GLOBAL", "TENANT_TYPE_GOVT", "TENANT_SPECIFIC"
	TenantID    *uint  `json:"tenant_id,omitempty"`
	Description string `json:"description"`
}

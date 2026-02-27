package models

import (
	"gorm.io/gorm"
)

type TenantSLA struct {
	gorm.Model
	TenantID uint   `gorm:"uniqueIndex:idx_tenant_priority"`
	Priority string `gorm:"uniqueIndex:idx_tenant_priority"` // "P1", "P2", "P3"
	Minutes  int    `json:"minutes"`
}

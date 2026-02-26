package models

import (
	"gorm.io/gorm"
)

type Fleet struct {
	gorm.Model
	Name         string `gorm:"uniqueIndex;not null" json:"name"`
	OperatorName string `json:"operator_name"`
	TaxID        string `json:"tax_id"` // GCC/Local Tax ID
	IsActive     bool   `gorm:"default:true" json:"is_active"`
}

type Vehicle struct {
	gorm.Model
	FleetID      uint   `json:"fleet_id"`
	PlateNumber  string `gorm:"uniqueIndex" json:"plate_number"`
	Model        string `json:"model"`
	Category     string `json:"category"` // TAXI or LIMO
	Year         int    `json:"year"`
	IsOnline     bool   `gorm:"default:false" json:"is_online"`
}

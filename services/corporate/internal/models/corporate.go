package models

import (
	"gorm.io/gorm"
)

type CorporateAccount struct {
	gorm.Model
	Name          string `gorm:"uniqueIndex;not null" json:"name"`
	ContactEmail  string `json:"contact_email"`
	CompanyID     string `gorm:"uniqueIndex" json:"company_id"`
	BillingAddress string `json:"billing_address"`
	IsActive      bool   `gorm:"default:true" json:"is_active"`
}

type Department struct {
	gorm.Model
	CorporateID uint   `json:"corporate_id"` // Reference to CorporateAccount
	Name        string `json:"name"`
}

type CostCenter struct {
	gorm.Model
	CorporateID uint   `json:"corporate_id"`
	Code        string `json:"code"`
	Name        string `json:"name"`
}

type TravelRule struct {
	gorm.Model
	CorporateID uint   `json:"corporate_id"`
	Name        string `json:"name"`
	MaxFare     float64 `json:"max_fare"`
	AllowedCategories []string `gorm:"type:text[]" json:"allowed_categories"` // e.g. ["TAXI", "LIMO"]
}

package models

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	RolePassenger UserRole = "PASSENGER"
	RoleDriver    UserRole = "DRIVER"
	RoleAdmin     UserRole = "ADMIN"
)

type User struct {
	gorm.Model
	Phone         string   `gorm:"uniqueIndex;not null" json:"phone"`
	Email         string   `gorm:"uniqueIndex" json:"email"`
	FullName      string   `json:"full_name"`
	Role          UserRole `gorm:"type:string;default:'PASSENGER'" json:"role"`
	FleetID       *uint    `json:"fleet_id"` // Reference to Fleet Operator for Drivers/Staff
	IsMFAEnabled  bool     `gorm:"default:true" json:"is_mfa_enabled"`
	DeviceBinding string   `json:"device_binding"` // UUID of the primary device
	LastLoginAt   time.Time `json:"last_login_at"`
}

type OTPLog struct {
	gorm.Model
	UserID    uint      `json:"user_id"`
	Code      string    `json:"code"`
	Purpose   string    `json:"purpose"` // e.g., "LOGIN", "PAYMENT_STEP_UP"
	ExpiresAt time.Time `json:"expires_at"`
	IsUsed    bool      `gorm:"default:false" json:"is_used"`
}

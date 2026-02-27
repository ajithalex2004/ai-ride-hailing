package models

import (
	"gorm.io/gorm"
	"time"
)

type RentalVehicle struct {
	gorm.Model
	PlateNumber  string  `json:"plate_number" gorm:"uniqueIndex"`
	Make         string  `json:"make"`
	ModelName    string  `json:"model_name"`
	Year         int     `json:"year"`
	Class        string  `json:"class"` // ECONOMY, LUXURY, SUV, VAN
	DailyRate    float64 `json:"daily_rate"`
	Status       string  `json:"status"` // AVAILABLE, RENTED, MAINTENANCE, DECOMMISSIONED
	Mileage      int     `json:"mileage"`
	LastService  time.Time `json:"last_service"`
	ResidualValue float64  `json:"residual_value"` // AI Predicted
}

type RentalBooking struct {
	gorm.Model
	VehicleID uint      `json:"vehicle_id"`
	CustomerID string    `json:"customer_id"`
	StartDate  time.Time `json:"start_date"`
	EndDate    time.Time `json:"end_date"`
	TotalAmount float64  `json:"total_amount"`
	Deposit    float64   `json:"deposit"`
	Status     string    `json:"status"` // PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED
}

type RentalContract struct {
	gorm.Model
	BookingID uint      `json:"booking_id"`
	SignedAt  time.Time `json:"signed_at"`
	Terms     string    `json:"terms"`
	AddOns    string    `json:"add_ons"` // JSON: GPS, Insurance_Waiver, Child_Seat
	IsSigned  bool      `json:"is_signed"`
}

type InspectionLog struct {
	gorm.Model
	VehicleID uint      `json:"vehicle_id"`
	LogDate   time.Time `json:"log_date"`
	Type      string    `json:"type"` // PRE_RENTAL, POST_RENTAL, ROUTINE
	StaffID   string    `json:"staff_id"`
	ImagesURL string    `json:"images_url"`
	Notes     string    `json:"notes"`
	IssuesFound bool    `json:"issues_found"`
}

type DamageClaim struct {
	gorm.Model
	BookingID uint      `json:"booking_id"`
	LogID     uint      `json:"log_id"`
	Amount    float64   `json:"amount"`
	ClaimURL  string    `json:"claim_url"`
	Status    string    `json:"status"` // OPEN, IN_REVIEW, APPROVED, REJECTED, CLOSED
}

type InsurancePolicy struct {
	gorm.Model
	Provider  string    `json:"provider"`
	PolicyNo  string    `json:"policy_no" gorm:"uniqueIndex"`
	VehicleID uint      `json:"vehicle_id"`
	Expiry    time.Time `json:"expiry"`
	Coverage  string    `json:"coverage"` // COMPREHENSIVE, THIRD_PARTY
}

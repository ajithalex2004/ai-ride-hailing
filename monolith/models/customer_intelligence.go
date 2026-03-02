package models

import (
	"gorm.io/gorm"
	"time"
)

type LoyaltyAccount struct {
	gorm.Model
	PassengerID     uint      `gorm:"index" json:"passenger_id"`
	PointsBalance   int       `json:"points_balance"`
	Tier            string    `json:"tier"` // "BRONZE", "SILVER", "GOLD", "PLATINUM"
	LifetimePoints  int       `json:"lifetime_points"`
}

type SubscriptionPlan struct {
	gorm.Model
	Name            string    `json:"name"` // "MONTHLY_COMMUTE", "LIMO_CIRCLE"
	PassengerID     uint      `gorm:"index" json:"passenger_id"`
	Status          string    `json:"status"` // "ACTIVE", "CANCELLED", "EXPIRED"
	StartDate       time.Time `json:"start_date"`
	EndDate         time.Time `json:"end_date"`
	RenewAutomatically bool   `json:"renew_automatically"`
}

type UserPreference struct {
	gorm.Model
	PassengerID     uint      `gorm:"uniqueIndex" json:"passenger_id"`
	PreferredVehicleClass string `json:"preferred_vehicle_class"`
	SmartBookingEnabled bool   `json:"smart_booking_enabled"`
	LastSuggestedRoute  string `json:"last_suggested_route"`
}

type PersonalizedRoute struct {
	gorm.Model
	PassengerID     uint      `gorm:"index" json:"passenger_id"`
	StartLocation   string    `json:"start_location"`
	EndLocation     string    `json:"end_location"`
	UsageFrequency  int       `json:"usage_frequency"`
	LastUsed        time.Time `json:"last_used"`
	IsFavorite      bool      `json:"is_favorite"`
}

package models

import (
	"gorm.io/gorm"
)

type Hospital struct {
	gorm.Model
	Name            string  `json:"name"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
	TotalERBeds     int     `json:"total_er_beds"`
	AvailableERBeds int     `json:"available_er_beds"`
	Specialties     string  `json:"specialties"` // Comma-separated: "Cardiac,Trauma,Pediatric"
	Status          string  `json:"status"`      // "ON_DIVERSION", "NORMAL"
}

package models

import (
	"time"

	"github.com/google/uuid"
)

type UserLocation struct {
	UserID    uint      `json:"user_id"`
	Role      string    `json:"role"` // DRIVER or PASSENGER
	RideID    *uuid.UUID `json:"ride_id,omitempty"`
	Lat       float64   `json:"lat"`
	Lng       float64   `json:"lng"`
	Bearing   float64   `json:"bearing"` // Orientation for map marker
	Timestamp time.Time `json:"timestamp"`
}

type WSMessage struct {
	Type    string      `json:"type"` // e.g., "LOCATION_UPDATE", "RIDE_STATUS"
	Payload interface{} `json:"payload"`
}

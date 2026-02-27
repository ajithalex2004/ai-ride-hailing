package models

import (
	"gorm.io/gorm"
	"time"
)

type School struct {
	gorm.Model
	Name     string `json:"name"`
	Address  string `json:"address"`
	TenantID string `gorm:"uniqueIndex" json:"tenant_id"`
}

type BusRoute struct {
	gorm.Model
	RouteName string    `json:"route_name"`
	SchoolID  uint      `json:"school_id"`
	BusID     string    `json:"bus_id"`
	DriverID  string    `json:"driver_id"`
	StartTime string    `json:"start_time"`
	TotalStops int      `json:"total_stops"`
	Stops     []BusStop `gorm:"foreignKey:RouteID" json:"stops"`
}

type BusStop struct {
	gorm.Model
	RouteID  uint    `json:"route_id"`
	StopName string  `json:"stop_name"`
	Lat      float64 `json:"lat"`
	Lng      float64 `json:"lng"`
	Sequence int     `json:"sequence"`
	ETA      string  `json:"eta"`
}

type Student struct {
	gorm.Model
	Name      string `json:"name"`
	SchoolID  uint   `json:"school_id"`
	ParentID  string `json:"parent_id"`
	RouteID   *uint  `json:"route_id"`
	StopID    *uint  `json:"stop_id"`
	RFIDCard  string `json:"rfid_card"`
}

type Attendance struct {
	gorm.Model
	StudentID uint      `json:"student_id"`
	BusID     string    `json:"bus_id"`
	Status    string    `json:"status"` // BOARDED, DROPPED, ABSENT
	Timestamp time.Time `json:"timestamp"`
}

type TransportBilling struct {
	gorm.Model
	SchoolID  uint      `json:"school_id"`
	StudentID uint      `json:"student_id"`
	Amount    float64   `json:"amount"`
	DueDate   time.Time `json:"due_date"`
	Status    string    `json:"status"` // PAID, PENDING, OVERDUE
}

package models

import (
	"gorm.io/gorm"
	"time"
)

type Corporation struct {
	gorm.Model
	Name     string `json:"name"`
	Industry string `json:"industry"`
	TenantID string `gorm:"uniqueIndex" json:"tenant_id"`
}

type Shift struct {
	gorm.Model
	CorpID    uint   `json:"corp_id"`
	ShiftName string `json:"shift_name"` // E.g., Morning Shift, Night Shift
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

type ShuttleRoute struct {
	gorm.Model
	RouteName string      `json:"route_name"`
	CorpID    uint        `json:"corp_id"`
	ShiftID   uint        `json:"shift_id"`
	BusID     string      `json:"bus_id"`
	DriverID  string      `json:"driver_id"`
	Stops     []ShuttleStop `gorm:"foreignKey:RouteID" json:"stops"`
}

type ShuttleStop struct {
	gorm.Model
	RouteID  uint    `json:"route_id"`
	StopName string  `json:"stop_name"`
	Lat      float64 `json:"lat"`
	Lng      float64 `json:"lng"`
	Sequence int     `json:"sequence"`
	ETA      string  `json:"eta"`
}

type Employee struct {
	gorm.Model
	Name         string `json:"name"`
	CorpID       uint   `json:"corp_id"`
	Department   string `json:"department"`
	EmployeeCode string `gorm:"uniqueIndex" json:"employee_code"`
	RouteID      *uint  `json:"route_id"`
	StopID       *uint  `json:"stop_id"`
	ShiftID      *uint  `json:"shift_id"`
	RFIDCard     string `json:"rfid_card"`
}

type SLARecord struct {
	gorm.Model
	RouteID     uint      `json:"route_id"`
	ActualTime  time.Time `json:"actual_time"`
	PlannedTime time.Time `json:"planned_time"`
	DelayMins   int       `json:"delay_mins"`
	Status      string    `json:"status"` // ON_TIME, DELAYED, CRITICAL_DELAY
	Penalty     float64   `json:"penalty"`
}

type CorporateInvoice struct {
	gorm.Model
	CorpID      uint      `json:"corp_id"`
	Department  string    `json:"department"`
	Amount      float64   `json:"amount"`
	PenaltyDeduction float64 `json:"penalty_deduction"`
	Period      string    `json:"period"` // E.g., March 2026
	Status      string    `json:"status"` // PENDING, PAID, OVERDUE
}

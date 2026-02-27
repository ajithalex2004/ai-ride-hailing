package models

import (
	"gorm.io/gorm"
	"time"
)

type Ambulance struct {
	gorm.Model
	VehicleID       uint      `gorm:"uniqueIndex" json:"vehicle_id"`
	Type            string    `json:"type"` // "ALS", "BLS", "PTS"
	Status          string    `json:"status"` // "AVAILABLE", "EN_ROUTE", "ON_SCENE", "AT_HOSPITAL", "MAINTENANCE"
	CurrentLat      float64   `json:"current_lat"`
	CurrentLng      float64   `json:"current_lng"`
	EquipmentList   string    `gorm:"type:text" json:"equipment_list"`
	IsOxygenFull    bool      `json:"is_oxygen_full"`
}

type Hospital struct {
	gorm.Model
	Name            string    `json:"name"`
	Lat             float64   `json:"lat"`
	Lng             float64   `json:"lng"`
	TotalBeds       int       `json:"total_beds"`
	AvailableBeds   int       `json:"available_beds"`
	Specialties     string    `json:"specialties"` // "CARDIAC,TRAUMA,BURN,PEDIATRIC"
	ERWaitTimeMins  int       `json:"er_wait_time_mins"`
	IsLevel1Trauma  bool      `json:"is_level_1_trauma"`
}

type CrewMember struct {
	gorm.Model
	Name            string    `json:"name"`
	Role            string    `json:"role"` // "PARAMEDIC", "EMT", "DRIVER"
	CertificationNo string    `json:"certification_no"`
	ExpiryDate      time.Time `json:"expiry_date"`
	CurrentStatus   string    `json:"current_status"` // "ON_DUTY", "OFF_DUTY", "ON_BREAK"
	AmbulanceID     *uint     `json:"ambulance_id"`
}

type EmergencyIncident struct {
	gorm.Model
	Priority        string    `json:"priority"` // "P1", "P2", "P3"
	IncidentType    string    `json:"incident_type"` // "CARDIAC", "TRAUMA", "RESPIRATORY"
	LocationLabel   string    `json:"location_label"`
	Lat             float64   `json:"lat"`
	Lng             float64   `json:"lng"`
	Status          string    `json:"status"` // "PENDING", "DISPATCHED", "RESOLVED"
	AmbulanceID     *uint     `json:"ambulance_id"`
	HospitalID      *uint     `json:"hospital_id"`
}

type ScheduledMedicalTransfer struct {
	gorm.Model
	PatientName     string    `json:"patient_name"`
	TransferType    string    `json:"transfer_type"` // "DIALYSIS", "ELDERY_CARE", "INTER_HOSPITAL"
	PickupLocation  string    `json:"pickup_location"`
	DropoffLocation string    `json:"dropoff_location"`
	PickupTime      time.Time `json:"pickup_time"`
	Frequency       string    `json:"frequency"` // "ONCE", "WEEKLY", "BIWEEKLY"
	EquipmentNeeded string    `json:"equipment_needed"`
	Status          string    `json:"status"`
}

type EquipmentInventory struct {
	gorm.Model
	AmbulanceID     uint      `gorm:"index" json:"ambulance_id"`
	EquipmentType   string    `json:"equipment_type"` 
	SerialNumber    string    `json:"serial_no"`
	Status          string    `json:"status"` 
	OxygenLevelPct  float64   `json:"oxygen_level_pct"`
	LastSelfTest    time.Time `json:"last_self_test"`
}

type FatigueTelemetry struct {
	gorm.Model
	CrewID          uint      `gorm:"index" json:"crew_id"`
	FatigueScore    float64   `json:"fatigue_score"` 
	HoursOnDuty     float64   `json:"hours_on_duty"`
	AlertTriggered  bool      `json:"alert_triggered"`
	LockoutActive   bool      `json:"lockout_active"`
}

type ResponsePerformance struct {
	gorm.Model
	ZoneID          string    `gorm:"index" json:"zone_id"`
	Priority        string    `json:"priority"` 
	ResponseTimeSec int       `json:"response_time_sec"`
	IsSLACompliant  bool      `json:"is_sla_compliant"`
	IncidentID      uint      `json:"incident_id"`
	Timestamp       time.Time `json:"timestamp"`
}

package services

import (
	"log"
	"time"
	"github.com/user/ai-ride-hailing/monolith/models"
	"gorm.io/gorm"
)

type CorporateScheduler struct {
	db *gorm.DB
}

func NewCorporateScheduler(db *gorm.DB) *CorporateScheduler {
	return &CorporateScheduler{db: db}
}

func (s *CorporateScheduler) ProcessRecurringRides() {
	now := time.Now()
	var schedules []models.RecurringSchedule
	
	// Find active schedules due for execution
	s.db.Where("is_active = ? AND scheduled_time <= ?", true, now).Find(&schedules)

	for _, schedule := range schedules {
		log.Printf("[CorporateScheduler] Executing Recurring Ride: Contract %d, CostCenter %d", schedule.ContractID, schedule.CostCenterID)
		
		trip := models.UnifiedTrip{
			Domain:      "TRANSPORT",
			RequestType: "CORPORATE_SHUTTLE",
			IsCorporate:  true,
			ContractID:   &schedule.ContractID,
			CostCenterID: &schedule.CostCenterID,
			ScheduleID:   &schedule.ID,
			PickupLat:    schedule.PickupLat,
			PickupLng:    schedule.PickupLng,
			DropoffLat:   schedule.DropoffLat,
			DropoffLng:   schedule.DropoffLng,
			Status:       models.StatusPending,
		}

		s.db.Create(&trip)

		// Update next scheduled time based on frequency
		next := schedule.ScheduledTime.AddDate(0, 0, 1) // Default Daily
		s.db.Model(&schedule).Update("scheduled_time", next)
	}
}

func (s *CorporateScheduler) AllocateDedicatedFleet(contractID uint, vehicleID uint) error {
	allocation := models.FleetAllocation{
		ContractID: contractID,
		VehicleID:  vehicleID,
		IsLocked:   true,
	}
	return s.db.Create(&allocation).Error
}

func (s *CorporateScheduler) IsVehicleReserved(vehicleID uint) bool {
	var count int64
	s.db.Model(&models.FleetAllocation{}).Where("vehicle_id = ? AND is_locked = ?", vehicleID, true).Count(&count)
	return count > 0
}

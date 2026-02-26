package services

import (
	"errors"
	"time"

	"github.com/user/ai-ride-hailing/services/ride/internal/models"
	"gorm.io/gorm"
)

type RideService struct {
	db *gorm.DB
}

func NewRideService(db *gorm.DB) *RideService {
	return &RideService{db: db}
}

func (s *RideService) CreateRide(passengerID uint, category models.RideCategory, pickup, dropoff models.Location, scheduledTime *time.Time) (*models.Ride, error) {
	ride := &models.Ride{
		PassengerID:    passengerID,
		Category:       category,
		PickupLat:      pickup.Lat,
		PickupLng:      pickup.Lng,
		PickupAddress:  pickup.Address,
		DropoffLat:     dropoff.Lat,
		DropoffLng:     dropoff.Lng,
		DropoffAddress: dropoff.Address,
		Status:         models.StatusSearching,
	}

	// Limo-Specific logic
	if category == models.CategoryLimo {
		if scheduledTime == nil {
			return nil, errors.New("scheduled time is required for Limo bookings")
		}
		ride.ScheduledTime = scheduledTime
		ride.Status = models.StatusPreBooked
		// Fixed fare calculation for Limo (Mock logic)
		ride.EstimatedFare = 150.0 
	} else {
		// Metered estimate for Taxi (Mock logic)
		ride.EstimatedFare = 45.0
	}

	// Calculate VAT (GCC 5%)
	ride.VATAmount = ride.EstimatedFare * 0.05
	ride.Currency = "AED"

	if err := s.db.Create(ride).Error; err != nil {
		return nil, err
	}

	return ride, nil
}

func (s *RideService) UpdateRideStatus(rideID string, status models.RideStatus) error {
	return s.db.Model(&models.Ride{}).Where("ride_id = ?", rideID).Update("status", status).Error
}

func (s *RideService) AssignDriver(rideID string, driverID uint) error {
	status := models.StatusDriverAssigned
	return s.db.Model(&models.Ride{}).Where("ride_id = ?", rideID).Updates(map[string]interface{}{
		"driver_id": driverID,
		"status":    status,
	}).Error
}

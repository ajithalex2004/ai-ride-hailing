package customer

import (
	"encoding/json"
	"fmt"
	"net/http"
	"bytes"
	"github.com/user/ai-ride-hailing/monolith/models"
	"gorm.io/gorm"
)

type CustomerService struct {
	db *gorm.DB
}

func NewCustomerService(db *gorm.DB) *CustomerService {
	return &CustomerService{db: db}
}

func (s *CustomerService) ApplyVIPPriority(passengerID uint, currentETA int) int {
	// 1. Fetch Passenger Loyalty Tier
	var account models.LoyaltyAccount
	if err := s.db.Where("passenger_id = ?", passengerID).First(&account).Error; err != nil {
		return currentETA
	}

	// 2. Apply ETA reduction based on tier
	priorityReduction := 0
	switch account.Tier {
	case "PLATINUM":
		priorityReduction = 3 // -3 mins priority boost
	case "GOLD":
		priorityReduction = 2 // -2 mins priority boost
	case "SILVER":
		priorityReduction = 1 // -1 min priority boost
	}

	newETA := currentETA - priorityReduction
	if newETA < 1 {
		newETA = 1
	}
	return newETA
}

func (s *CustomerService) HandleTripCompletion(passengerID uint, tripFare float64) error {
	// 1. Calculate Points (1 Point per Dollar/AED)
	pointsToAdd := int(tripFare)

	// 2. Sync with .NET Loyalty Ledger
	payload := fmt.Sprintf(`{"passengerId": %d, "amount": %d}`, passengerID, pointsToAdd)
	resp, err := http.Post("http://localhost:9000/api/erp/Customer/loyalty/add-points", "application/json", bytes.NewBuffer([]byte(payload)))
	
	if err != nil || resp.StatusCode != 200 {
		return fmt.Errorf("LOYALTY_SYNC_FAILED")
	}

	// 3. Update local cache/DB
	var account models.LoyaltyAccount
	s.db.Where("passenger_id = ?", passengerID).First(&account)
	account.PointsBalance += pointsToAdd
	account.LifetimePoints += pointsToAdd
	s.db.Save(&account)

	return nil
}

func (s *CustomerService) GetSmartBookingSuggestions(passengerID uint, lat, lng float64) (map[string]interface{}, error) {
	// Call Python AI for suggestions
	payload := fmt.Sprintf(`{"passenger_id": %d, "current_lat": %f, "current_lng": %f, "time_of_day": "evening"}`, passengerID, lat, lng)
	resp, err := http.Post("http://localhost:9005/heuristics/predictive_booking", "application/json", bytes.NewBuffer([]byte(payload)))
	
	if err != nil || resp.StatusCode != 200 {
		return nil, fmt.Errorf("PREDICTION_UNAVAILABLE")
	}

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	return result, nil
}

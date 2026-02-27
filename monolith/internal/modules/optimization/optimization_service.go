package optimization

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"bytes"
	"time"
	"github.com/user/ai-ride-hailing/monolith/internal/models"
	"gorm.io/gorm"
)

type OptimizationService struct {
	db *gorm.DB
}

func NewOptimizationService(db *gorm.DB) *OptimizationService {
	return &OptimizationService{db: db}
}

func (s *OptimizationService) GetRepositioningCommand(driverID uint, lat, lng float64) (string, string) {
	// Call Python AI for Idle Optimization
	// Mocking demand data for nearby zones
	payload := fmt.Sprintf(`{"driver_lat": %f, "driver_lng": %f, "historical_wait_times": [18.5, 22.0], "nearby_zone_demand": [12.0, 45.0, 10.0]}`, lat, lng)
	resp, _ := http.Post("http://localhost:9005/heuristics/idle_optimizer", "application/json", bytes.NewBuffer([]byte(payload)))
	
	if resp != nil && resp.StatusCode == 200 {
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if result["recommended_action"].(string) == "REPOSITION_TO_DEMAND" {
			return "REPOSITION", result["target_zone_id"].(string)
		}
	}
	
	return "STAY", ""
}

func (s *OptimizationService) AuditTripCancellationRisk(tripID uint, eta int, distance float64) {
	// Call Python AI for Cancellation Prediction
	payload := fmt.Sprintf(`{"trip_eta_minutes": %d, "driver_distance_km": %f, "passenger_rating": 4.9, "historical_area_cancellation_rate": 0.12}`, eta, distance)
	resp, _ := http.Post("http://localhost:9005/heuristics/cancellation_predictor", "application/json", bytes.NewBuffer([]byte(payload)))
	
	if resp != nil && resp.StatusCode == 200 {
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		risk := result["cancellation_probability"].(float64)
		
		riskModel := models.CancellationRisk{
			TripID:        tripID,
			RiskScore:     risk,
			PrimaryFactor: result["risk_level"].(string),
			LastChecked:   time.Now(),
		}
		s.db.Save(&riskModel)
		
		if risk > 0.7 {
			log.Printf("[OptimizationAI] HIGH_CANCELLATION_RISK: Trip %d. Pre-emptive driver backup triggered.", tripID)
		}
	}
}

func (s *OptimizationService) GetSurgeMultiplier(zoneID string) float64 {
	// Call Python AI for Surge Probability
	payload := fmt.Sprintf(`{"zone_id": "%s", "current_time": "%s", "weather_impact": 0.1, "event_density": 0.8}`, zoneID, time.Now().Format(time.RFC3339))
	resp, _ := http.Post("http://localhost:9005/heuristics/surge_probability", "application/json", bytes.NewBuffer([]byte(payload)))
	
	if resp != nil && resp.StatusCode == 200 {
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		return result["surge_multiplier_forecast"].(float64)
	}
	
	return 1.0
}

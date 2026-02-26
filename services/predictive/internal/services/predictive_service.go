package services

import (
	"math"
	"math/rand"
	"time"

	"github.com/user/ai-ride-hailing/services/predictive/internal/models"
	"gorm.io/gorm"
)

type PredictiveService struct {
	db *gorm.DB
}

func NewPredictiveService(db *gorm.DB) *PredictiveService {
	return &PredictiveService{db: db}
}

func (s *PredictiveService) PredictZoneDemand(zoneID string, futureTime time.Time) (*models.DemandPrediction, error) {
	// In a real system, this would involve a TensorFlow/PyTorch model serving layer
	// Or querying a Time Series DB like InfluxDB/Prometheus for historical windowing.

	// Mock AI logic: Consideration of time-of-day and randomness
	hour := futureTime.Hour()
	baseDemand := 10.0
	
	// Peak hours: 8-10 AM and 5-8 PM
	if (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20) {
		baseDemand = 50.0
	}

	// Add some "AI" fluctuation
	variation := rand.Float64() * 20.0
	predicted := int(baseDemand + variation)

	level := "LOW"
	if predicted > 60 {
		level = "CRITICAL"
	} else if predicted > 40 {
		level = "HIGH"
	} else if predicted > 20 {
		level = "MEDIUM"
	}

	prediction := &models.DemandPrediction{
		ZoneID:         zoneID,
		PredictionTime: futureTime,
		PredictedCount: predicted,
		Confidence:     0.85 + rand.Float64()*0.1,
		DemandLevel:    level,
	}

	if err := s.db.Create(prediction).Error; err != nil {
		return nil, err
	}

	return prediction, nil
}

func (s *PredictiveService) GetHeatmap(currentTime time.Time) ([]models.DemandPrediction, error) {
	// Returns current predictions for all major zones
	zones := []string{"DXB_DOWNTOWN", "DXB_MARINA", "DXB_AIRPORT", "DXB_DIFC"}
	var results []models.DemandPrediction
	for _, z := range zones {
		p, _ := s.PredictZoneDemand(z, currentTime)
		results = append(results, *p)
	}
	return results, nil
}

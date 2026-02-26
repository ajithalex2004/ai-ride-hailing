package services

import (
	"fmt"
	"math"
	"github.com/user/ai-ride-hailing/services/fraud/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FraudEngine struct {
	db *gorm.DB
}

func NewFraudEngine(db *gorm.DB) *FraudEngine {
	return &FraudEngine{db: db}
}

// AssessRisk runs real-time checks and returns a score
func (e *FraudEngine) AssessRisk(entityID uuid.UUID, entityType string, data map[string]interface{}) (*models.RiskAssessment, error) {
	score := 0.0
	reasons := []string{}

	// 1. Velocity Check (GPS Spoofing)
	if lat1, ok1 := data["prev_lat"].(float64); ok1 {
		lat2 := data["curr_lat"].(float64)
		lng1 := data["prev_lng"].(float64)
		lng2 := data["curr_lng"].(float64)
		timeDiff := data["time_diff_sec"].(float64)

		dist := e.calculateDistance(lat1, lng1, lat2, lng2)
		velocity := (dist / timeDiff) * 3600 // km/h

		if velocity > 160 { // Impossible speed for city driving
			score += 0.6
			reasons = append(reasons, fmt.Sprintf("Velocity Anomaly: %.2f km/h detected", velocity))
		}
	}

	// 2. Transaction Frequency Check
	if txCount, ok := data["recent_tx_count"].(int); ok && txCount > 5 {
		score += 0.4
		reasons = append(reasons, "High frequency transaction pattern detected")
	}

	status := models.StatusClean
	if score >= 0.8 {
		status = models.StatusBlocked
	} else if score >= 0.4 {
		status = models.StatusFlagged
	}

	assessment := &models.RiskAssessment{
		EntityID:   entityID,
		EntityType: entityType,
		Score:      math.Min(score, 1.0),
		Status:     status,
		Reasons:    reasons,
	}

	e.db.Create(assessment)
	return assessment, nil
}

// Haversine formula for distance
func (e *FraudEngine) calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371 // Earth radius in km
	dLat := (lat2 - lat1) * (math.Pi / 180)
	dLon := (lon2 - lon1) * (math.Pi / 180)
	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1*(math.Pi/180))*math.Cos(lat2*(math.Pi/180))*
			math.Sin(dLon/2)*math.Sin(dLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	return R * c
}

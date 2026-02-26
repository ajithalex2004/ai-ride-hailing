package services

import (
	"math/rand"

	"github.com/user/ai-ride-hailing/services/dispatch/internal/models"
)

// AISignalEngine simulates complex data signals used for dispatch optimization.
type AISignalEngine struct{}

func NewAISignalEngine() *AISignalEngine {
	return &AISignalEngine{}
}

type DriverSignals struct {
	Rating             float64
	AcceptanceRate     float64
	HistoricalETADelta float64 // How accurate their past ETAs were
	CurrentTrafficLoad float64 // Localized traffic factor (0.0 - 2.0)
}

func (e *AISignalEngine) GetDriverSignals(driverID uint) DriverSignals {
	// In production, this would fetch from a Feature Store (e.g. Feast) or Redis
	return DriverSignals{
		Rating:             4.2 + rand.Float64()*0.8,
		AcceptanceRate:     0.7 + rand.Float64()*0.3,
		HistoricalETADelta: rand.Float64() * 2.0,
		CurrentTrafficLoad: 0.8 + rand.Float64()*1.2,
	}
}

// CalculateOptimalScore implements the weighting logic for the Dispatch AI.
func (e *AISignalEngine) CalculateOptimalScore(dist float64, eta int, signals DriverSignals) float64 {
	// Weights for optimization priority
	const (
		W_ETA        = -2.5 // Lower ETA is better
		W_Rating     = 1.5  // Higher rating is better
		W_Acceptance = 1.0  // Higher acceptance rate is better
		W_Traffic    = -0.5 // High traffic should be avoided if possible
	)

	score := (float64(eta) * W_ETA) + 
			 (signals.Rating * W_Rating) + 
			 (signals.AcceptanceRate * W_Acceptance) + 
			 (signals.CurrentTrafficLoad * W_Traffic)

	return score
}

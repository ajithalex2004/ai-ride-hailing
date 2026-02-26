package services

import (
	"math/rand"
	"sort"
	"github.com/user/ai-ride-hailing/services/dispatch/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DispatchService struct {
	db       *gorm.DB
	aiEngine *AISignalEngine
}

func NewDispatchService(db *gorm.DB) *DispatchService {
	return &DispatchService{
		db:       db,
		aiEngine: NewAISignalEngine(),
	}
}

// FindBestDriver implements the "Dispatch by ETA" and ranking logic.
func (s *DispatchService) FindBestDriver(rideID uuid.UUID, lat, lng float64, category string) (*models.DriverMatch, error) {
	// 1. Log the dispatch attempt
	request := &models.DispatchRequest{
		RideID:    rideID,
		PickupLat: lat,
		PickupLng: lng,
		Category:  category,
	}
	if err := s.db.Create(request).Error; err != nil {
		return nil, err
	}

	// 2. Mock AI Ranking Logic: Get available drivers in the area
	// In a real system, this would query a real-time location index (Redis GEOFencing)
	drivers := s.getAvailableDriversNearby(lat, lng, category)
	
	if len(drivers) == 0 {
		request.Status = models.DispatchTimeout
		s.db.Save(request)
		return nil, nil
	}

	// 3. Rank drivers by AI score (Weighted signals)
	for i := range drivers {
		signals := s.aiEngine.GetDriverSignals(drivers[i].DriverID)
		drivers[i].RankingScore = s.aiEngine.CalculateOptimalScore(drivers[i].Distance, drivers[i].ETA, signals)
	}

	sort.Slice(drivers, func(i, j int) bool {
		return drivers[i].RankingScore > drivers[j].RankingScore
	})

	bestMatch := drivers[0]
	bestMatch.RequestID = request.RequestID
	
	// 4. Record the match
	if err := s.db.Create(&bestMatch).Error; err != nil {
		return nil, err
	}

	request.Status = models.DispatchMatched
	s.db.Save(request)

	return &bestMatch, nil
}

// getAvailableDriversNearby simulates AI-driven driver discovery
func (s *DispatchService) getAvailableDriversNearby(lat, lng float64, category string) []models.DriverMatch {
	// Mocking 3 drivers
	var mockMatches []models.DriverMatch
	for i := 1; i <= 3; i++ {
		eta := rand.Intn(10) + 1
		dist := float64(eta) * 0.8
		// AI Ranking formula (Simplified): Higher rating + Lower ETA = Better score
		score := (5.0 / float64(eta)) * (rand.Float64() + 0.5)
		
		mockMatches = append(mockMatches, models.DriverMatch{
			DriverID:     uint(rand.Intn(1000)),
			ETA:          eta,
			Distance:     dist,
			RankingScore: score,
		})
	}
	return mockMatches
}

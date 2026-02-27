package services

import (
	"fmt"
	"log"
	"math/rand"
	"sort"
	"github.com/user/ai-ride-hailing/services/dispatch/internal/clients"
	"github.com/user/ai-ride-hailing/services/dispatch/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type DispatchService struct {
	db           *gorm.DB
	aiEngine     *AISignalEngine
	configClient *clients.DomainConfigClient
}

func NewDispatchService(db *gorm.DB) *DispatchService {
	return &DispatchService{
		db:           db,
		aiEngine:     NewAISignalEngine(),
		configClient: clients.NewDomainConfigClient(),
	}
}

// FindBestDriver implements the "Dispatch by ETA" and ranking logic with domain-specific rules.
func (s *DispatchService) FindBestDriver(rideID uuid.UUID, lat, lng float64, category string, priority models.PriorityLevel, domain string) (*models.DriverMatch, error) {
	// Fetch domain configuration
	config, _ := s.configClient.GetDomainConfig(domain)
	
	// If Auto-Dispatch is disabled for this domain, exit early
	if config != nil && !config.AutoDispatch {
		return nil, nil // Let manual dispatch or another workflow handle it
	}
	// 1. Log the dispatch attempt
	request := &models.DispatchRequest{
		RideID:    rideID,
		PickupLat: lat,
		PickupLng: lng,
		Category:  category,
		Priority:  priority,
	}
	if err := s.db.Create(request).Error; err != nil {
		return nil, err
	}

	// 2. Resource Management: Fleet Quota Locking
	// If it's a standard ride but the emergency reserve is low, limit driver availability
	if domain == "TRANSPORT" && config != nil && config.FleetQuotaReserve > 0 {
		// Mock logic: In a real system, we'd check active emergency counts
		if rand.Float64() < config.FleetQuotaReserve {
			return nil, fmt.Errorf("fleet quota reserved for emergency domain")
		}
	}

	// 3. Mock AI Ranking Logic: Get available drivers in the area
	drivers := s.getAvailableDriversNearby(lat, lng, category, priority)
	
	if len(drivers) == 0 {
		request.Status = models.DispatchTimeout
		// SLA Enforcement: Alert if emergency timeout
		if priority == models.PriorityP1 || (config != nil && config.StrictSLAEnforcement) {
			log.Printf("CRITICAL SLA BREACH: No driver for P1 emergency %s", rideID)
		}
		s.db.Save(request)
		return nil, nil
	}

	// 4. Auto-Trip Merging (Logistics/Route optimization logic)
	if config != nil && config.AutoTripMerging {
		// Mock: Check for nearby active rides to merge
		log.Printf("Domain-Rule: Auto-Trip Merging active for %s", rideID)
	}

	// 5. Rank drivers by AI score
	for i := range drivers {
		// Crew Readiness Check
		if config != nil && config.CrewReadinessCheck {
			// Mock: Verify paramedic certification
			if drivers[i].DriverID % 2 != 0 { // Mock failure for odd IDs
				drivers[i].RankingScore = 0
				continue
			}
		}
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
	request.ActualResponseTime = int(time.Since(request.StartedAt).Seconds())
	s.db.Save(request)

	return &bestMatch, nil
}

// getAvailableDriversNearby simulates AI-driven driver discovery with priority awareness
func (s *DispatchService) getAvailableDriversNearby(lat, lng float64, category string, priority models.PriorityLevel) []models.DriverMatch {
	// P1 (Emergency) search has a wider radius and more aggressive matching
	driverCount := 3
	if priority == models.PriorityP1 || priority == models.PriorityP2 {
		driverCount = 6 // Scan more drivers/resources for emergencies
	}

	var mockMatches []models.DriverMatch
	for i := 1; i <= driverCount; i++ {
		eta := rand.Intn(10) + 1
		dist := float64(eta) * 0.8
		
		// AI Ranking formula (Simplified)
		score := (5.0 / float64(eta)) * (rand.Float64() + 0.5)
		
		// Priority Boost: P1/P2 requests get a ranking boost to ensure fast assignment
		if priority == models.PriorityP1 {
			score *= 2.0
		} else if priority == models.PriorityP2 {
			score *= 1.5
		}

		mockMatches = append(mockMatches, models.DriverMatch{
			DriverID:     uint(rand.Intn(1000)),
			ETA:          eta,
			Distance:     dist,
			RankingScore: score,
		})
	}
	return mockMatches
}

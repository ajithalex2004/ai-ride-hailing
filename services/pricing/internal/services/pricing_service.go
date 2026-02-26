package services

import (
	"time"

	"github.com/user/ai-ride-hailing/services/pricing/internal/models"
	"gorm.io/gorm"
)

type PricingService struct {
	db *gorm.DB
}

func NewPricingService(db *gorm.DB) *PricingService {
	return &PricingService{db: db}
}

func (s *PricingService) CalculateQuote(req models.QuoteRequest) (*models.QuoteResponse, error) {
	// 1. Fetch pricing rule for category and zone
	var rule models.PricingRule
	err := s.db.Where("category = ? AND zone_id = ?", req.Category, req.ZoneID).First(&rule).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Default rules if zone not found
			rule = s.getDefaultRule(req.Category)
		} else {
			return nil, err
		}
	}

	// 2. Fetch active surge multiplier
	var surge models.SurgeMultiplier
	err = s.db.Where("zone_id = ? AND expires_at > ?", req.ZoneID, time.Now()).First(&surge).Error
	multiplier := 1.0
	if err == nil {
		multiplier = surge.Multiplier
	}

	// 3. Calculate fare
	distanceFare := req.DistanceKm * rule.PerKmRate
	durationFare := float64(req.DurationMin) * rule.PerMinRate
	
	subtotal := (rule.BaseFare + distanceFare + durationFare) * multiplier
	
	// Special Limo logic (Fixed minimums)
	if req.Category == models.CategoryLimo && subtotal < 100.0 {
		subtotal = 100.0 // Minimum Limo fare
	}

	// 4. GCC VAT (5%)
	vatAmount := subtotal * 0.05
	totalFare := subtotal + vatAmount

	return &models.QuoteResponse{
		BaseFare:        rule.BaseFare,
		DistanceFare:    distanceFare,
		DurationFare:    durationFare,
		SurgeMultiplier: multiplier,
		Subtotal:        subtotal,
		VATAmount:       vatAmount,
		TotalFare:       totalFare,
		Currency:        "AED",
	}, nil
}

func (s *PricingService) SetSurge(zoneID string, multiplier float64, duration time.Duration) error {
	expiresAt := time.Now().Add(duration)
	return s.db.Where(models.SurgeMultiplier{ZoneID: zoneID}).
		Assign(models.SurgeMultiplier{Multiplier: multiplier, ExpiresAt: expiresAt}).
		FirstOrCreate(&models.SurgeMultiplier{}).Error
}

func (s *PricingService) getDefaultRule(category models.PricingCategory) models.PricingRule {
	if category == models.CategoryLimo {
		return models.PricingRule{
			BaseFare:   50.0,
			PerKmRate:  5.0,
			PerMinRate: 1.0,
		}
	}
	return models.PricingRule{
		BaseFare:   12.0,
		PerKmRate:  2.5,
		PerMinRate: 0.5,
	}
}

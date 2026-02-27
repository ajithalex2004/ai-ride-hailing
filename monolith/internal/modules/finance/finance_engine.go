package finance

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"bytes"
	"github.com/user/ai-ride-hailing/monolith/internal/models"
	"gorm.io/gorm"
)

type FinancialEngine struct {
	db *gorm.DB
}

func NewFinancialEngine(db *gorm.DB) *FinancialEngine {
	return &FinancialEngine{db: db}
}

func (e *FinancialEngine) CalculateDomainFees(domain string, baseAmount float64) (map[string]interface{}, error) {
	commissionRate := 0.20 // Default

	switch domain {
	case "EMERGENCY":
		commissionRate = 0.05 // Government subsidized
	case "ROUTE_BASED":
		commissionRate = 0.12 // Contract volume discount
	case "ASSET_LEASING":
		commissionRate = 0.15 // Higher margin for rental
	case "ON_DEMAND":
		commissionRate = 0.20 // Standard rate
	}

	platformCut := baseAmount * commissionRate
	
	return map[string]interface{}{
		"domain":            domain,
		"base_amount":      baseAmount,
		"platform_cut":     platformCut,
		"net_to_operator":  baseAmount - platformCut,
		"commission_rate": commissionRate,
	}, nil
}

func (e *FinancialEngine) CalculateTripFees(tripID uint, baseFare float64, driverRating float64) (map[string]interface{}, error) {
	// 1. Fetch Tenant Commission Rules
	var commission models.CommissionStructure
	e.db.First(&commission) // Simplifying to first for now, should be tenant-scoped

	platformCut := baseFare * 0.20 // Default 20%
	if commission.Type == "TIER_BASED" && baseFare > commission.ThresholdAmount {
		platformCut = baseFare * commission.IncentiveRate
	}

	// 2. Multi-Currency Display (Simulated - Fetching from .NET ERP)
	// resp, _ := http.Get("http://localhost:9000/api/erp/Finance/exchange-rates")
	// For now, hardcode some rates
	aedToUsd := 0.27
	aedToSar := 1.02

	return map[string]interface{}{
		"trip_id": tripID,
		"base_fare_aed": baseFare,
		"platform_fee_aed": platformCut,
		"driver_net_aed": baseFare - platformCut,
		"currency_previews": map[string]float64{
			"USD": baseFare * aedToUsd,
			"SAR": baseFare * aedToSar,
		},
		"commission_model": commission.Type,
	}, nil
}

func (e *FinancialEngine) GetFinancialForecast(tenantID uint) (map[string]interface{}, error) {
	// Call Python AI for Forecasting
	payload := fmt.Sprintf(`{"tenant_id": %d, "historical_revenue": [1200.0, 1400.0, 1100.0, 1500.0], "time_horizon_days": 30}`, tenantID)
	resp, err := http.Post("http://localhost:9005/heuristics/financial_projection", "application/json", bytes.NewBuffer([]byte(payload)))
	
	if err != nil || resp.StatusCode != 200 {
		return nil, fmt.Errorf("AI_FORECAST_UNAVAILABLE")
	}

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	return result, nil
}

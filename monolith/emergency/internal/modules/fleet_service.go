package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"bytes"
	"github.com/user/ai-ride-hailing/monolith/internal/models"
	"gorm.io/gorm"
)

type FleetManager struct {
	db *gorm.DB
}

func NewFleetManager(db *gorm.DB) *FleetManager {
	return &FleetManager{db: db}
}

func (m *FleetManager) LogFuelTransaction(logEntry models.FuelLog) error {
	// Simple Anomaly Detection Logic
	// If cost/liter > threshold OR consumption spike
	var lastLog models.FuelLog
	m.db.Where("vehicle_id = ?", logEntry.VehicleID).Order("created_at desc").First(&lastLog)

	if lastLog.ID != 0 {
		kmTraveled := logEntry.Odometer - lastLog.Odometer
		if kmTraveled > 0 {
			fuelEfficiency := logEntry.AmountLiters / kmTraveled
			if fuelEfficiency > 0.35 { // Example anomaly threshold (35L/100km)
				log.Printf("[FleetManager] FUEL_ANOMALY: Vehicle %d, Efficiency: %.2f L/km", logEntry.VehicleID, fuelEfficiency)
				logEntry.AnomalyDetected = true
			}
		}
	}

	return m.db.Create(&logEntry).Error
}

func (m *FleetManager) ValidateDriverForVehicle(driverID uint, vehicleID uint) (bool, string) {
	var vehicle models.VehicleAsset
	m.db.Where("vehicle_id = ?", vehicleID).First(&vehicle)
	
	// Determine Tier
	tier := "STANDARD"
	if vehicle.PurchasePrice > 150000 { tier = "PREMIUM" }
	
	// Call Python AI for Match Validation
	// Assuming Driver Rating = 4.8, Experience = 5 (In production, fetch from driver profile)
	payload := fmt.Sprintf(`{"driver_rating": 4.8, "experience_years": 5, "vehicle_class": "%s"}`, tier)
	resp, _ := http.Post("http://localhost:9005/heuristics/driver_match_optimization", "application/json", bytes.NewBuffer([]byte(payload)))
	
	if resp != nil && resp.StatusCode == 200 {
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		return result["recommendation"].(string) == "APPROVED", result["reason"].(string)
	}
	
	return true, "Fallback Approved"
}

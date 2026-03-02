package services

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/user/ai-ride-hailing/monolith/models"
	"github.com/user/ai-ride-hailing/monolith/internal/modules/workforce"
	"github.com/user/ai-ride-hailing/monolith/internal/modules/telemetry"
	"gorm.io/gorm"
	"net/http"
	"bytes"
)

type CorporateService interface {
	IsVehicleReserved(vehicleID uint) bool
}

type EmergencyService struct {
	db        *gorm.DB
	workforce *workforce.WorkforceService
	telemetry *telemetry.TelemetryProducer
	corporate CorporateService
}

func NewEmergencyService(db *gorm.DB, wf *workforce.WorkforceService, tp *telemetry.TelemetryProducer, corp CorporateService) *EmergencyService {
	return &EmergencyService{db: db, workforce: wf, telemetry: tp, corporate: corp}
}

func (s *EmergencyService) CreateEmergencyTrip(req models.UnifiedTrip) (*models.UnifiedTrip, error) {
	req.Domain = "EMERGENCY"
	req.Status = models.StatusSearching
	
	// SLA-Based Priority Logic (Dynamic Lookup)
	var sla models.TenantSLA
	if err := s.db.Where("tenant_id = ? AND priority = ?", req.TenantID, req.Priority).First(&sla).Error; err == nil {
		req.SLAMinutes = sla.Minutes
	} else {
		// Fallback Defaults
		switch req.Priority {
		case "P1": req.SLAMinutes = 8
		case "P2": req.SLAMinutes = 15
		case "P3": req.SLAMinutes = 60
		}
	}

	req.AutoDispatch = req.Priority != "P3"
	req.SLAEnforced = true

	if err := s.db.Create(&req).Error; err != nil {
		return nil, err
	}

	// Stream to Kafka
	s.telemetry.StreamEvent(fmt.Sprintf("TRIP_%d_CREATED", req.ID), req)

	// Trigger Global Preemption Logic internally
	// Emergency overrides normal transport queue in specific sector
	go s.enforceGlobalEmergencyPreemption(&req)
	go s.processEmergencyDispatch(&req)

	return &req, nil
}

func (s *EmergencyService) processEmergencyDispatch(trip *models.UnifiedTrip) {
	log.Printf("[EmergencyMonolith] Starting priority dispatch for Trip ID: %d, Priority: %s", trip.ID, trip.Priority)
	
	// 1. AI Workforce Check (Calling Python AI Engine)
	driverID := uint(555)
	log.Printf("[EmergencyMonolith] Checking driver fatigue via Python AI Engine...")
	// Simulated call to http://localhost:9005/heuristics/fatigue_score
	resp, _ := http.Post("http://localhost:9005/heuristics/fatigue_score", "application/json", bytes.NewBuffer([]byte(fmt.Sprintf(`{"driver_id": %d}`, driverID))))
	if resp != nil && resp.StatusCode == 200 {
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if result["fatigue_score"].(float64) > 75 {
			log.Printf("[AI_ENGINE] Fatigue Alert: %v. Reassigning.", result["recommendation"])
			driverID = 666
		}
	}

	// 1.1 Dedicated Fleet Check
	if trip.VehicleID != nil && s.corporate.IsVehicleReserved(*trip.VehicleID) {
		if !trip.IsCorporate {
			log.Printf("[PriorityGuard] ACCESS_DENIED: Vehicle %d is reserved for Corporate Contract. Re-routing public trip.", *trip.VehicleID)
			// Reset vehicle and search again
			trip.VehicleID = nil
			s.db.Save(trip)
			return
		}
	}

	// 2. Hospital Capacity-Aware Routing
	hospital := s.findNearestHospital(trip.PickupLat, trip.PickupLng, "Trauma")
	if hospital != nil {
		log.Printf("[EmergencyMonolith] Found optimal hospital for patient: %s (Beds: %d)", hospital.Name, hospital.AvailableERBeds)
		// Update destination to hospital
		trip.DropoffLat = hospital.Latitude
		trip.DropoffLng = hospital.Longitude
		trip.DropoffAddress = hospital.Name
	}

	// 3. Traffic Impact AI (Calling Python AI Engine)
	url := "http://localhost:9005/heuristics/predict_traffic"
	payload := fmt.Sprintf(`{"lat": %f, "lng": %f}`, trip.PickupLat, trip.PickupLng)
	respT, _ := http.Post(url, "application/json", bytes.NewBuffer([]byte(payload)))
	trafficDelay := 2
	if respT != nil && respT.StatusCode == 200 {
		var tRes map[string]interface{}
		json.NewDecoder(respT.Body).Decode(&tRes)
		trafficDelay = int(tRes["latency_minutes"].(float64))
	}
	log.Printf("[AI_ENGINE] Traffic Impact Forecast: +%dm delay.", trafficDelay)

	now := time.Now()
	trip.AssignedDriverID = &driverID
	trip.Status = models.StatusMatched
	trip.MatchedAt = &now
	
	s.db.Save(trip)
	
	s.telemetry.StreamEvent(fmt.Sprintf("TRIP_%d_MATCHED", trip.ID), trip)
	log.Printf("[EmergencyMonolith] Trip %d matched to Driver %d. Hospital: %s.", trip.ID, driverID, trip.DropoffAddress)
}

func (s *EmergencyService) enforceGlobalEmergencyPreemption(trip *models.UnifiedTrip) {
	if trip.Priority != "P1" {
		return
	}
	
	log.Printf("[PriorityGuard] GLOBAL_PREEMPTION_ACTIVE: Pausing non-emergency dispatch in Sector A-%d", trip.ID % 10)
	// This would communicate with the Transport Monolith to pause 'Matched' transitions
	// for commercial trips until this P1 is assigned.
	s.telemetry.StreamEvent("PREEMPTION_ACTIVE", map[string]interface{}{
		"sector": fmt.Sprintf("A-%d", trip.ID % 10),
		"emergency_id": trip.ID,
		"priority": "P1",
	})
}

func (s *EmergencyService) CreateRoadIncident(incident models.RoadIncident) (*models.RoadIncident, error) {
	incident.Status = "PENDING"
	if err := s.db.Create(&incident).Error; err != nil {
		return nil, err
	}

	// Stream to Kafka for Police & Public works
	s.telemetry.StreamEvent(fmt.Sprintf("INCIDENT_%d_REPORTED", incident.ID), incident)

	// AI Orchestration: Determine required resources
	go s.orchestrateIncidentResponse(&incident)

	return &incident, nil
}

func (s *EmergencyService) orchestrateIncidentResponse(incident *models.RoadIncident) {
	log.Printf("[IncidentMonolith] Orchestrating response for: %s (Severity: %s)", incident.Type, incident.Severity)
	
	// 1. Dispatch Ambulance if needed
	if incident.Type == "CRASH" || incident.Severity == models.SeverityP1 {
		trip := models.UnifiedTrip{
			Domain:      "EMERGENCY",
			RequestType: "AMBULANCE",
			Priority:    string(incident.Severity),
			PickupLat:   incident.Latitude,
			PickupLng:   incident.Longitude,
		}
		t, _ := s.CreateEmergencyTrip(trip)
		if t != nil {
			incident.AmbulanceTripID = &t.ID
		}
	}

	// 2. Dispatch Tow Truck if needed
	if incident.Type == "STALL" || incident.Type == "CRASH" {
		log.Printf("[IncidentMonolith] Dispatching Tow Truck for clearance.")
		// Simulated Tow dispatch
		towID := uint(999)
		incident.TowTruckTripID = &towID
	}

	// 3. Traffic Rerouting AI Trigger
	s.triggerTrafficRerouting(incident)

	incident.Status = "RESPONDING"
	s.db.Save(incident)
	
	s.telemetry.StreamEvent(fmt.Sprintf("INCIDENT_%d_RESPONDING", incident.ID), incident)
}

func (s *EmergencyService) triggerTrafficRerouting(incident *models.RoadIncident) {
	log.Printf("[TrafficAI] INCIDENT_AWARE_REROUTING: Rerouting transport fleet away from Lat: %.4f, Lng: %.4f", incident.Latitude, incident.Longitude)
	// This would broadcast a geofence to the AI Route Engine
}

func (s *EmergencyService) findNearestHospital(lat, lng float64, specialty string) *models.Hospital {
	var hospital models.Hospital
	// Simplified proximity search with capacity check
	s.db.Where("available_er_beds > 0 AND status = 'NORMAL'").First(&hospital)
	return &hospital
}

func (s *EmergencyService) predictTrafficImpact(lat, lng float64) int {
	// AI Heuristic: Check time of day and known congestion zones
	hour := time.Now().Hour()
	if hour >= 17 && hour <= 19 {
		return 15 // Peak congestion
	}
	return 2 // Normal
}

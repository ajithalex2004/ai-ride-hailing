package services

import (
	"log"
	"time"

	"github.com/user/ai-ride-hailing/monolith/internal/models"
	"gorm.io/gorm"
)

type TransportService struct {
	db        *gorm.DB
	workforce *workforce.WorkforceService
	telemetry *telemetry.TelemetryProducer
}

func NewTransportService(db *gorm.DB, wf *workforce.WorkforceService, tp *telemetry.TelemetryProducer) *TransportService {
	return &TransportService{db: db, workforce: wf, telemetry: tp}
}

func (s *TransportService) CreateTransportTrip(req models.UnifiedTrip) (*models.UnifiedTrip, error) {
	req.Domain = "TRANSPORT"
	req.Status = models.StatusPending
	
	if req.RequestType == "CORP_SHUTTLE" {
		req.AutoTripMerging = true
	}
	
	if req.RequestType == "CORP_VIP" {
		req.ApprovalRequired = true
		req.Status = models.StatusPendingApproval
	} else {
		req.Status = models.StatusSearching
		req.AutoDispatch = true
	}

	if err := s.db.Create(&req).Error; err != nil {
		return nil, err
	}

	// Stream Created event
	s.telemetry.StreamEvent(fmt.Sprintf("TRANSPORT_TRIP_%d_CREATED", req.ID), req)

	if req.AutoDispatch {
		go s.processTransportDispatch(&req)
	}

	return &req, nil
}

func (s *TransportService) processTransportDispatch(trip *models.UnifiedTrip) {
	log.Printf("[TransportMonolith] Starting dispatch for Trip ID: %d, Type: %s", trip.ID, trip.RequestType)
	
	driverID := uint(777)
	
	// Safety Check: Fatigue monitoring
	fatigue := s.workforce.CalculateFatigue(driverID)
	if fatigue > 90 {
		log.Printf("[TransportMonolith] Driver %d critically fatigued (%.2f). Skipping for safety.", driverID, fatigue)
		driverID = 888 // Selection fallback
	}

	now := time.Now()
	trip.AssignedDriverID = &driverID
	trip.Status = models.StatusMatched
	trip.MatchedAt = &now
	
	s.db.Save(trip)
	
	// Stream Matched event
	s.telemetry.StreamEvent(fmt.Sprintf("TRANSPORT_TRIP_%d_MATCHED", trip.ID), trip)
	
	log.Printf("[TransportMonolith] Trip %d matched to Driver %d.", trip.ID, driverID)
}

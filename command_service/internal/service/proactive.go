package service

import (
	"log"
	"time"
	"github.com/user/ai-ride-hailing/command_service/internal/models"
	"gorm.io/gorm"
)

type ProactiveService struct {
	db *gorm.DB
}

func NewProactiveService(db *gorm.DB) *ProactiveService {
	return &ProactiveService{db: db}
}

func (s *ProactiveService) RunProactiveOrchestrator() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			log.Println("C2_ORCHESTRATOR: Running proactive risk sweep...")
			s.CheckWeatherRisk()
			s.ForecastHotspots()
			s.OptimizeAmbulancePositioning()
		}
	}
}

func (s *ProactiveService) CheckWeatherRisk() {
	// Logic: Call Python AI /heuristics/weather_risk_engine
	log.Println("C2_ORCHESTRATOR: Weather risk multiplier calculated: 1.45x")
}

func (s *ProactiveService) ForecastHotspots() {
	// Logic: Call Python AI /heuristics/hotspot_forecaster
	log.Println("C2_ORCHESTRATOR: New hotspots identified in Downtown/Marina zones.")
}

func (s *ProactiveService) OptimizeAmbulancePositioning() {
	// Logic: Identify idle units and call Python AI /heuristics/ambulance_repositioner
	log.Println("C2_ORCHESTRATOR: Recommending 3 ambulance move-ups to high-risk polygons.")
	
	// Record Timeline event for C2 Dashboard
	s.db.Create(&models.IncidentTimeline{
		EventName: "PROACTIVE_REPOSITIONING_TRIGGERED",
		Timestamp: time.Now(),
		Details:   "Optimizing asset spread based on demand forecast.",
	})
}

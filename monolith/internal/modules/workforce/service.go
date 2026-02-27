package workforce

import (
	"log"
	"math"
	"time"

	"gorm.io/gorm"
)

type WorkforceService struct {
	db *gorm.DB
}

func NewWorkforceService(db *gorm.DB) *WorkforceService {
	return &WorkforceService{db: db}
}

// CalculateFatigue uses a simplified AI heuristic based on shift duration and breaks
func (s *WorkforceService) CalculateFatigue(driverID uint) float64 {
	var currentShift DriverShift
	if err := s.db.Where("driver_id = ? AND status = ?", driverID, ShiftActive).Order("start_time desc").First(&currentShift).Error; err != nil {
		return 0
	}

	durationHours := time.Since(currentShift.StartTime).Hours()
	
	// Base score: 10 points per hour
	score := durationHours * 10.0
	
	// Exponential fatigue after 8 hours
	if durationHours > 8 {
		score += math.Pow(durationHours-8, 2) * 5
	}

	// Update record
	var fScore FatigueScore
	s.db.FirstOrCreate(&fScore, FatigueScore{DriverID: driverID})
	fScore.Score = score
	fScore.LastCheckAt = time.Now()
	if score > 80 {
		fScore.AlertTriggered = true
		log.Printf("[WorkforceAI] FATIGUE ALERT: Driver %d is at %.2f fatigue score!", driverID, score)
	}
	s.db.Save(&fScore)

	return score
}

func (s *WorkforceService) CheckSkills(driverID uint, requiredSkills []string) bool {
	var skills []DriverSkill
	s.db.Where("driver_id = ? AND certified_until > ?", driverID, time.Now()).Find(&skills)

	skillMap := make(map[string]bool)
	for _, sk := range skills {
		skillMap[sk.SkillName] = true
	}

	for _, req := range requiredSkills {
		if !skillMap[req] {
			return false
		}
	}
	return true
}

func (s *WorkforceService) GenerateAIPlan(date time.Time) {
	log.Printf("[WorkforceAI] Generating shift plan for %s based on historic demand...", date.Format("2006-01-02"))
	// In a real scenario, this would call a Python ML service or use a pre-trained model.
	// For Phase 2, we simulate the output.
}

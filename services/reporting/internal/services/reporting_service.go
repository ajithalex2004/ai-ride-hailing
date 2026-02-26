package services

import (
	"time"

	"github.com/user/ai-ride-hailing/services/reporting/internal/models"
	"gorm.io/gorm"
)

type ReportingService struct {
	db *gorm.DB
}

func NewReportingService(db *gorm.DB) *ReportingService {
	return &ReportingService{db: db}
}

// AggregateDailyMetrics would typically be a background job (Cron)
func (s *ReportingService) AggregateDailyMetrics(date time.Time) (*models.DailyMetric, error) {
	// In a real system, this service would query Ride and Payment services
	// or a read-replica/data-warehouse.
	
	// Mock aggregation logic
	metric := &models.DailyMetric{
		Date:           date,
		TotalRides:     1250,
		TotalRevenue:   45000.00,
		TotalVAT:       2250.00, // 5% of revenue
		CompletedRides: 1100,
		CancelledRides: 150,
		AvgETAMinutes:  4.5,
	}

	if err := s.db.Where(models.DailyMetric{Date: date}).Assign(metric).FirstOrCreate(&metric).Error; err != nil {
		return nil, err
	}

	return metric, nil
}

func (s *ReportingService) GetFinancialReport(start, end time.Time) ([]models.DailyMetric, error) {
	var metrics []models.DailyMetric
	err := s.db.Where("date >= ? AND date <= ?", start, end).Order("date asc").Find(&metrics).Error
	return metrics, err
}

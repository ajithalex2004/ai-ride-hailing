package services

import (
	"github.com/user/ai-ride-hailing/services/fleet/internal/models"
	"gorm.io/gorm"
)

type FleetService struct {
	db *gorm.DB
}

func NewFleetService(db *gorm.DB) *FleetService {
	return &FleetService{db: db}
}

func (s *FleetService) CreateFleet(name, operator, taxID string) (*models.Fleet, error) {
	fleet := &models.Fleet{
		Name:         name,
		OperatorName: operator,
		TaxID:        taxID,
	}
	if err := s.db.Create(fleet).Error; err != nil {
		return nil, err
	}
	return fleet, nil
}

func (s *FleetService) RegisterVehicle(fleetID uint, plate, model, category string, year int) (*models.Vehicle, error) {
	v := &models.Vehicle{
		FleetID:     fleetID,
		PlateNumber: plate,
		Model:       model,
		Category:    category,
		Year:        year,
	}
	if err := s.db.Create(v).Error; err != nil {
		return nil, err
	}
	return v, nil
}

package services

import (
	"github.com/user/ai-ride-hailing/services/domain-config/internal/models"
	"gorm.io/gorm"
)

type DomainConfigService struct {
	db *gorm.DB
}

func NewDomainConfigService(db *gorm.DB) *DomainConfigService {
	return &DomainConfigService{db: db}
}

func (s *DomainConfigService) GetConfig(domainType models.DomainType) (*models.DomainConfiguration, error) {
	var config models.DomainConfiguration
	err := s.db.Where("domain_type = ?", domainType).First(&config).Error
	return &config, err
}

func (s *DomainConfigService) UpsertConfig(config *models.DomainConfiguration) error {
	return s.db.Save(config).Error
}

func (s *DomainConfigService) ListConfigs() ([]models.DomainConfiguration, error) {
	var configs []models.DomainConfiguration
	err := s.db.Order("sort_order asc").Find(&configs).Error
	return configs, err
}

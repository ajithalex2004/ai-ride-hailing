package services

import (
	"github.com/user/ai-ride-hailing/services/domain-config/internal/models"
	"gorm.io/gorm"
)

type PolicyService struct {
	db *gorm.DB
}

func NewPolicyService(db *gorm.DB) *PolicyService {
	return &PolicyService{db: db}
}

func (s *PolicyService) GetActivePolicies(policyType models.PolicyType) ([]models.GlobalPolicy, error) {
	var policies []models.GlobalPolicy
	err := s.db.Where("type = ? AND is_active = ?", policyType, true).Find(&policies).Error
	return policies, err
}

func (s *PolicyService) SavePolicy(policy *models.GlobalPolicy) error {
	return s.db.Save(policy).Error
}

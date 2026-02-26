package services

import (
	"github.com/user/ai-ride-hailing/services/corporate/internal/models"
	"gorm.io/gorm"
)

type CorporateService struct {
	db *gorm.DB
}

func NewCorporateService(db *gorm.DB) *CorporateService {
	return &CorporateService{db: db}
}

func (s *CorporateService) CreateAccount(name, email, companyID string) (*models.CorporateAccount, error) {
	acc := &models.CorporateAccount{
		Name:         name,
		ContactEmail: email,
		CompanyID:    companyID,
	}
	if err := s.db.Create(acc).Error; err != nil {
		return nil, err
	}
	return acc, nil
}

func (s *CorporateService) AddDepartment(corpID uint, name string) (*models.Department, error) {
	dept := &models.Department{CorporateID: corpID, Name: name}
	if err := s.db.Create(dept).Error; err != nil {
		return nil, err
	}
	return dept, nil
}

func (s *CorporateService) AddCostCenter(corpID uint, code, name string) (*models.CostCenter, error) {
	cc := &models.CostCenter{CorporateID: corpID, Code: code, Name: name}
	if err := s.db.Create(cc).Error; err != nil {
		return nil, err
	}
	return cc, nil
}

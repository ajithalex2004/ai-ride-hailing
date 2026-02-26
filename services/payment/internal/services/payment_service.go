package services

import (
	"errors"
	"fmt"

	"github.com/user/ai-ride-hailing/services/payment/internal/models"
	"gorm.io/gorm"
)

type PaymentService struct {
	db *gorm.DB
}

func NewPaymentService(db *gorm.DB) *PaymentService {
	return &PaymentService{db: db}
}

func (s *PaymentService) ProcessStripePayment(userID uint, amount float64, vat float64, currency string) (*models.Payment, error) {
	// Create local record
	payment := &models.Payment{
		UserID:    userID,
		Amount:    amount,
		VATAmount: vat,
		Currency:  currency,
		Gateway:   "STRIPE",
		Status:    models.StatusPending,
	}

	if err := s.db.Create(payment).Error; err != nil {
		return nil, err
	}

	// Mock Stripe Call
	fmt.Printf("[MOCK STRIPE] Charging %f %s to User %d\n", amount+vat, currency, userID)
	
	// Simulate success
	payment.Status = models.StatusSucceeded
	payment.GatewayRef = "pi_mock_123456"
	s.db.Save(payment)

	return payment, nil
}

func (s *PaymentService) GetWallet(userID uint) (*models.Wallet, error) {
	var wallet models.Wallet
	err := s.db.Where("user_id = ?", userID).First(&wallet).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			wallet = models.Wallet{UserID: userID, Balance: 0.0, Currency: "AED"}
			s.db.Create(&wallet)
			return &wallet, nil
		}
		return nil, err
	}
	return &wallet, nil
}

func (s *PaymentService) TopUpWallet(userID uint, amount float64) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var wallet models.Wallet
		if err := tx.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
			return err
		}

		wallet.Balance += amount
		if err := tx.Save(&wallet).Error; err != nil {
			return err
		}

		// Record transaction
		transaction := &models.Transaction{
			WalletID:    wallet.ID,
			Amount:      amount,
			Type:        models.TypeWalletTopup,
			Description: "Wallet top-up via app",
		}
		return tx.Create(transaction).Error
	})
}

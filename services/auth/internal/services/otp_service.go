package services

import (
	"crypto/rand"
	"fmt"
	"io"
	"time"

	"github.com/user/ai-ride-hailing/services/auth/internal/models"
	"gorm.io/gorm"
)

type OTPService struct {
	db *gorm.DB
}

func NewOTPService(db *gorm.DB) *OTPService {
	return &OTPService{db: db}
}

func (s *OTPService) GenerateOTP(userID uint, purpose string) (string, error) {
	code := s.generateNumericCode(6)
	
	otpLog := models.OTPLog{
		UserID:    userID,
		Code:      code,
		Purpose:   purpose,
		ExpiresAt: time.Now().Add(10 * time.Minute),
	}

	if err := s.db.Create(&otpLog).Error; err != nil {
		return "", err
	}

	// In a real scenario, this is where you'd call Twilio/SMS-GCC or Email service
	fmt.Printf("DEBUG: Sent OTP %s to User %d for %s\n", code, userID, purpose)

	return code, nil
}

func (s *OTPService) VerifyOTP(userID uint, code string, purpose string) (bool, error) {
	var otpLog models.OTPLog
	err := s.db.Where("user_id = ? AND code = ? AND purpose = ? AND is_used = ? AND expires_at > ?", 
		userID, code, purpose, false, time.Now()).First(&otpLog).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, err
	}

	// Mark as used
	otpLog.IsUsed = true
	s.db.Save(&otpLog)

	return true, nil
}

func (s *OTPService) generateNumericCode(max int) string {
	var table = [...]byte{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}
	b := make([]byte, max)
	n, err := io.ReadAtLeast(rand.Reader, b, max)
	if n != max || err != nil {
		panic(err)
	}
	for i := 0; i < len(b); i++ {
		b[i] = table[int(b[i])%len(table)]
	}
	return string(b)
}

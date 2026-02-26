package services

import (
	"fmt"
	"time"

	"github.com/user/ai-ride-hailing/services/notification/internal/models"
	"gorm.io/gorm"
)

type NotificationService struct {
	db *gorm.DB
}

func NewNotificationService(db *gorm.DB) *NotificationService {
	return &NotificationService{db: db}
}

func (s *NotificationService) SendNotification(notif *models.Notification) error {
	// 1. Log the notification attempt
	if err := s.db.Create(notif).Error; err != nil {
		return err
	}

	// 2. Route based on type (Mock implementations)
	var err error
	switch notif.Type {
	case models.TypeSMS:
		err = s.sendSMS(notif.Recipient, notif.Body)
	case models.TypePush:
		err = s.sendPush(notif.Recipient, notif.Title, notif.Body)
	case models.TypeEmail:
		err = s.sendEmail(notif.Recipient, notif.Title, notif.Body)
	}

	// 3. Update status
	now := time.Now()
	if err != nil {
		notif.Status = models.StatusFailed
		notif.ErrorMsg = err.Error()
	} else {
		notif.Status = models.StatusSent
		notif.SentAt = &now
	}

	return s.db.Save(notif).Error
}

func (s *NotificationService) sendSMS(phone, body string) error {
	// Mock integration with Twilio or GCC provider
	fmt.Printf("[MOCK SMS] To: %s | Body: %s\n", phone, body)
	return nil
}

func (s *NotificationService) sendPush(token, title, body string) error {
	// Mock integration with Firebase Cloud Messaging (FCM)
	fmt.Printf("[MOCK PUSH] Token: %s | Title: %s | Body: %s\n", token, title, body)
	return nil
}

func (s *NotificationService) sendEmail(email, title, body string) error {
	// Mock integration with AWS SES or SendGrid
	fmt.Printf("[MOCK EMAIL] To: %s | Title: %s\n", email, title)
	return nil
}

package models

import (
	"time"

	"gorm.io/gorm"
)

type NotificationType string

const (
	TypePush  NotificationType = "PUSH"
	TypeSMS   NotificationType = "SMS"
	TypeEmail NotificationType = "EMAIL"
)

type NotificationStatus string

const (
	StatusPending NotificationStatus = "PENDING"
	StatusSent    NotificationStatus = "SENT"
	StatusFailed  NotificationStatus = "FAILED"
)

type Notification struct {
	gorm.Model
	UserID    uint               `json:"user_id"`
	Type      NotificationType   `gorm:"type:string;not null" json:"type"`
	Title     string             `json:"title"`
	Body      string             `json:"body"`
	Recipient string             `json:"recipient"` // Phone number, Email, or Push Token
	Status    NotificationStatus `gorm:"type:string;default:'PENDING'" json:"status"`
	ScheduledAt *time.Time       `json:"scheduled_at"`
	SentAt      *time.Time       `json:"sent_at"`
	ErrorMsg    string           `json:"error_msg"`
}

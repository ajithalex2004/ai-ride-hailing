package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PaymentStatus string

const (
	StatusPending   PaymentStatus = "PENDING"
	StatusSucceeded PaymentStatus = "SUCCEEDED"
	StatusFailed    PaymentStatus = "FAILED"
	StatusRefunded  PaymentStatus = "REFUNDED"
)

type TransactionType string

const (
	TypeRideCharge  TransactionType = "RIDE_CHARGE"
	TypeWalletTopup TransactionType = "WALLET_TOPUP"
	TypePayout      TransactionType = "PAYOUT"
)

type Wallet struct {
	gorm.Model
	UserID    uint    `gorm:"uniqueIndex" json:"user_id"`
	Currency  string  `gorm:"default:'AED'" json:"currency"`
	Balance   float64 `gorm:"default:0.0" json:"balance"`
	IsLocked  bool    `gorm:"default:false" json:"is_locked"`
}

type Payment struct {
	gorm.Model
	PaymentID     uuid.UUID     `gorm:"type:uuid;uniqueIndex;not null" json:"payment_id"`
	RideID        *uuid.UUID    `json:"ride_id"`
	UserID        uint          `json:"user_id"`
	Amount        float64       `json:"amount"`
	VATAmount     float64       `json:"vat_amount"`
	Currency      string        `json:"currency"`
	Status        PaymentStatus `gorm:"type:string;default:'PENDING'" json:"status"`
	Gateway       string        `json:"gateway"` // e.g., "STRIPE", "WALLET"
	GatewayRef    string        `json:"gateway_ref"` // Stripe Payment Intent ID
}

type Transaction struct {
	gorm.Model
	TransactionID uuid.UUID       `gorm:"type:uuid;uniqueIndex" json:"transaction_id"`
	WalletID      uint            `json:"wallet_id"`
	Amount        float64         `json:"amount"`
	Type          TransactionType `gorm:"type:string" json:"type"`
	Description   string          `json:"description"`
}

func (p *Payment) BeforeCreate(tx *gorm.DB) (err error) {
	p.PaymentID = uuid.New()
	return
}

func (t *Transaction) BeforeCreate(tx *gorm.DB) (err error) {
	t.TransactionID = uuid.New()
	return
}

package main

import (
	"log"
	"os"
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/user/ai-ride-hailing/shuttle_service/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Database Connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/shuttle_db"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 2. Auto-Migrate
	db.AutoMigrate(
		&models.Corporation{},
		&models.Shift{},
		&models.ShuttleRoute{},
		&models.ShuttleStop{},
		&models.Employee{},
		&models.SLARecord{},
		&models.CorporateInvoice{},
	)

	app := fiber.New(fiber.Config{
		AppName: "Employee_Shuttle_Service_V1",
	})

	api := app.Group("/api/shuttle")

	// Corporate Enrollment
	api.Post("/enroll", func(c *fiber.Ctx) error {
		var emp models.Employee
		if err := c.BodyParser(&emp); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		db.Create(&emp)
		return c.Status(201).JSON(emp)
	})

	// SLA Tracking
	api.Post("/sla/report", func(c *fiber.Ctx) error {
		var sla models.SLARecord
		if err := c.BodyParser(&sla); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		
		// Penalty logic: 100 AED per 5 mins delay over 5 mins
		if sla.DelayMins > 5 {
			intervals := (sla.DelayMins - 5) / 5
			sla.Penalty = float64(intervals * 100)
			sla.Status = "DELAYED"
		} else {
			sla.Status = "ON_TIME"
		}
		
		db.Create(&sla)
		return c.Status(201).JSON(sla)
	})

	// Corporate Billing & ERP-Payroll Integration
	api.Post("/billing/generate-invoice", func(c *fiber.Ctx) error {
		var req struct { CorpID uint `json:"corp_id"`; Period string `json:"period"` }
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		
		// Aggregate penalties for the period
		var totalPenalty float64
		db.Model(&models.SLARecord{}).
			Where("status = 'DELAYED'").
			Select("SUM(penalty)").Row().Scan(&totalPenalty)
		
		var employees []models.Employee
		db.Where("corp_id = ?", req.CorpID).Find(&employees)
		
		// Base calculation: 450 AED per seat per month
		baseAmount := float64(len(employees)) * 450.0
		finalAmount := baseAmount - totalPenalty
		
		invoice := models.CorporateInvoice{
			CorpID:           req.CorpID,
			Amount:           finalAmount,
			PenaltyDeduction: totalPenalty,
			Period:           req.Period,
			Status:           "PENDING",
		}
		db.Create(&invoice)
		
		// Sync with ERP AR Controller
		log.Printf("[ERP_SHUTTLE_SYNC] Consolidating AR for Corp %d: Net $%v (Penalties -$%v)", req.CorpID, finalAmount, totalPenalty)
		
		return c.JSON(fiber.Map{
			"status": "SUCCESS",
			"invoice_id": invoice.ID,
			"net_amount": finalAmount,
			"penalties_applied": totalPenalty,
		})
	})

	// High Availability / Health
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ALIVE", "service": "Employee_Shuttle_Management"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "9040"
	}
	log.Fatal(app.Listen(":" + port))
}

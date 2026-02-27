package main

import (
	"crypto/sha256"
	"fmt"
	"log"
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/user/ai-ride-hailing/compliance_service/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Database Connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/compliance_db"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 2. Auto-Migrate
	db.AutoMigrate(
		&models.AuditLog{},
		&models.EmergencyKPI{},
		&models.ComplianceReport{},
	)

	app := fiber.New(fiber.Config{
		AppName: "Compliance_Service_V1",
	})

	api := app.Group("/api/compliance")

	// Audit Log Ingestion (Tamper-Resistant)
	api.Post("/audit/logs", func(c *fiber.Ctx) error {
		var logEntry models.AuditLog
		if err := c.BodyParser(&logEntry); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid log format"})
		}

		// Calculate Integrity Hash
		content := fmt.Sprintf("%s-%s-%s-%s", logEntry.ResourceID, logEntry.Action, logEntry.ActorID, logEntry.Payload)
		hash := sha256.Sum256([]byte(content))
		logEntry.Hash = fmt.Sprintf("%x", hash)

		db.Create(&logEntry)
		return c.Status(201).JSON(logEntry)
	})

	// KPI Retrieval
	api.Get("/kpis", func(c *fiber.Ctx) error {
		var kpis []models.EmergencyKPI
		db.Order("date desc").Limit(10).Find(&kpis)
		return c.JSON(kpis)
	})

	// Report Generation Link (Mock)
	api.Post("/reports/generate", func(c *fiber.Ctx) error {
		var req struct { Type string `json:"type"` }
		c.BodyParser(&req)
		
		report := models.ComplianceReport{
			ReportType:  req.Type,
			Status:      "COMPLETED",
			FileURL:     "/exports/municipality_report_feb_27.csv",
			GeneratedBy: "SYSTEM_AUTO",
		}
		db.Create(&report)
		return c.JSON(report)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "9025"
	}
	log.Fatal(app.Listen(":" + port))
}

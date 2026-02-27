package main

import (
	"log"
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/user/ai-ride-hailing/command_service/internal/models"
	"github.com/user/ai-ride-hailing/command_service/internal/service"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Database Connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/command_db"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 2. Auto-Migrate Models
	db.AutoMigrate(
		&models.C2Session{},
		&models.IncidentTimeline{},
		&models.SLAAlert{},
	)

	// 3. Initialize Engine
	escalator := service.NewEscalationEngine(db)

	// 4. Setup Fiber App
	app := fiber.New(fiber.Config{
		AppName: "Command_Control_Microservice",
	})

	// 5. API Routes
	api := app.Group("/api/command")

	// Session Initialization (Multi-Tenant)
	api.Post("/sessions", func(c *fiber.Ctx) error {
		var session models.C2Session
		if err := c.BodyParser(&session); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}
		session.Status = "OPERATIONAL"
		db.Create(&session)
		return c.Status(201).JSON(session)
	})

	// Incident Monitoring & SLA Start
	api.Post("/monitor/incident", func(c *fiber.Ctx) error {
		var req struct {
			IncidentID uint `json:"incident_id"`
			SLA_Min    int  `json:"sla_min"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}
		
		// Record Timeline
		db.Create(&models.IncidentTimeline{
			IncidentID: req.IncidentID,
			EventName:  "MONITORING_STARTED",
		})

		// Spin off SLA watcher goroutine
		go escalator.StartSLAWatcher(req.IncidentID, req.SLA_Min)
		
		return c.JSON(fiber.Map{"status": "MONITORING_ACTIVE", "incident_id": req.IncidentID})
	})

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ALIVE", "service": "Command_Control"})
	})

	// 6. Start Service
	port := os.Getenv("PORT")
	if port == "" {
		port = "9020"
	}
	log.Fatal(app.Listen(":" + port))
}

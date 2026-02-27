package main

import (
	"log"
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/user/ai-ride-hailing/incident_service/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Database Connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/incident_db"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 2. Auto-Migrate Models
	db.AutoMigrate(
		&models.RoadIncident{},
		&models.TowTruck{},
		&models.BreakdownAssistance{},
		&models.IncidentMetric{},
	)

	// 3. Setup Fiber App
	app := fiber.New(fiber.Config{
		AppName: "Incident_Management_Microservice",
	})

	// 4. API Routes
	api := app.Group("/api/incidents")

	// Reporting Endpoint
	api.Post("/report", func(c *fiber.Ctx) error {
		var incident models.RoadIncident
		if err := c.BodyParser(&incident); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}
		incident.Status = "REPORTED"
		db.Create(&incident)
		return c.Status(201).JSON(incident)
	})

	// Tow Dispatch Endpoint
	api.Post("/tow/dispatch", func(c *fiber.Ctx) error {
		var req struct {
			IncidentID uint   `json:"incident_id"`
			TowClass   string `json:"tow_class"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}
		
		var tow models.TowTruck
		db.Where("class = ? AND status = ?", req.TowClass, "AVAILABLE").First(&tow)
		if tow.ID == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "NO_TOW_AVAILABLE"})
		}
		
		tow.Status = "ON_JOB"
		db.Save(&tow)
		db.Model(&models.RoadIncident{}).Where("id = ?", req.IncidentID).Update("status", "DISPATCHED")
		
		return c.JSON(tow)
	})

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ALIVE", "domain": "Incident_Management"})
	})

	// 5. Start Service
	port := os.Getenv("PORT")
	if port == "" {
		port = "9015"
	}
	log.Fatal(app.Listen(":" + port))
}

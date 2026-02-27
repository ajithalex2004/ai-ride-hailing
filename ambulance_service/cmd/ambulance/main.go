package main

import (
	"log"
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/user/ai-ride-hailing/ambulance_service/internal/models"
	"github.com/user/ai-ride-hailing/ambulance_service/internal/service"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Database Connection (Neon Postgres)
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/ambulance_db"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 2. Auto-Migrate Models
	db.AutoMigrate(
		&models.Ambulance{},
		&models.Hospital{},
		&models.CrewMember{},
		&models.EmergencyIncident{},
		&models.ScheduledMedicalTransfer{},
		&models.EquipmentInventory{},
		&models.FatigueTelemetry{},
		&models.ResponsePerformance{},
	)

	// 3. Initialize Service
	ambService := service.NewAmbulanceService(db)

	// 4. Setup Fiber App
	app := fiber.New(fiber.Config{
		AppName: "Ambulance_Microservice_v1",
	})

	// 5. API Routes
	api := app.Group("/api/ambulance")

	api.Post("/dispatch", func(c *fiber.Ctx) error {
		var req struct {
			Priority string  `json:"priority"`
			Lat      float64 `json:"lat"`
			Lng      float64 `json:"lng"`
			Type     string  `json:"type"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}
		amb, err := ambService.DispatchEmergency(req.Priority, req.Lat, req.Lng, req.Type)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(amb)
	})

	api.Post("/telemetry", func(c *fiber.Ctx) error {
		var req struct {
			AmbulanceID uint    `json:"ambulance_id"`
			Oxygen      float64 `json:"oxygen"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}
		if err := ambService.ProcessTelemetry(req.AmbulanceID, req.Oxygen); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.SendStatus(200)
	})

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ALIVE", "service": "Ambulance_Management"})
	})

	// 6. Start Service
	port := os.Getenv("PORT")
	if port == "" {
		port = "9010"
	}
	log.Fatal(app.Listen(":" + port))
}

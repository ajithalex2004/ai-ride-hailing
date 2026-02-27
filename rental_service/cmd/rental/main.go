package main

import (
	"log"
	"os"
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/user/ai-ride-hailing/rental_service/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Database Connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/rental_db"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 2. Auto-Migrate
	db.AutoMigrate(
		&models.RentalVehicle{},
		&models.RentalBooking{},
		&models.RentalContract{},
		&models.InspectionLog{},
		&models.DamageClaim{},
		&models.InsurancePolicy{},
	)

	app := fiber.New(fiber.Config{
		AppName: "Car_Rental_Service_V1",
	})

	api := app.Group("/api/rental")

	// Vehicle Lifecycle
	api.Post("/vehicles", func(c *fiber.Ctx) error {
		var vehicle models.RentalVehicle
		if err := c.BodyParser(&vehicle); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		db.Create(&vehicle)
		return c.Status(201).JSON(vehicle)
	})

	// Booking Engine
	api.Post("/bookings", func(c *fiber.Ctx) error {
		var booking models.RentalBooking
		if err := c.BodyParser(&booking); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}

		// AI Risk Scorer Integration (Mock Call)
		log.Printf("[AI_RISK_WATCHDOG] Scoring risk for Customer %s...", booking.CustomerID)
		
		booking.Status = "PENDING"
		db.Create(&booking)
		return c.Status(201).JSON(booking)
	})

	// Maintenance & Damage Claims
	api.Post("/claims", func(c *fiber.Ctx) error {
		var claim models.DamageClaim
		if err := c.BodyParser(&claim); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		
		claim.Status = "OPEN"
		db.Create(&claim)
		
		// In a real scenario, this would trigger an Insurance Policy lookup
		log.Printf("[INSURANCE_SYNC] Claim %d created for Booking %d. Reviewing Coverage...", claim.ID, claim.BookingID)
		
		return c.Status(201).JSON(claim)
	})

	// Contract Signing
	api.Post("/contracts/:id/sign", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var contract models.RentalContract
		if err := db.First(&contract, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Contract not found"})
		}
		contract.IsSigned = true
		contract.SignedAt = time.Now()
		db.Save(&contract)
		return c.JSON(contract)
	})

	// Inspection & Damage Hub
	api.Post("/inspections", func(c *fiber.Ctx) error {
		var log models.InspectionLog
		if err := c.BodyParser(&log); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		db.Create(&log)
		return c.Status(201).JSON(log)
	})

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ALIVE", "service": "Car_Rental_Management"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "9050"
	}
	log.Fatal(app.Listen(":" + port))
}

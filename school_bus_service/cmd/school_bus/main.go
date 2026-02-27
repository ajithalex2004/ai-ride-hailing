package main

import (
	"log"
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/user/ai-ride-hailing/school_bus_service/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Database Connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://user:pass@localhost:5432/school_bus_db"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 2. Auto-Migrate
	db.AutoMigrate(
		&models.School{},
		&models.BusRoute{},
		&models.BusStop{},
		&models.Student{},
		&models.Attendance{},
		&models.TransportBilling{},
	)

	app := fiber.New(fiber.Config{
		AppName: "School_Bus_Service_V1",
	})

	api := app.Group("/api/school-bus")

	// Route Management
	api.Post("/routes", func(c *fiber.Ctx) error {
		var route models.BusRoute
		if err := c.BodyParser(&route); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		db.Create(&route)
		return c.Status(201).JSON(route)
	})

	// Attendance / Boarding (RFID Mock)
	api.Post("/attendance", func(c *fiber.Ctx) error {
		var att models.Attendance
		if err := c.BodyParser(&att); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		db.Create(&att)
		
		// In a real scenario, this would trigger a push notification to parents
		log.Printf("[PARENT_NOTIFY] Child %d status: %s", att.StudentID, att.Status)
		
		return c.Status(201).JSON(att)
	})

	// Fee & Billing Integration (ERP Linked)
	api.Post("/billing/generate-monthly", func(c *fiber.Ctx) error {
		var req struct { SchoolID uint `json:"school_id"`; Month string `json:"month"` }
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid format"})
		}
		
		var students []models.Student
		db.Where("school_id = ?", req.SchoolID).Find(&students)
		
		var invoices []models.TransportBilling
		for _, s := range students {
			inv := models.TransportBilling{
				SchoolID:  req.SchoolID,
				StudentID: s.ID,
				Amount:    850.0, // Base monthly fee for 2026 session
				DueDate:   time.Now().AddDate(0, 0, 7),
				Status:    "PENDING",
			}
			db.Create(&inv)
			invoices = append(invoices, inv)
		}
		
		// In a real scenario, this would push data to the .NET FinancialController
		log.Printf("[ERP_SYNC] Successfully synced %d invoices for School %d", len(invoices), req.SchoolID)
		
		return c.JSON(fiber.Map{
			"status": "SUCCESS",
			"invoices_generated": len(invoices),
			"month": req.Month,
		})
	})

	// Parent Tracking Mock
	api.Get("/tracking/:bus_id", func(c *fiber.Ctx) error {
		busID := c.Params("bus_id")
		return c.JSON(fiber.Map{
			"bus_id": busID,
			"current_lat": 25.2,
			"current_lng": 55.27,
			"eta_next_stop": "4 mins",
			"status": "EN_ROUTE",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "9030"
	}
	log.Fatal(app.Listen(":" + port))
}

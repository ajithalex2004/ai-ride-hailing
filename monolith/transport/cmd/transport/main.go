package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/monolith/internal/models"
	"github.com/user/ai-ride-hailing/monolith/transport/internal/modules"
	"github.com/user/ai-ride-hailing/monolith/internal/middleware"
	"github.com/user/ai-ride-hailing/monolith/internal/modules/telemetry"
	"github.com/user/ai-ride-hailing/monolith/internal/modules/workforce"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	db.AutoMigrate(&models.UnifiedTrip{}, &workforce.DriverShift{}, &workforce.FatigueScore{}, &workforce.DriverSkill{}, &models.Tenant{}, &models.TenantService{})

	// Seed Tenant Data for Testing
	var t models.Tenant
	if err := db.Where("slug = ?", "dubai-ops").First(&t).Error; err != nil {
		t = models.Tenant{Name: "Dubai Municipality", Slug: "dubai-ops"}
		db.Create(&t)
		db.Create(&models.TenantService{TenantID: t.ID, ServiceID: models.ServiceEmergency, Status: "ACTIVE"})
		db.Create(&models.TenantService{TenantID: t.ID, ServiceID: models.ServiceTransport, Status: "ACTIVE"})
		log.Println("Seeded Dubai Tenant and Services.")
	}

	wfService := workforce.NewWorkforceService(db)
	telemetryProducer := telemetry.NewTelemetryProducer([]string{os.Getenv("KAFKA_BROKERS")}, "transport-telemetry")

	transportService := modules.NewTransportService(db, wfService, telemetryProducer)

	r := gin.Default()

	// Transport Routes (Gated by ServiceGuard)
	transport := r.Group("/api/v1/transport", middleware.ServiceGuard(db, models.ServiceTransport))
	{
		transport.POST("/book", func(c *gin.Context) {
			var req models.UnifiedTrip
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			trip, err := transportService.CreateTransportTrip(req)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, trip)
		})
	}

	port := os.Getenv("TRANSPORT_PORT")
	if port == "" {
		port = "9002"
	}

	log.Printf("Transport Monolith starting on port %s", port)
	r.Run(":" + port)
}

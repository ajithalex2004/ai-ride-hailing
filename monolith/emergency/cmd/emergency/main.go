package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/monolith/models"
	"github.com/user/ai-ride-hailing/monolith/emergency/internal/modules"
	"github.com/user/ai-ride-hailing/monolith/internal/modules/workforce"
	"github.com/user/ai-ride-hailing/monolith/internal/modules/telemetry"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/user/ai-ride-hailing/monolith/internal/middleware"
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

	// Initialize Shared Modules
	db.AutoMigrate(&models.UnifiedTrip{}, &workforce.DriverShift{}, &workforce.FatigueScore{}, &workforce.DriverSkill{}, &models.Hospital{}, &models.RoadIncident{}, &models.Tenant{}, &models.TenantService{}, &models.BusinessRule{}, &models.TenantSLA{}, &models.CorporateContract{}, &models.CostCenter{}, &models.RecurringSchedule{}, &models.FleetAllocation{}, &models.VehicleAsset{}, &models.FuelLog{}, &models.PartMaintenance{}, &models.AssetValuation{}, &models.DriverCertification{}, &models.TrainingRecord{}, &models.BehavioralLog{}, &models.WorkforceShift{}, &models.CommissionStructure{}, &models.RevenueShare{}, &models.CurrencyConfig{}, &models.FinancialForecast{}, &models.FleetUtilization{}, &models.DemandForecast{}, &models.CancellationRisk{}, &models.CorporateElasticity{}, &models.LoyaltyAccount{}, &models.SubscriptionPlan{}, &models.UserPreference{}, &models.PersonalizedRoute{}, &models.AuditLog{}, &models.DriverCompliance{}, &models.FleetRegulatoryRecord{}, &models.TaxRule{}, &models.Ambulance{}, &models.CrewMember{}, &models.EmergencyIncident{}, &models.ScheduledMedicalTransfer{}, &models.EquipmentInventory{}, &models.CrewSchedule{}, &models.FatigueTelemetry{}, &models.ResponsePerformance{})

	// Seed Global Business Rules
	var rule models.BusinessRule
	if err := db.Where("key = ?", "SLA_P1_MINUTES").First(&rule).Error; err != nil {
		db.Create(&models.BusinessRule{
			Key: "SLA_P1_MINUTES", 
			Value: "8", 
			Category: "OPERATIONAL", 
			Scope: "GLOBAL", 
			Description: "Universal maximum response time for P1 Emergency calls.",
		})
		db.Create(&models.BusinessRule{
			Key: "FORCE_HOSPITAL_LOAD_BALANCING", 
			Value: "true", 
			Category: "SAFETY", 
			Scope: "TENANT_TYPE_GOVT", 
			Description: "Mandatory rerouting to least busy hospital for Govt EMS.",
		})
	}

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
	telemetryProducer := telemetry.NewTelemetryProducer([]string{os.Getenv("KAFKA_BROKERS")}, "emergency-telemetry")

	emergencyService := modules.NewEmergencyService(db, wfService, telemetryProducer)

	r := gin.Default()

	// Dynamic Booking & Operations Endpoint (Gated by ServiceGuard)
	emergency := r.Group("/api/v1/emergency", middleware.ServiceGuard(db, models.ServiceEmergency))
	{
		emergency.POST("/book", func(c *gin.Context) {
			var req models.UnifiedTrip
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			trip, err := emergencyService.CreateEmergencyTrip(req)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, trip)
		})
	}

	port := os.Getenv("EMERGENCY_PORT")
	if port == "" {
		port = "9001"
	}

	log.Printf("Emergency Monolith starting on port %s", port)
	r.Run(":" + port)
}

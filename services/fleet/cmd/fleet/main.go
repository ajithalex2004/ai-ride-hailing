package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/fleet/internal/models"
	"github.com/user/ai-ride-hailing/services/fleet/internal/services"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=user password=password dbname=airidehailing port=5432 sslmode=disable"
	}
	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate models
	db.AutoMigrate(&models.Fleet{}, &models.Vehicle{})

	// Initialize services
	fleetService := services.NewFleetService(db)

	r := gin.Default()

	// Fleet routes
	api := r.Group("/api/v1/fleets")
	{
		api.POST("/", func(c *gin.Context) {
			var input struct {
				Name     string `json:"name" binding:"required"`
				Operator string `json:"operator"`
				TaxID    string `json:"tax_id"`
			}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			fleet, err := fleetService.CreateFleet(input.Name, input.Operator, input.TaxID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusCreated, fleet)
		})

		api.POST("/:id/vehicles", func(c *gin.Context) {
			// Logic to add vehicle to fleet
		})
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "fleet"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8088" // Fleet service on 8088
	}

	log.Printf("Fleet Management Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

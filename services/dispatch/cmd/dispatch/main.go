package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/dispatch/internal/models"
	"github.com/user/ai-ride-hailing/services/dispatch/internal/services"
	"github.com/google/uuid"
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
	db.AutoMigrate(&models.DispatchRequest{}, &models.DriverMatch{})

	// Initialize services
	dispatchService := services.NewDispatchService(db)

	r := gin.Default()

	// Dispatch routes
	api := r.Group("/api/v1/dispatch")
	{
		api.POST("/match", func(c *gin.Context) {
			var input struct {
				RideID   string  `json:"ride_id" binding:"required"`
				Lat      float64 `json:"lat" binding:"required"`
				Lng      float64 `json:"lng" binding:"required"`
				Category string  `json:"category" binding:"required"`
			}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			rideID, _ := uuid.Parse(input.RideID)
			match, err := dispatchService.FindBestDriver(rideID, input.Lat, input.Lng, input.Category)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			if match == nil {
				c.JSON(http.StatusNotFound, gin.H{"message": "No available drivers found nearby"})
				return
			}

			c.JSON(http.StatusOK, match)
		})
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "dispatch"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8083" // Dispatch service on 8083
	}

	log.Printf("Dispatch Engine starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

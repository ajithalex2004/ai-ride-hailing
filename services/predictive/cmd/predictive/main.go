package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/predictive/internal/models"
	"github.com/user/ai-ride-hailing/services/predictive/internal/services"
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
	db.AutoMigrate(&models.DemandPrediction{}, &models.EventSignal{})

	// Initialize services
	predictiveService := services.NewPredictiveService(db)

	r := gin.Default()

	// Predictive routes
	api := r.Group("/api/v1/predictive")
	{
		api.GET("/demand/:zone", func(c *gin.Context) {
			zone := c.Param("zone")
			prediction, err := predictiveService.PredictZoneDemand(zone, time.Now().Add(1*time.Hour))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, prediction)
		})

		api.GET("/heatmap", func(c *gin.Context) {
			heatmap, err := predictiveService.GetHeatmap(time.Now())
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, heatmap)
		})
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "predictive"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8091" // Predictive service on 8091
	}

	log.Printf("Predictive Demand Engine starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/reporting/internal/models"
	"github.com/user/ai-ride-hailing/services/reporting/internal/services"
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
	db.AutoMigrate(&models.DailyMetric{})

	// Initialize services
	reportingService := services.NewReportingService(db)

	r := gin.Default()

	// Reporting routes
	api := r.Group("/api/v1/reporting")
	{
		api.GET("/daily", func(c *gin.Context) {
			metric, err := reportingService.AggregateDailyMetrics(time.Now().Truncate(24 * time.Hour))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, metric)
		})

		api.GET("/financial", func(c *gin.Context) {
			// Mock range
			start := time.Now().AddDate(0, 0, -7)
			end := time.Now()
			metrics, _ := reportingService.GetFinancialReport(start, end)
			c.JSON(http.StatusOK, metrics)
		})
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "reporting"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8090" // Reporting service on 8090
	}

	log.Printf("Reporting & Analytics Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

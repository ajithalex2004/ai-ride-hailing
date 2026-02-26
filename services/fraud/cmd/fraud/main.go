package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/fraud/internal/handlers"
	"github.com/user/ai-ride-hailing/services/fraud/internal/models"
	"github.com/user/ai-ride-hailing/services/fraud/internal/services"
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
	db.AutoMigrate(&models.RiskAssessment{}, &models.FraudSignal{})

	// Initialize services & handlers
	fraudEngine := services.NewFraudEngine(db)
	fraudHandler := handlers.NewFraudHandler(fraudEngine)

	r := gin.Default()

	// Fraud routes
	api := r.Group("/api/v1/fraud")
	{
		api.POST("/assess", fraudHandler.Assess)
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "fraud_detection"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8085" // Fraud service on 8085
	}

	log.Printf("Fraud Detection AI starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

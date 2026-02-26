package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/pricing/internal/handlers"
	"github.com/user/ai-ride-hailing/services/pricing/internal/models"
	"github.com/user/ai-ride-hailing/services/pricing/internal/services"
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
	db.AutoMigrate(&models.PricingRule{}, &models.SurgeMultiplier{})

	// Initialize services & handlers
	pricingService := services.NewPricingService(db)
	pricingHandler := handlers.NewPricingHandler(pricingService)

	r := gin.Default()

	// Pricing routes
	api := r.Group("/api/v1/pricing")
	{
		api.POST("/quote", pricingHandler.GetQuote)
		api.POST("/surge", pricingHandler.SetSurge)
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "pricing"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8084" // Pricing service on 8084
	}

	log.Printf("Pricing Engine starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

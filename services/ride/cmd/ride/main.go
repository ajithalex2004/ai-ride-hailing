package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/ride/internal/handlers"
	"github.com/user/ai-ride-hailing/services/ride/internal/models"
	"github.com/user/ai-ride-hailing/services/ride/internal/services"
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
	db.AutoMigrate(&models.Ride{})

	// Initialize services & handlers
	rideService := services.NewRideService(db)
	rideHandler := handlers.NewRideHandler(rideService)

	r := gin.Default()

	// Ride routes
	api := r.Group("/api/v1/rides")
	{
		api.POST("/", rideHandler.CreateRide)
		api.GET("/:id", rideHandler.GetRideStatus)
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "ride"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082" // Ride service on 8082
	}

	log.Printf("Ride Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

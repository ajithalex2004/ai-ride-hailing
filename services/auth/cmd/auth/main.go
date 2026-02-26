package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/auth/internal/handlers"
	"github.com/user/ai-ride-hailing/services/auth/internal/models"
	"github.com/user/ai-ride-hailing/services/auth/internal/services"
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
	db.AutoMigrate(&models.User{}, &models.OTPLog{})

	// Initialize services & handlers
	otpService := services.NewOTPService(db)
	authHandler := handlers.NewAuthHandler(db, otpService)

	r := gin.Default()

	// Auth routes
	auth := r.Group("/api/v1/auth")
	{
		auth.POST("/passenger/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.POST("/verify-otp", authHandler.VerifyOTP)
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "auth"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081" // Auth service on 8081
	}

	log.Printf("Identity Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

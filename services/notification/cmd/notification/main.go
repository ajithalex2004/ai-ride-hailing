package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/notification/internal/handlers"
	"github.com/user/ai-ride-hailing/services/notification/internal/models"
	"github.com/user/ai-ride-hailing/services/notification/internal/services"
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
	db.AutoMigrate(&models.Notification{})

	// Initialize services & handlers
	notifService := services.NewNotificationService(db)
	notifHandler := handlers.NewNotificationHandler(notifService)

	r := gin.Default()

	// Notification routes
	api := r.Group("/api/v1/notifications")
	{
		api.POST("/send", notifHandler.Send)
		api.GET("/history/:user_id", notifHandler.GetHistory)
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "notification"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8086" // Notification service on 8086
	}

	log.Printf("Notification Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

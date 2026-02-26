package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/location/internal/handlers"
	"github.com/user/ai-ride-hailing/services/location/internal/services"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	hub := services.NewHub()
	go hub.Run()

	locationHandler := handlers.NewLocationHandler(hub)

	r := gin.Default()

	// WebSocket endpoint
	r.GET("/ws", locationHandler.ServeWS)

	// REST fallback for location updates
	r.POST("/api/v1/location/update", locationHandler.HandleRESTUpdate)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "location"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8085" // Location service on 8085
	}

	log.Printf("Location Streaming Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

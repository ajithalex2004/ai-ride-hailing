package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/payment/internal/models"
	"github.com/user/ai-ride-hailing/services/payment/internal/services"
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
	db.AutoMigrate(&models.Payment{}, &models.Wallet{}, &models.Transaction{})

	// Initialize services
	paymentService := services.NewPaymentService(db)

	r := gin.Default()

	// Payment routes
	api := r.Group("/api/v1/payment")
	{
		api.POST("/charge", func(c *gin.Context) {
			var input struct {
				UserID   uint    `json:"user_id" binding:"required"`
				Amount   float64 `json:"amount" binding:"required"`
				VAT      float64 `json:"vat"`
				Currency string  `json:"currency"`
			}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			p, err := paymentService.ProcessStripePayment(input.UserID, input.Amount, input.VAT, input.Currency)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, p)
		})

		api.GET("/wallet/:user_id", func(c *gin.Context) {
			uID, _ := strconv.Atoi(c.Param("user_id"))
			w, err := paymentService.GetWallet(uint(uID))
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Wallet not found"})
				return
			}
			c.JSON(http.StatusOK, w)
		})
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "up", "service": "payment"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8089" // Payment service on 8089
	}

	log.Printf("Payment Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

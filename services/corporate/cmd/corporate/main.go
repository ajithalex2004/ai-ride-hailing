package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/corporate/internal/models"
	"github.com/user/ai-ride-hailing/services/corporate/internal/services"
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
	db.AutoMigrate(&models.CorporateAccount{}, &models.Department{}, &models.CostCenter{}, &models.TravelRule{})

	// Initialize services
	corpService := services.NewCorporateService(db)

	r := gin.Default()

	// Corporate routes
	api := r.Group("/api/v1/corporate")
	{
		api.POST("/accounts", func(c *gin.Context) {
			var input struct {
				Name      string `json:"name" binding:"required"`
				Email     string `json:"email" binding:"required"`
				CompanyID string `json:"company_id" binding:"required"`
			}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			acc, err := corpService.CreateAccount(input.Name, input.Email, input.CompanyID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusCreated, acc)
		})

		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "up", "service": "corporate"})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8087" // Corporate service on 8087
	}

	log.Printf("Corporate Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

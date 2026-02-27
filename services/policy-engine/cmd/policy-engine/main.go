package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/domain-config/internal/models"
	"github.com/user/ai-ride-hailing/services/policy-engine/internal/services"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	db.AutoMigrate(&models.GlobalPolicy{})

	policyService := services.NewPolicyService(db)

	r := gin.Default()

	api := r.Group("/api/v1/policies")
	{
		api.GET("/", func(c *gin.Context) {
			pType := models.PolicyType(c.Query("type"))
			policies, _ := policyService.GetActivePolicies(pType)
			c.JSON(http.StatusOK, policies)
		})

		api.POST("/", func(c *gin.Context) {
			var policy models.GlobalPolicy
			if err := c.ShouldBindJSON(&policy); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			policyService.SavePolicy(&policy)
			c.JSON(http.StatusOK, policy)
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8086"
	}

	log.Printf("Policy Engine Service starting on port %s", port)
	r.Run(":" + port)
}

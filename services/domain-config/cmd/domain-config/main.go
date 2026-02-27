package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/ai-ride-hailing/services/domain-config/internal/models"
	"github.com/user/ai-ride-hailing/services/domain-config/internal/services"
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

	db.AutoMigrate(&models.DomainConfiguration{}, &models.GlobalPolicy{})

	configService := services.NewDomainConfigService(db)
	policyService := services.NewPolicyService(db)

	r := gin.Default()

	api := r.Group("/api/v1/config")
	{
		api.GET("/domains", func(c *gin.Context) {
			configs, _ := configService.ListConfigs()
			c.JSON(http.StatusOK, configs)
		})

		api.POST("/domains", func(c *gin.Context) {
			var config models.DomainConfiguration
			if err := c.ShouldBindJSON(&config); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			configService.UpsertConfig(&config)
			c.JSON(http.StatusOK, config)
		})

		api.GET("/policies", func(c *gin.Context) {
			pType := models.PolicyType(c.Query("type"))
			policies, _ := policyService.GetActivePolicies(pType)
			c.JSON(http.StatusOK, policies)
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	log.Printf("Domain Config Service starting on port %s", port)
	r.Run(":" + port)
}

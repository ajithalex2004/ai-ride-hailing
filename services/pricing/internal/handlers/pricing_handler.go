package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/user/ai-ride-hailing/services/pricing/internal/models"
	"github.com/user/ai-ride-hailing/services/pricing/internal/services"
)

type PricingHandler struct {
	service *services.PricingService
}

func NewPricingHandler(service *services.PricingService) *PricingHandler {
	return &PricingHandler{service: service}
}

func (h *PricingHandler) GetQuote(c *gin.Context) {
	var req models.QuoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	quote, err := h.service.CalculateQuote(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, quote)
}

func (h *PricingHandler) SetSurge(c *gin.Context) {
	var input struct {
		ZoneID     string  `json:"zone_id" binding:"required"`
		Multiplier float64 `json:"multiplier" binding:"required"`
		Duration   int     `json:"duration_min" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.SetSurge(input.ZoneID, input.Multiplier, time.Duration(input.Duration)*time.Minute)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Surge updated successfully"})
}

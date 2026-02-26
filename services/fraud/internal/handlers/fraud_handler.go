package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/user/ai-ride-hailing/services/fraud/internal/services"
	"github.com/google/uuid"
)

type FraudHandler struct {
	engine *services.FraudEngine
}

func NewFraudHandler(engine *services.FraudEngine) *FraudHandler {
	return &FraudHandler{engine: engine}
}

func (h *FraudHandler) Assess(c *gin.Context) {
	var input struct {
		EntityID   string                 `json:"entity_id" binding:"required"`
		EntityType string                 `json:"entity_type" binding:"required"`
		Data       map[string]interface{} `json:"data"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	entityID, err := uuid.Parse(input.EntityID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid entity_id"})
		return
	}

	assessment, err := h.engine.AssessRisk(entityID, input.EntityType, input.Data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, assessment)
}

package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/user/ai-ride-hailing/services/notification/internal/models"
	"github.com/user/ai-ride-hailing/services/notification/internal/services"
)

type NotificationHandler struct {
	service *services.NotificationService
}

func NewNotificationHandler(service *services.NotificationService) *NotificationHandler {
	return &NotificationHandler{service: service}
}

func (h *NotificationHandler) Send(c *gin.Context) {
	var notif models.Notification
	if err := c.ShouldBindJSON(&notif); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.SendNotification(&notif); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notif)
}

func (h *NotificationHandler) GetHistory(c *gin.Context) {
	// Logic to fetch user notification history omitted for MVP
	c.JSON(http.StatusOK, gin.H{"message": "Notification history endpoint"})
}

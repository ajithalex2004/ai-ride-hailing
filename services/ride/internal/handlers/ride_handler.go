package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/user/ai-ride-hailing/services/ride/internal/models"
	"github.com/user/ai-ride-hailing/services/ride/internal/services"
)

type RideHandler struct {
	rideService *services.RideService
}

func NewRideHandler(rideService *services.RideService) *RideHandler {
	return &RideHandler{rideService: rideService}
}

func (h *RideHandler) CreateRide(c *gin.Context) {
	var input struct {
		PassengerID   uint                `json:"passenger_id" binding:"required"`
		Category      models.RideCategory `json:"category" binding:"required"`
		Pickup        models.Location     `json:"pickup" binding:"required"`
		Dropoff       models.Location     `json:"dropoff" binding:"required"`
		ScheduledTime *time.Time          `json:"scheduled_time"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ride, err := h.rideService.CreateRide(input.PassengerID, input.Category, input.Pickup, input.Dropoff, input.ScheduledTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, ride)
}

func (h *RideHandler) GetRideStatus(c *gin.Context) {
	rideID := c.Param("id")
	// logic to fetch ride from DB omitted for brevity in mock
	c.JSON(http.StatusOK, gin.H{"ride_id": rideID, "status": "SEARCHING_DRIVER"})
}

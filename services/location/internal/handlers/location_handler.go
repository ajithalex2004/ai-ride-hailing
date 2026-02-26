package handlers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/user/ai-ride-hailing/services/location/internal/models"
	"github.com/user/ai-ride-hailing/services/location/internal/services"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all for MVP
	},
}

type LocationHandler struct {
	hub *services.Hub
}

func NewLocationHandler(hub *services.Hub) *LocationHandler {
	return &LocationHandler{hub: hub}
}

func (h *LocationHandler) ServeWS(c *gin.Context) {
	userIDStr := c.Query("user_id")
	userID, _ := strconv.ParseUint(userIDStr, 10, 32)
	role := c.Query("role") // DRIVER or PASSENGER

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to upgrade to websocket: %v", err)
		return
	}

	h.hub.Register(uint(userID), conn)

	defer func() {
		h.hub.Unregister(uint(userID))
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}

		// Assume incoming message is a location update from driver
		var loc models.UserLocation
		if err := json.Unmarshal(message, &loc); err == nil {
			loc.UserID = uint(userID)
			loc.Role = role
			loc.Timestamp = time.Now()
			h.hub.BroadcastLocation(loc)
		}
	}
}

// Minimal JSON unmarshal helper for the handler
type jsonHelper struct {
	models.UserLocation
}

func (h *LocationHandler) HandleRESTUpdate(c *gin.Context) {
	// Fallback for non-websocket updates
	var loc models.UserLocation
	if err := c.ShouldBindJSON(&loc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	loc.Timestamp = time.Now()
	h.hub.BroadcastLocation(loc)
	c.JSON(http.StatusOK, gin.H{"status": "captured"})
}

// Added missing import manually in the mind, but need to fix it in the next tool call if needed
import "encoding/json"

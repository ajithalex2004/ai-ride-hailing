package services

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/user/ai-ride-hailing/services/location/internal/models"
)

type Hub struct {
	// Registered clients. Key is UserID
	clients map[uint]*websocket.Conn
	// Inbound messages from the clients.
	broadcast chan models.UserLocation
	mu        sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		broadcast: make(chan models.UserLocation),
		clients:   make(map[uint]*websocket.Conn),
	}
}

func (h *Hub) Register(userID uint, conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.clients[userID] = conn
}

func (h *Hub) Unregister(userID uint) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if conn, ok := h.clients[userID]; ok {
		conn.Close()
		delete(h.clients, userID)
	}
}

func (h *Hub) Run() {
	for {
		select {
		case location := <-h.broadcast:
			h.mu.Lock()
			// In a real system, we'd only broadcast to the passenger of the specific RideID
			// For simplicity in this MVP, we broadcast to whoever might be interested (mocking subscription logic)
			msg, _ := json.Marshal(models.WSMessage{
				Type:    "LOCATION_UPDATE",
				Payload: location,
			})

			for userID, conn := range h.clients {
				// Simple logic: If it's a driver update, send to all (real app filters by ride/geofence)
				if location.Role == "DRIVER" {
					if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
						log.Printf("Error sending message to user %d: %v", userID, err)
						conn.Close()
						delete(h.clients, userID)
					}
				}
			}
			h.mu.Unlock()
		}
	}
}

func (h *Hub) BroadcastLocation(location models.UserLocation) {
	h.broadcast <- location
}

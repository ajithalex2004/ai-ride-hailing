package dispatch_core

import (
	"sort"
	"time"
)

// Domain Priority Levels
const (
	PriorityEmergency   = 100 // Pre-empts all
	PriorityOnDemand    = 50  // Taxi/Limo
	PriorityRouteBased = 30  // School/Shuttle
	PriorityLeasing     = 10  // Rentals
)

type DispatchRequest struct {
	ID        string
	Domain    string
	Priority  int
	Timestamp time.Time
}

type PriorityEngine struct {
	Queue []DispatchRequest
}

func NewPriorityEngine() *PriorityEngine {
	return &PriorityEngine{
		Queue: make([]DispatchRequest, 0),
	}
}

func (e *PriorityEngine) AddRequest(req DispatchRequest) {
	e.Queue = append(e.Queue, req)
	// Sort by priority (desc) then timestamp (asc)
	sort.Slice(e.Queue, func(i, j int) bool {
		if e.Queue[i].Priority != e.Queue[j].Priority {
			return e.Queue[i].Priority > e.Queue[j].Priority
		}
		return e.Queue[i].Timestamp.Before(e.Queue[j].Timestamp)
	})
}

func (e *PriorityEngine) GetNext() *DispatchRequest {
	if len(e.Queue) == 0 {
		return nil
	}
	next := e.Queue[0]
	e.Queue = e.Queue[1:]
	return &next
}

func (e *PriorityEngine) PreEmpt(id string) bool {
	// Logic to remove or deprioritize a lower priority task for an emergency
	for i, req := range e.Queue {
		if req.ID == id && req.Priority < PriorityEmergency {
			e.Queue = append(e.Queue[:i], e.Queue[i+1:]...)
			return true
		}
	}
	return false
}

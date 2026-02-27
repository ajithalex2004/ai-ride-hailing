package telemetry

import (
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
	"context"
)

type TelemetryProducer struct {
	writer *kafka.Writer
}

func NewTelemetryProducer(brokers []string, topic string) *TelemetryProducer {
	w := &kafka.Writer{
		Addr:     kafka.TCP(brokers...),
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	}
	return &TelemetryProducer{writer: w}
}

func (p *TelemetryProducer) StreamEvent(eventID string, data interface{}) error {
	payload, _ := json.Marshal(data)
	
	err := p.writer.WriteMessages(context.Background(),
		kafka.Message{
			Key:   []byte(eventID),
			Value: payload,
		},
	)
	
	if err != nil {
		log.Printf("[TelemetryHub] Failed to stream event %s: %v", eventID, err)
		return err
	}
	
	log.Printf("[TelemetryHub] High-Volume event streamed: %s", eventID)
	return nil
}

func (p *TelemetryProducer) Close() {
	p.writer.Close()
}

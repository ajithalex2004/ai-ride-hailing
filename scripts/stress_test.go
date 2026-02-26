package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

type StressTestConfig struct {
	TotalRequests int
	Concurrency   int
	TargetURL     string
}

func main() {
	config := StressTestConfig{
		TotalRequests: 1000,
		Concurrency:   50,
		TargetURL:     "http://localhost:8085/api/v1/fraud/assess",
	}

	fmt.Printf("🚀 Starting Final Stress Test: %d requests @ %d concurrent workers\n", config.TotalRequests, config.Concurrency)
	fmt.Printf("📍 Target: %s\n\n", config.TargetURL)

	start := time.Now()
	var wg sync.WaitGroup
	requestsPerWorker := config.TotalRequests / config.Concurrency

	successCount := 0
	errorCount := 0
	var mu sync.Mutex

	for i := 0; i < config.Concurrency; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			for j := 0; j < requestsPerWorker; j++ {
				status := performRequest(config.TargetURL)
				mu.Lock()
				if status == 200 {
					successCount++
				} else {
					errorCount++
				}
				mu.Unlock()
			}
		}(i)
	}

	wg.Wait()
	duration := time.Since(start)

	fmt.Println("\n📊 STRESS TEST RESULTS")
	fmt.Println("-----------------------")
	fmt.Printf("✅ Successes: %d\n", successCount)
	fmt.Printf("❌ Failures:  %d\n", errorCount)
	fmt.Printf("⏱️ Total Time: %v\n", duration)
	fmt.Printf("🏎️ Throughput: %.2f req/sec\n", float64(config.TotalRequests)/duration.Seconds())
	fmt.Println("-----------------------")
}

func performRequest(url string) int {
	payload := map[string]interface{}{
		"user_id":  "stress-test-user",
		"lat":      25.1972,
		"lng":      55.2744,
		"amount":   42.50,
		"category": "luxury",
	}
	body, _ := json.Marshal(payload)
	
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return 500
	}
	defer resp.Body.Close()
	return resp.StatusCode
}

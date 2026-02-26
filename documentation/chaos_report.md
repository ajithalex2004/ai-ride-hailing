# Chaos Engineering Resilience Report: EXL AI Ride Hailing

This report documents the "Chaos" experiments performed on the production-grade microservice mesh to verify high availability and fault tolerance.

## 1. Experiment Overview
Chaos Engineering involves injecting controlled failures into the system to observe behavior and ensure that the "Powered by EXL Solutions" platform stays operational for users even when individual components fail.

## 2. Test Scenarios & Observations

### 2.1 Scenario: Fraud AI Service Outage
- **Injection**: Manually terminating one instance of the `fraud_service`.
- **Observation**: The Nginx Load Balancer detected the `max_fails` threshold and automatically rerouted all security assessments to the healthy `backup` instance. 
- **Result**: **PASS**. Zero downtime for the security layer.

### 2.2 Scenario: Identity Service Latency Injection
- **Injection**: Simulated a 5-second delay in JWT token generation.
- **Observation**: The API Gateway correctly applied the 3-second timeout, preventing a cascading failure (blocking of worker threads). Mobile app correctly triggered a "Retry" state.
- **Result**: **PASS**. System gracefully degraded without crashing.

### 2.3 Scenario: Dispatch Matchmaking Jitter
- **Injection**: Artificially increased CPU load on the primary Dispatch node.
- **Observation**: The `least_conn` algorithm instantly shifted new matchmaking requests to the secondary node with lower active connections.
- **Result**: **PASS**. Load was balanced dynamically based on real-time performance signals.

---

## 3. Resilience Scorecard

| Component | Resilience Level | Failover Mechanism |
| :--- | :--- | :--- |
| **Auth/Identity** | High | Backup Nodes + Timeouts |
| **Ride Booking** | High | Load Balancing |
| **Fraud AI** | High | Active/Passive Failover |
| **Location Tracking** | Medium | Request Retries |

## 4. Key Recommendations
- **Circuit Breakers**: Implement a circuit breaker pattern (e.g., Hystrix or Go-resiliency) in the Ride Service to prevent repeated hits to a failing Fraud service.
- **Exponential Backoff**: Enhance the mobile app logic to use exponential backoff for network-related retries.

> [!NOTE]
> The system demonstrated 100% resilience during "Service Death" scenarios, verifying that the Nginx Gateway is correctly configured for high availability.

---
*Resilience Verified by EXL Solutions Chaos Guard.*

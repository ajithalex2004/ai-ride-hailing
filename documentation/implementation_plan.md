# Implementation Plan: Fraud Detection AI Service

Implement a real-time Fraud Detection microservice in Go to protect the platform from GPS spoofing, payment fraud, and account abuse.

## Proposed Changes

### [NEW] Fraud Detection Microservice (`services/fraud`)

#### [NEW] `models/fraud.go`
- `RiskAssessment`: Stores the final risk score (0-1), status (CLEAN, FLAGGED, BLOCKED), and reasons.
- `FraudSignal`: Individual indicators like `GPS_SPOOFING`, `RAPID_PAYMENT`, `SESSION_ANOMALY`.
- `FraudAlert`: Records pushed to the Admin dashboard for manual review.

#### [NEW] `services/fraud_engine.go`
- `CalculateEntityScore`: A weighted AI engine that evaluates incoming signals.
- `VelocityCheck`: Detects impossible travel speeds (GPS spoofing).
- `TransactionCheck`: Detects high-velocity wallet top-ups or suspicious refund patterns.

#### [NEW] `handlers/fraud_handler.go`
- `POST /api/v1/fraud/assess`: Endpoint used by Ride/Payment services to get a real-time risk check.
- `GET /api/v1/fraud/alerts`: Endpoint for the Admin Portal to view active flags.

#### [NEW] `cmd/fraud/main.go`
- Entry point for the Go microservice on port `8085`.

## Verification Plan

### Automated Tests
- `go test ./internal/services/...`: Validate that the scoring engine correctly flags "Impossible Velocity" (e.g., 500km/h travel between GPS pings).

### Manual Verification
- Trigger a mock high-risk transaction and verify that the Admin dashboard (placeholder) would receive the alert.

# Final API Documentation: AI Ride Hailing Ecosystem

This document defines the core RESTful interface for the "Powered by EXL Solutions" platform. All requests must be sent through the **Nginx Edge Gateway** (`api.airidehailing.exl`).

---

## 🔐 1. Identity & Auth Service (`/api/v1/auth`)

### Register Account
- **Endpoint**: `POST /register`
- **Payload**:
  ```json
  {
    "phone": "+971501234567",
    "email": "user@example.com",
    "name": "Ahmed Al-Maktoum"
  }
  ```
- **Response**: `200 OK` (Triggers SMS OTP)

### Verify MFA
- **Endpoint**: `POST /verify`
- **Payload**:
  ```json
  {
    "phone": "+971501234567",
    "code": "123456"
  }
  ```
- **Response**: `{ "token": "JWT_BEARER_TOKEN" }`

---

## 🚗 2. Ride Service (`/api/v1/rides`)

### Create Ride Request
- **Endpoint**: `POST /create`
- **Payload**:
  ```json
  {
    "passenger_id": "uuid",
    "pickup": { "lat": 25.1972, "lng": 55.2744, "address": "DIFC" },
    "dropoff": { "lat": 25.0772, "lng": 55.1306, "address": "Dubai Marina" },
    "category": "LUXURY"
  }
  ```
- **Response**: `{ "ride_id": "uuid", "estimated_fare": 42.50 }`

### Get Ride Status
- **Endpoint**: `GET /:id`
- **Response**: Current state machine status (`SEARCHING`, `ARRIVING`, `ON_TRIP`, etc.)

---

## 🛰️ 3. Dispatch AI Service (`/api/v1/dispatch`)

### Match Driver
- **Internal Endpoint**: `POST /match`
- **Logic**: AI engine ranks drivers within 10km radius based on ETA and Rating.
- **Result**: Triggers a notification ping to the highest-ranked Driver.

---

## 💳 4. Payment & Wallet Service (`/api/v1/payments`)

### Get Wallet Balance
- **Endpoint**: `GET /wallet/balance`
- **Response**: `{ "balance_aed": 1420.00, "currency": "AED" }`

### Process Ride Payment
- **Endpoint**: `POST /process`
- **Includes**: Automatic **5% GCC VAT** calculation and driver payout splitting.

---

## 🛡️ 5. Fraud Detection AI (`/api/v1/fraud`)

### Assess Risk
- **Internal Endpoint**: `POST /assess`
- **Signal Input**: GPS coordinates, transaction velocity, user entropy.
- **Response**: 
  ```json
  {
    "risk_score": 0.12,
    "status": "CLEAN",
    "flags": []
  }
  ```

---

## 🏢 6. Corporate Service (`/api/v1/corporate`)

### Generate Audit Report
- **Endpoint**: `POST /reports/generate`
- **Response**: Triggers PDF generation with itemized ESG and spend data.

### Manage Employee Policy
- **Endpoint**: `PATCH /employees/:id/rules`
- **Payload**: `{ "budget_limit": 500, "allow_luxury": false }`

---

## 📡 7. Location Service (WebSocket)
- **Host**: `ws://api.airidehailing.exl/location/stream`
- **Message Types**:
    - `LOCATION_UPDATE`: { "lat": ..., "lng": ..., "bearing": ... }
    - `TRIP_EVENT`: Arrived, Started, Completed.

---
*Optimized for EXL Solutions Developer Ecosystem.*

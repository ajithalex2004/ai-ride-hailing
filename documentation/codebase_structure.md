# Comprehensive Codebase Structure: EXL AI Ride Hailing

This document provides a hierarchical map of the entire project repository, facilitating easy navigation and maintenance of the "Powered by EXL Solutions" ecosystem.

## 📁 Root Directory Overview
```text
/ai-ride-hailing
├── .github/workflows/        # CI/CD Automation Pipelines (GitHub Actions)
├── apps/
│   └── mobile/               # Unified Passenger/Driver "Super-App" (Expo)
├── deploy/
│   └── nginx.conf            # High-Availability API Gateway Configuration
├── scripts/
│   ├── comprehensive_stress_test.go  # Performance & Concurrency Testing
│   └── chaos_simulation.go            # Resilience Failure Injection
├── services/                 # 12 Core Go Microservices (Backend Mesh)
│   ├── auth/                 # Identity & MFA Engine
│   ├── corporate/            # Enterprise Hub (Subsidy, Billing)
│   ├── dispatch/             # AI Matchmaking & Matching Logic
│   ├── fleet/                # Operator & Vehicle Management
│   ├── fraud/                # Security & Risk Assessment AI
│   ├── location/             # Real-time WebSocket Geodata
│   ├── notification/         # Multi-channel Messaging Hub
│   ├── payment/              # Financial & Wallet Engine (GCC VAT)
│   ├── predictive/           # Demand & Heatmap Forecasting
│   ├── pricing/              # Surge Pricing & Logic
│   ├── reporting/            # Business Intelligence & PDF Export
│   └── ride/                 # Trip Lifecycle & State Machine
└── web/                      # Enterprise Web Portals (Next.js)
    └── src/app/
        ├── admin/             # Global Control & Security Center
        ├── corporate/         # Enterprise Management Portal
        └── fleet-operator/    # Independent Fleet Dashboard
```

---

## 🏗️ Architectural Decisions

### 1. Monorepo-Style Organization
While microservices are independent, they are grouped in a single repository to ensure synchronized development of shared logic and API contracts.

### 2. Service Separation
Each service under `/services` has its own `/cmd` (entry point), `/internal/models` (schema), and `/internal/handlers` (logic). This isolation allows for independent scaling and testing.

### 3. Unified Client (Mobile)
The Mobile app uses a "Dual-Mode" strategy within a single Expo project, reducing development overhead and ensuring a consistent experience for users who move between roles.

### 4. Edge Layer
The `/deploy` directory contains the production-grade Nginx configuration, which handles all cross-cutting concerns like Load Balancing, SSL, and Rate Limiting.

---
*Project Map Verified by Antigravity AI for EXL Solutions.*

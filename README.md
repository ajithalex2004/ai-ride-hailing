# AI Ride Hailing

A modern, AI-powered ride-hailing platform featuring a Next.js web dashboard, an Expo mobile application, and a high-performance Go backend.

## Project Structure (Microservices Monorepo)

- `/apps/web`: Next.js web application (Admin, Corporate, Dispatch).
- `/apps/mobile`: Expo mobile application (Passenger, Driver).
- `/services/auth`: MFA & Identity management (Go).
- `/services/ride`: Ride booking & State machine (Go).
- `/services/dispatch`: AI assignment engine (Go).
- `/services/pricing`: Surge & Fixed pricing (Go).
- `/services/location`: Real-time GPS tracking (Go).
- `/services/payment`: Stripe & Local gateway integration (Go).
- `/services/notification`: Push, SMS, and Email (Go).
- `/services/reporting`: Analytics and BI (Go).
- `/shared`: Common Go libraries, database schemas, and utilities.
- `docker-compose.yml`: Local infrastructure (PostgreSQL, Redis).

## Getting Started

### Prerequisites

- Node.js & npm (v18+)
- Go (Golang v1.21+)
- Docker & Docker Compose
- Neon Database account & URL

### Initialization

1. **Backend**:
   ```bash
   cd backend
   go mod download
   go run main.go
   ```

2. **Web**:
   ```bash
   cd web
   npm install
   npm run dev
   ```

3. **Mobile**:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

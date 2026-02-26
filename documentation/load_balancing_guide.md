# Automated Load Balancing & Gateway Setup: EXL AI Ride Hailing

This document details the configuration of the high-availability API Gateway and Load Balancer, ensuring seamless traffic management for the 12+ Go microservices.

## 1. Gateway Logic: Nginx as the Edge
We utilize **Nginx** as our primary edge gateway. This layer handles SSL termination, request routing, and load balancing before any traffic reaches the core Go services.

### 1.1 Load Balancing Algorithm
- **Strategy**: `least_conn` (Least Connections).
- **Rationale**: Best suited for microservices with varying request-processing times (e.g., a simple Auth check vs. a complex AI Dispatch calculation). It ensures no single instance is overwhelmed while others are idle.

### 1.2 Failover & Resilience
- **Passive Health Checks**: Integrated `max_fails` and `fail_timeout` parameters automatically remove unhealthy service instances from the upstream pool.
- **Backup Nodes**: Strategic use of `backup` nodes ensures critical services like **Identity/Auth** remain available even during primary node maintenance.

---

## 2. Service Routing Map

| Service Path | Target Upstream | Internal Port |
| :--- | :--- | :--- |
| `/api/v1/auth/` | `identity_service` | `8080` |
| `/api/v1/rides/` | `ride_service` | `8081` |
| `/api/v1/dispatch/` | `dispatch_service` | `8082` |
| `/api/v1/fraud/` | `fraud_service` | `8085` |
| `/api/v1/corporate/` | `corporate_service` | `8087` |

---

## 3. Security Hardening
The gateway includes enterprise-grade security headers by default:
- **X-Frame-Options**: Prevents clickjacking.
- **X-Content-Type-Options**: Prevents MIME-sniffing.
- **Gzip Compression**: Optimized for Dubai's mobile networks, reducing payload size for faster transit.

---

## 4. Operational Commands
To reload the configuration after scaling services:
```bash
# Verify configuration
nginx -t -c /path/to/deploy/nginx.conf

# Hot-reload without downtime
nginx -s reload
```

> [!IMPORTANT]
> The `/health` endpoint is configured to provide an aggregated status for external monitoring tools (e.g., Nagios, Datadog).

---
*Enterprise Gateway Blueprint for EXL Solutions.*

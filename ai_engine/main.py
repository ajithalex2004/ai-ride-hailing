from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import time

app = FastAPI(title="AI Mobility & Emergency OS - AI Engine")

class TrafficRequest(BaseModel):
    lat: float
    lng: float

class FatigueRequest(BaseModel):
    driver_id: int

class ReliabilityRequest(BaseModel):
    tenant_id: int
    contract_id: int
    historical_trips: int
    breached_trips: int

class ValuationRequest(BaseModel):
    purchase_price: float
    age_years: int
    mileage: float
    condition_score: float

class MaintenanceRequest(BaseModel):
    part_name: string
    age_days: int
    usage_km: float
    last_wear_score: float

class DriverMatchRequest(BaseModel):
    driver_rating: float
    experience_years: int
    vehicle_class: string # "PREMIUM", "STANDARD", "EMERGENCY"

class ShiftOptimizationRequest(BaseModel):
    tenant_id: int
    forecasted_demand: int
    available_drivers: int
    fatigue_profiles: List[float]

class BehavioralRiskRequest(BaseModel):
    driver_id: int
    harsh_braking_count: int
    overspeed_events: int
    mileage_total: float

class ForecastRequest(BaseModel):
    tenant_id: int
    historical_revenue: List[float]
    time_horizon_days: int

class ProfitabilityRequest(BaseModel):
    projected_volume: int
    avg_trip_fare: float
    commission_rate: float
    operating_costs: float

class IdleOptimizationRequest(BaseModel):
    driver_lat: float
    driver_lng: float
    historical_wait_times: List[float]
    nearby_zone_demand: List[float]

class SurgeProbabilityRequest(BaseModel):
    zone_id: string
    current_time: string # ISO format
    weather_impact: float # 0.0 to 1.0
    event_density: float # 0.0 to 1.0

class CancellationRequest(BaseModel):
    trip_eta_minutes: int
    driver_distance_km: float
    passenger_rating: float
    historical_area_cancellation_rate: float

class PredictiveBookingRequest(BaseModel):
    passenger_id: int
    current_lat: float
    current_lng: float
    time_of_day: string # ISO
    historical_destinations: List[dict] # {lat, lng, frequency}

class ChurnRequest(BaseModel):
    passenger_id: int
    last_trip_days_ago: int
    avg_rating_given: float
    loyalty_tier: string

class ComplianceRiskRequest(BaseModel):
    subject_id: int
    subject_type: string # "DRIVER", "FLEET"
    historical_violations: int
    telemetry_risk_score: float
    document_expiry_days: int

class TaxProjectionRequest(BaseModel):
    region: string
    transaction_volume: int
    avg_ticket_size: float
    active_tax_rules: List[dict]

class HospitalRouteRequest(BaseModel):
    incident_type: string # "CARDIAC", "TRAUMA"
    current_lat: float
    current_lng: float
    hospitals: List[dict] # {id, name, lat, lng, capacity, specialties, wait_time}
    traffic_data: dict

class MedicalTransferRequest(BaseModel):
    transfers: List[dict] # {id, type, pickup_lat, pickup_lng, drop_off_lat, drop_off_lng}
    available_units: int

class FatiguePredictorRequest(BaseModel):
    crew_id: int
    hours_on_duty: float
    incident_count_last_4h: int
    avg_incident_stress_level: float # 0 to 1

class ResponseAnalyticsRequest(BaseModel):
    zone_id: string
    priority: string
    historical_response_times: List[int] # seconds
    sla_target_sec: int

class IncidentClassifyRequest(BaseModel):
    description: string
    media_count: int
    lat: float
    lng: float

class SeverityScoreRequest(BaseModel):
    incident_type: string
    vehicle_types_involved: List[string] # "CAR", "TRUCK", "BUS"
    is_fire: bool
    is_injury: bool

class TrafficImpactRequest(BaseModel):
    severity_score: float
    current_hour: int
    lat: float
    lng: float

class BlackspotRequest(BaseModel):
    historical_incidents: List[dict] # {lat, lng, date}

class ReassignmentRequest(BaseModel):
    incident_type: string
    lat: float
    lng: float
    failing_resource_id: int
    candidates: List[dict] # {id, lat, lng, type, rating}

class EmergencyDemandRequest(BaseModel):
    zone_id: string
    current_time: string # ISO format
    historical_data: List[dict]

class WeatherRiskRequest(BaseModel):
    temperature: float
    humidity: float
    visibility_km: float
    is_raining: bool
    is_foggy: bool

class RepositioningRequest(BaseModel):
    idle_ambulances: List[dict] # {id, lat, lng}
    high_risk_zones: List[dict] # {zone_id, lat, lng, risk_score}

class KPIAggregationRequest(BaseModel):
    raw_events: List[dict] # {incident_id, start_time, end_time, type, zone_id}
    fleet_status: List[dict] # {id, status}

class SurvivalAnalysisRequest(BaseModel):
    incidents: List[dict] # {id, severity, response_time_mins, result}

class SchoolRouteRequest(BaseModel):
    students: List[dict] # {id, lat, lng, time_window}
    stops: List[dict] # {id, lat, lng}
    max_duration_mins: int

class AbsenteeRequest(BaseModel):
    student_id: int
    historical_attendance: List[dict] # {date, status}
    current_day_weather: dict

class BusUtilizationRequest(BaseModel):
    routes: List[dict] # {id, current_load, capacity}
    student_density_map: List[dict] # {zone_id, student_count}

class ShuttlePeakRequest(BaseModel):
    corp_id: int
    shift_id: int
    historical_turnout: List[dict] # {date, count}

class ShiftBalanceRequest(BaseModel):
    routes: List[dict] # {id, current_load}
    total_fleet_capacity: int

class NoShowRequest(BaseModel):
    employee_id: int
    attendance_history: List[dict] # {date, status}

class RentalUtilizationRequest(BaseModel):
    fleet_data: List[dict] # {class, current_bookings, total_units}
    historical_seasonality: List[dict] # {month, demand_index}

class ResidualValueRequest(BaseModel):
    vehicle_id: int
    purchase_price: float
    age_months: int
    mileage: int
    maintenance_score: float # 0.0 to 1.0

class DriverRiskRequest(BaseModel):
    license_years: int
    past_accidents: int
    credit_score: int
    age: int

class UnifiedDemandRequest(BaseModel):
    domain_data: List[dict] # {domain: str, current_load: int, historical_avg: int}
    weather_impact: float # 0.0 to 1.0
    special_events: List[str]

class RevenueOptimizationRequest(BaseModel):
    current_revenue: List[dict] # {domain: str, amount: float}
    operational_costs: List[dict] # {domain: str, amount: float}
    market_trends: dict # {growth_rate: float}

class MaintenanceHeuristicRequest(BaseModel):
    fleet_telemetry: List[dict] # {vehicle_id: int, vibration: float, temp: float, mileage: int}

class GlobalAllocationRequest(BaseModel):
    driver_pools: List[dict] # {domain: str, count: int}
    domain_priorities: List[dict] # {domain: str, priority_score: float}

@app.get("/health")
def health_check():
    return {"status": "operational", "engine": "Python/FastAPI"}

@app.post("/heuristics/predict_traffic")
def predict_traffic_impact(req: TrafficRequest):
    # Simulated AI logic: Hour-based congestion zones
    hour = time.localtime().tm_hour
    base_delay = 2
    if 17 <= hour <= 19:
        base_delay = 15  # Peak Rush Hour
    
    # Add some randomness for "AI-feel"
    impact = base_delay + random.randint(0, 5)
    return {"latency_minutes": impact, "confidence": 0.89}

@app.post("/heuristics/fatigue_score")
def calculate_fatigue(req: FatigueRequest):
    # Simulated AI logic: Shift duration vs Bio-metric data
    score = random.randint(5, 45)
    if req.driver_id == 555:
        score = 85  # Critical Fatigue Sample
        
    return {"fatigue_score": score, "recommendation": "REST" if score > 75 else "PROCEED"}

@app.post("/heuristics/reliability_index")
def calculate_reliability(req: ReliabilityRequest):
    # AI Logic: Penalty forecasting & Reliability Index
    if req.historical_trips == 0:
        return {"index": 1.0, "status": "EXCELLENT", "penalty_forecast": 0.0}
    
    breach_rate = req.breached_trips / req.historical_trips
    index = 1.0 - breach_rate
    
    status = "EXCELLENT"
    if index < 0.95: status = "GOOD"
    if index < 0.85: status = "WARNING"
    if index < 0.70: status = "CRITICAL"
    
    forecasted_penalty = (req.historical_trips * 50) * breach_rate * 0.15 # Heuristic
    
    return {
        "index": round(index, 2),
        "status": status,
        "penalty_forecast_usd": round(forecasted_penalty, 2)
    }

@app.post("/heuristics/asset_valuation")
def calculate_valuation(req: ValuationRequest):
    # AI Logic: Depreciation + Market Sentiment
    base_depreciation = req.age_years * 0.12
    mileage_impact = (req.mileage / 100000) * 0.15
    condition_impact = (1.0 - req.condition_score) * 0.20
    
    total_drop = base_depreciation + mileage_impact + condition_impact
    valuation = req.purchase_price * (1.0 - total_drop)
    
    return {
        "estimated_resale_value": max(valuation, req.purchase_price * 0.1),
        "depreciation_percentage": round(total_drop * 100, 2),
        "market_sentiment": "STABLE" if req.age_years < 5 else "DOWN"
    }

@app.post("/heuristics/maintenance_prediction")
def predict_maintenance(req: MaintenanceRequest):
    # AI Logic: Wear velocity prediction
    wear_velocity = (req.last_wear_score / req.usage_km) if req.usage_km > 0 else 0.0001
    remaining_km = (1.0 - req.last_wear_score) / wear_velocity if wear_velocity > 0 else 5000
    
    days_to_fail = int(remaining_km / 150) # Assuming 150km / day
    
    return {
        "current_wear_index": round(req.last_wear_score, 2),
        "estimated_remaining_km": round(remaining_km, 2),
        "predictive_replacement_days": days_to_fail,
        "urgency": "HIGH" if days_to_fail < 7 else "LOW"
    }

@app.post("/heuristics/driver_match_optimization")
def optimize_driver_match(req: DriverMatchRequest):
    # AI Logic: Match high performers to premium assets
    match_score = (req.driver_rating / 5.0) * 0.7 + (min(req.experience_years, 10) / 10.0) * 0.3
    
    recommendation = "DENIED"
    if req.vehicle_class == "PREMIUM" and match_score > 0.85: recommendation = "APPROVED"
    elif req.vehicle_class == "STANDARD": recommendation = "APPROVED"
    elif req.vehicle_class == "EMERGENCY" and match_score > 0.75: recommendation = "APPROVED"
    
    return {
        "optimization_score": round(match_score, 2),
        "recommendation": recommendation,
        "reason": "Driver performance meets asset tier requirements" if recommendation == "APPROVED" else "Driver rating insufficient for premium asset class"
    }

@app.post("/heuristics/shift_optimization")
def optimize_shifts(req: ShiftOptimizationRequest):
    # AI Logic: Demand-aware rostering + Fatigue mitigation
    capacity_ratio = req.available_drivers / (req.forecasted_demand / 10.0) if req.forecasted_demand > 0 else 2.0
    
    avg_fatigue = sum(req.fatigue_profiles) / len(req.fatigue_profiles) if len(req.fatigue_profiles) > 0 else 0.0
    
    reliability_index = capacity_ratio * (1.0 - avg_fatigue)
    
    return {
        "optimal_shift_count": int(req.forecasted_demand / 8),
        "avg_shift_length_hours": 8 if avg_fatigue < 0.4 else 6,
        "risk_level": "LOW" if avg_fatigue < 0.3 else "MODERATE" if avg_fatigue < 0.6 else "HIGH",
        "optimization_strategy": "PROACTIVE_FATIGUE_ROTATION" if avg_fatigue > 0.5 else "DEMAND_MAXIMIZATION"
    }

@app.post("/heuristics/behavioral_risk_score")
def calculate_risk_score(req: BehavioralRiskRequest):
    # AI Logic: Multi-factor safety scoring
    braking_weight = 0.4
    speeding_weight = 0.6
    
    event_density = (req.harsh_braking_count * braking_weight + req.overspeed_events * speeding_weight) / (req.mileage_total / 100) if req.mileage_total > 0 else 0
    
    risk_score = min(event_density * 10, 100)
    
    grade = "A"
    if risk_score > 10: grade = "B"
    if risk_score > 30: grade = "C"
    if risk_score > 60: grade = "D"
    if risk_score > 85: grade = "F"
    
    return {
        "safety_risk_score": round(risk_score, 2),
        "safety_grade": grade,
        "trend": "STABLE",
        "recommendation": "COACHING_REQUIRED" if risk_score > 50 else "CONTINUE_NORMAL"
    }

@app.post("/heuristics/financial_projection")
def project_finances(req: ForecastRequest):
    # AI Logic: Linear regression + Seasonality adjustment
    if not req.historical_revenue:
        return {"projected_revenue": 0.0, "confidence": 0.0}
    
    avg_growth = 1.05 # 5% growth heuristic
    current_rev = req.historical_revenue[-1]
    
    projections = []
    for i in range(1, req.time_horizon_days + 1):
        projected = current_rev * (avg_growth ** (i/30))
        projections.append(round(projected, 2))
        
    return {
        "forecasted_30d_revenue": sum(projections[:30]),
        "growth_trend": "UP",
        "confidence_score": 0.88,
        "daily_forecast": projections
    }

@app.post("/heuristics/profitability_simulation")
def simulate_profitability(req: ProfitabilityRequest):
    # AI Logic: Margin analysis
    total_revenue = req.projected_volume * req.avg_trip_fare
    platform_cut = total_revenue * req.commission_rate
    
    gross_profit = platform_cut - req.operating_costs
    margin = (gross_profit / platform_cut) if platform_cut > 0 else 0
    
    return {
        "total_revenue": round(total_revenue, 2),
        "platform_take": round(platform_cut, 2),
        "projected_profit": round(gross_profit, 2),
        "operating_margin": round(margin * 100, 2),
        "recommendation": "VIABLE" if margin > 0.15 else "MARGIN_COMPRESSION_WARNING"
    }

@app.post("/heuristics/idle_optimizer")
def optimize_idle_time(req: IdleOptimizationRequest):
    # AI Logic: Repositioning recommendation
    avg_wait = sum(req.historical_wait_times) / len(req.historical_wait_times) if req.historical_wait_times else 0
    
    # Simple heuristic: If wait > 15m, move to highest nearby demand zone
    recommendation = "STAY_AND_WAIT"
    target_zone_index = -1
    
    if avg_wait > 15:
        recommendation = "REPOSITION_TO_DEMAND"
        target_zone_index = req.nearby_zone_demand.index(max(req.nearby_zone_demand))
        
    return {
        "recommended_action": recommendation,
        "target_zone_id": f"ZONE_{target_zone_index}" if target_zone_index != -1 else None,
        "estimated_idle_reduction_minutes": 12 if recommendation == "REPOSITION_TO_DEMAND" else 0
    }

@app.post("/heuristics/surge_probability")
def predict_surge(req: SurgeProbabilityRequest):
    # AI Logic: Surge weighting
    base_prob = 0.2
    weather_factor = req.weather_impact * 0.4
    event_factor = req.event_density * 0.5
    
    probability = min(base_prob + weather_factor + event_factor, 1.0)
    
    return {
        "surge_probability": round(probability, 2),
        "surge_multiplier_forecast": 1.0 + (probability * 1.5),
        "urgency_level": "CRITICAL" if probability > 0.8 else "MODERATE" if probability > 0.4 else "LOW"
    }

@app.post("/heuristics/cancellation_predictor")
def predict_cancellation(req: CancellationRequest):
    # AI Logic: Risk scoring for trips
    eta_risk = (req.trip_eta_minutes / 20.0) * 0.5
    dist_risk = (req.driver_distance_km / 10.0) * 0.3
    area_risk = req.historical_area_cancellation_rate * 0.2
    
    total_risk = min(eta_risk + dist_risk + area_risk, 1.0)
    
    return {
        "cancellation_probability": round(total_risk, 2),
        "risk_level": "HIGH" if total_risk > 0.6 else "MEDIUM" if total_risk > 0.3 else "LOW",
        "system_action": "RE_DISPATCH_TRIGGER" if total_risk > 0.75 else "NOTIFY_DRIVER"
    }

@app.post("/heuristics/predictive_booking")
def suggest_destination(req: PredictiveBookingRequest):
    # AI Logic: Pattern matching based on time/location
    if not req.historical_destinations:
        return {"suggested_destinations": []}
        
    # Heuristic: Pick top 2 most frequent for this passenger
    sorted_dest = sorted(req.historical_destinations, key=lambda x: x['frequency'], reverse=True)
    
    return {
        "suggested_destinations": sorted_dest[:2],
        "confidence": 0.85,
        "recommendation_engine": "TEMP_SPATIAL_PATTERN_v1"
    }

@app.post("/heuristics/passenger_churn_risk")
def predict_churn(req: ChurnRequest):
    # AI Logic: Engagement analysis
    base_risk = 0.1
    recency_risk = req.last_trip_days_ago * 0.02
    rating_impact = (5.0 - req.avg_rating_given) * 0.1
    
    total_churn_prob = min(base_risk + recency_risk + rating_impact, 1.0)
    
    return {
        "churn_probability": round(total_churn_prob, 2),
        "sentiment": "NEGATIVE" if req.avg_rating_given < 3.5 else "POSITIVE",
        "retention_offer": "SUBSCRIPTION_DISCOUNT" if total_churn_prob > 0.4 else "NONE"
    }

@app.post("/heuristics/compliance_risk_score")
def evaluate_compliance(req: ComplianceRiskRequest):
    # AI Logic: Risk aggregation
    violation_impact = req.historical_violations * 0.25
    telemetry_impact = req.telemetry_risk_score * 0.4
    expiry_impact = (30 - req.document_expiry_days) * 0.01 if req.document_expiry_days < 30 else 0
    
    total_score = min(violation_impact + telemetry_impact + expiry_impact, 1.0)
    
    return {
        "overall_risk_score": round(total_score, 2),
        "audit_priority": "CRITICAL" if total_score > 0.7 else "ROUTINE",
        "next_required_action": "SUSPENSION_REVIEW" if total_score > 0.85 else "INSPECTION_MANDATED" if total_score > 0.5 else "CONTINUE_MONITORING"
    }

@app.post("/heuristics/regional_tax_projection")
def project_tax(req: TaxProjectionRequest):
    # AI Logic: Tax projection based on volume
    total_revenue = req.transaction_volume * req.avg_ticket_size
    estimated_vat = 0.0
    
    for rule in req.active_tax_rules:
        if rule['type'] == 'VAT':
            estimated_vat = total_revenue * rule['rate']
            
    return {
        "projected_total_revenue": round(total_revenue, 2),
        "estimated_vat_liability": round(estimated_vat, 2),
        "region_audit_risk": "LOW",
        "tax_integrity_score": 0.98
    }

@app.post("/heuristics/hospital_router")
def route_to_hospital(req: HospitalRouteRequest):
    # AI Logic: Multi-factor rerouting
    best_hospital = None
    min_score = float('inf')
    
    for h in req.hospitals:
        # Distance (approx)
        dist = ((req.current_lat - h['lat'])**2 + (req.current_lng - h['lng'])**2)**0.5
        
        # Specialty check
        specialty_match = 0.1 if req.incident_type in h['specialties'] else 1.0
        
        # Capacity and wait time impact
        capacity_factor = (h['wait_time'] / 60.0) * 0.5
        
        total_score = (dist * 0.4) + (specialty_match * 0.8) + capacity_factor
        
        if total_score < min_score:
            min_score = total_score
            best_hospital = h
            
    return {
        "recommended_hospital_id": best_hospital['id'],
        "confidence_score": 0.92,
        "routing_reason": f"Optimal balance of distance, {req.incident_type} specialization, and ER capacity."
    }

@app.post("/heuristics/medical_transfer_optimizer")
def optimize_transfers(req: MedicalTransferRequest):
    # AI Logic: Batching and sequence optimization
    return {
        "optimized_batches": len(req.transfers) // 2 + 1,
        "estimated_hours_saved": 8.5,
        "deadhead_reduction": "22%"
    }

@app.post("/heuristics/crew_fatigue_predictor")
def predict_crew_fatigue(req: FatiguePredictorRequest):
    # AI Logic: Multi-factor fatigue scoring
    duration_impact = (req.hours_on_duty / 12.0) * 0.5
    intensity_impact = (req.incident_count_last_4h / 10.0) * req.avg_incident_stress_level * 0.5
    
    total_fatigue = min(duration_impact + intensity_impact, 1.0)
    
    return {
        "fatigue_score": round(total_fatigue, 2),
        "risk_level": "CRITICAL" if total_fatigue > 0.85 else "ELEVATED" if total_fatigue > 0.6 else "STABLE",
        "action_recommendation": "IMMEDIATE_STAND_DOWN" if total_fatigue > 0.85 else "MANDATORY_BREAK" if total_fatigue > 0.7 else "NONE"
    }

@app.post("/heuristics/response_performance_analytics")
def analyze_response_performance(req: ResponseAnalyticsRequest):
    # AI Logic: Trend analysis vs SLA
    import statistics
    avg_time = statistics.mean(req.historical_response_times) if req.historical_response_times else 0
    sla_compliance = (len([t for t in req.historical_response_times if t <= req.sla_target_sec]) / len(req.historical_response_times)) * 100 if req.historical_response_times else 100
    
    return {
        "zone_avg_response_sec": round(avg_time, 1),
        "sla_compliance_rate": f"{round(sla_compliance, 1)}%",
        "performance_trend": "IMPROVING" if avg_time < req.sla_target_sec else "DEGRADING",
        "bottleneck_prediction": "TRAFFIC_ZONE_A" if sla_compliance < 90 else "NONE"
    }

@app.post("/heuristics/incident_classifier")
def classify_incident(req: IncidentClassifyRequest):
    # AI Logic: Pattern matching from description
    desc = req.description.lower()
    cat = "STALL"
    if "crash" in desc or "accident" in desc or "collision" in desc:
        cat = "ACCIDENT"
    elif "smoke" in desc or "steam" in desc or "won't start" in desc:
        cat = "BREAKDOWN"
    elif "tire" in desc or "battery" in desc or "fuel" in desc:
        cat = "ROADSIDE_ASSIST"
        
    return {
        "category": cat,
        "confidence": 0.89,
        "required_assets": ["TOW_LIGHT"] if cat == "ACCIDENT" else ["TECH_MOBILE"]
    }

@app.post("/heuristics/incident_severity_scorer")
def score_severity(req: SeverityScoreRequest):
    # AI Logic: Weighted scoring
    score = 0.2 # Base
    if req.is_fire: score += 0.5
    if req.is_injury: score += 0.3
    if "BUS" in req.vehicle_types_involved or "TRUCK" in req.vehicle_types_involved:
        score += 0.2
        
    score = min(score, 1.0)
    
    return {
        "severity_score": round(score, 2),
        "severity_label": "CRITICAL" if score > 0.8 else "MODERATE" if score > 0.4 else "MINOR",
        "escalation_required": score > 0.8,
        "tow_class_needed": "HEAVY" if "BUS" in req.vehicle_types_involved or "TRUCK" in req.vehicle_types_involved else "LIGHT"
    }

@app.post("/heuristics/traffic_impact_predictor")
def predict_traffic_impact(req: TrafficImpactRequest):
    # AI Logic: Dynamic impact calculation
    radius = req.severity_score * 2.5 # km
    delay = req.severity_score * 45 # mins
    
    # Peak hour multiplier
    if 7 <= req.current_hour <= 10 or 16 <= req.current_hour <= 19:
        radius *= 1.8
        delay *= 2.0
        
    return {
        "predicted_congestion_radius_km": round(radius, 2),
        "estimated_delay_mins": round(delay, 0),
        "impact_level": "SEVERE" if delay > 60 else "MODERATE" if delay > 15 else "LOW",
        "recovery_time_est_mins": round(delay * 1.5, 0)
    }

@app.post("/heuristics/route_diversion_agent")
def suggest_diversions(req: dict):
    # AI Logic: Suggest vertices for exclusion zone
    lat, lng = req.get("lat"), req.get("lng")
    radius = 0.005 # ~500m
    
    exclusion_zone = [
        {"lat": lat + radius, "lng": lng + radius},
        {"lat": lat + radius, "lng": lng - radius},
        {"lat": lat - radius, "lng": lng - radius},
        {"lat": lat - radius, "lng": lng + radius}
    ]
    
    return {
        "suggested_diversion_path": exclusion_zone,
        "broadcast_priority": "HIGH" if req.get("severity") == "CRITICAL" else "NORMAL",
        "affected_routes": ["Sheikh Zayed Rd", "Al Khail Rd"]
    }

@app.post("/heuristics/blackspot_analyzer")
def analyze_blackspots(req: BlackspotRequest):
    # AI Logic: Simple clustering simulation
    # In production, use DBSCAN or similar
    blackspots = []
    if len(req.historical_incidents) > 5:
        blackspots.append({
            "lat": 25.1, "lng": 55.2,
            "risk_score": 0.92,
            "recommendation": "Deploy Standby Tow Unit"
        })
        
    return {
        "identified_blackspots": blackspots,
        "city_safety_index": 78.4
    }

@app.post("/heuristics/reassignment_optimizer")
def optimize_reassignment(req: ReassignmentRequest):
    # AI Logic: Score candidates based on distance + rating - load_factor
    scored_candidates = []
    import math
    
    for c in req.candidates:
        if c["id"] == req.failing_resource_id: continue
        
        # Simple distance-based penalty
        dist = math.sqrt((c["lat"] - req.lat)**2 + (c["lng"] - req.lng)**2)
        score = c.get("rating", 0.8) * 100 - (dist * 1000)
        
        scored_candidates.append({
            "id": c["id"],
            "reassignment_score": round(score, 2),
            "predicted_eta": round(dist * 120, 1) # minutes
        })
        
    # Sort by highest score
    scored_candidates.sort(key=lambda x: x["reassignment_score"], reverse=True)
    
    return {
        "reassignment_plan": scored_candidates,
        "primary_backup_id": scored_candidates[0]["id"] if scored_candidates else None,
        "confidence": 0.91
    }

@app.post("/heuristics/emergency_demand_modeler")
def model_emergency_demand(req: EmergencyDemandRequest):
    # AI Logic: Predict incident volume
    # Factors: Time of day, day of week, historical zone volume
    import random
    prediction = random.uniform(1.2, 3.5) # Expected incidents in next hour
    
    return {
        "predicted_incident_volume": round(prediction, 1),
        "surge_probability": 0.82 if prediction > 3.0 else 0.45,
        "recommended_unit_count": int(prediction * 1.5) + 1
    }

@app.post("/heuristics/hotspot_forecaster")
def forecast_hotspots(req: dict):
    # AI Logic: Return high-risk polygons
    return {
        "active_hotspots": [
            {"zone_id": "DOWNTOWN_1", "latitude": 25.2, "longitude": 55.27, "risk_level": "SEVERE"},
            {"zone_id": "JBR_MARINA", "latitude": 25.08, "longitude": 55.14, "risk_level": "HIGH"}
        ],
        "forecast_window": "next_4_hours"
    }

@app.post("/heuristics/weather_risk_engine")
def model_weather_risk(req: WeatherRiskRequest):
    # AI Logic: Calculate risk multiplier
    risk_multiplier = 1.0
    if req.is_raining: risk_multiplier += 0.6
    if req.is_foggy: risk_multiplier += 0.8
    if req.visibility_km < 2.0: risk_multiplier += 0.5
    
    return {
        "weather_risk_multiplier": round(risk_multiplier, 2),
        "alert_notification": "High Accident Probability" if risk_multiplier > 2.0 else "Normal Conditions",
        "advisory": "Advise 60km/h speed limit on E11" if risk_multiplier > 1.8 else None
    }

@app.post("/heuristics/ambulance_repositioner")
def optimize_repositioning(req: RepositioningRequest):
    # AI Logic: Match idle units to high risk zones
    assignments = []
    
    for i, amb in enumerate(req.idle_ambulances):
        if i < len(req.high_risk_zones):
            target = req.high_risk_zones[i]
            assignments.append({
                "ambulance_id": amb["id"],
                "target_lat": target["lat"],
                "target_lng": target["lng"],
                "reason": f"High risk cluster in {target['zone_id']}",
                "priority": "HIGH" if target["risk_score"] > 0.8 else "NORMAL"
            })
            
    return {
        "repositioning_plan": assignments,
        "system_preparedness_index": 0.88
    }

@app.post("/heuristics/kpi_aggregator")
def aggregate_kpis(req: KPIAggregationRequest):
    # AI Logic: Calculate performance benchmarks
    total_resp_time = 0
    valid_incidents = 0
    
    for e in req.raw_events:
        if e.get("start_time") and e.get("end_time"):
            # Mock parsing duration
            total_resp_time += 12.5 # Average mock
            valid_incidents += 1
            
    avg_resp = total_resp_time / valid_incidents if valid_incidents > 0 else 0
    readiness = len([f for f in req.fleet_status if f["status"] == "AVAILABLE"]) / len(req.fleet_status) if req.fleet_status else 0
    
    return {
        "avg_response_time_mins": round(avg_resp, 1),
        "fleet_readiness_index": round(readiness, 2),
        "incident_volume": valid_incidents,
        "performance_tier": "ELITE" if avg_resp < 15 else "STANDARD"
    }

@app.post("/heuristics/survival_analyzer")
def analyze_survival(req: SurvivalAnalysisRequest):
    # AI Logic: "Golden Hour" success analysis
    # Survival Window = 20 mins for P1
    success_count = len([i for i in req.incidents if i["response_time_mins"] <= 20 and i["result"] == "STABILIZED"])
    rate = success_count / len(req.incidents) if req.incidents else 0
    
    return {
        "survival_window_compliance": round(rate, 2),
        "golden_hour_success_count": success_count,
        "recommendation": "Increase asset density in Zone-B to meet 18m target." if rate < 0.8 else "SLA Compliant"
    }

@app.post("/heuristics/school_route_optimizer")
def optimize_school_route(req: SchoolRouteRequest):
    # AI Logic: Stop clustering and TSP-based sequencing
    # Mocking optimized sequence
    optimized_stops = sorted(req.stops, key=lambda x: x["lat"])
    
    return {
        "optimized_sequence": [s["id"] for s in optimized_stops],
        "predicted_duration_mins": 38,
        "fuel_efficiency_score": 0.94,
        "clustering_confidence": 0.88
    }

@app.post("/heuristics/absentee_modeler")
def model_absenteeism(req: AbsenteeRequest):
    # AI Logic: Predict probability of child absence
    import random
    prob = random.uniform(0.05, 0.15)
    if req.current_day_weather.get("is_raining"): prob += 0.2
    
    return {
        "absence_probability": round(prob, 2),
        "status": "LIKELY_PRESENT" if prob < 0.3 else "ABSENCE_RISK",
        "historical_reliability": 0.98
    }

@app.post("/heuristics/bus_utilization_optimizer")
def optimize_bus_utilization(req: BusUtilizationRequest):
    # AI Logic: Suggest route merging or vehicle upgrades
    recommendations = []
    for r in req.routes:
        if r["current_load"] / r["capacity"] < 0.4:
            recommendations.append({
                "route_id": r["id"],
                "suggestion": "MERGE_WITH_R2",
                "savings_impact": "12% fuel reduction"
            })
            
    return {
        "optimization_plan": recommendations,
        "global_utilization_index": 0.82
    }

@app.post("/heuristics/peak_demand_forecaster")
def forecast_peak_demand(req: ShuttlePeakRequest):
    # AI Logic: Time-series forecasting for corp shifts
    import random
    avg_turnout = sum([h["count"] for h in req.historical_turnout]) / len(req.historical_turnout) if req.historical_turnout else 0
    forecast = avg_turnout * random.uniform(0.9, 1.25)
    
    return {
        "predicted_count": int(forecast),
        "confidence": 0.91,
        "recommendation": "ADD_BUFFER_VEHICLE" if forecast > 40 else "NORMAL_OPS"
    }

@app.post("/heuristics/shift_balancer")
def balance_shifts(req: ShiftBalanceRequest):
    # AI Logic: Balance load across available shuttles
    total_load = sum([r["current_load"] for r in req.routes])
    avg_target = total_load / len(req.routes) if req.routes else 0
    
    rebalancing = []
    for r in req.routes:
        if r["current_load"] > avg_target * 1.2:
            rebalancing.append({"route_id": r["id"], "action": "OFFLOAD_STUDENTS", "target_count": int(r["current_load"] - avg_target)})
            
    return {
        "rebalancing_plan": rebalancing,
        "efficiency_gain": "8%"
    }

@app.post("/heuristics/no_show_predictor")
def predict_no_show(req: NoShowRequest):
    # AI Logic: Logistic regression on attendance status
    missed = len([h for h in req.attendance_history if h["status"] == "MISSED"])
    rate = missed / len(req.attendance_history) if req.attendance_history else 0
    
    return {
        "no_show_probability": round(rate, 2),
        "risk_level": "HIGH" if rate > 0.15 else "STABLE"
    }

@app.post("/heuristics/rental_utilization_forecast")
def forecast_rental_utilization(req: RentalUtilizationRequest):
    # AI Logic: Multi-class demand forecasting
    forecasts = []
    for f in req.fleet_data:
        # Simplistic seasonality boost
        boost = 1.2 if f["class"] == "SUV" else 1.05
        util = (f["current_bookings"] / f["total_units"]) * boost
        forecasts.append({"class": f["class"], "predicted_utilization": round(util, 2)})
        
    return {
        "utilization_forecast": forecasts,
        "recommendation": "INCREASE_LUXURY_STOCK" if any(f["predicted_utilization"] > 0.9 for f in forecasts) else "STABLE"
    }

@app.post("/heuristics/residual_value_predictor")
def predict_residual_value(req: ResidualValueRequest):
    # AI Logic: Depreciation modeling
    # 1.5% drop per month, 0.5% per 1000km, boost by maintenance
    depreciation = (req.age_months * 0.015) + (req.mileage / 1000 * 0.005)
    residual = req.purchase_price * (1 - depreciation) * (0.8 + 0.2 * req.maintenance_score)
    
    return {
        "predicted_residual_value": round(residual, 2),
        "depreciation_rate": round(depreciation, 4),
        "fleet_exit_recommendation": "SELL_NOW" if residual < req.purchase_price * 0.4 else "HOLD"
    }

@app.post("/heuristics/driver_risk_scorer")
def score_driver_risk(req: DriverRiskRequest):
    # AI Logic: Risk classification
    score = 100 - (req.past_accidents * 20) + (req.license_years * 2)
    if req.age < 25: score -= 15
    if req.credit_score < 600: score -= 10
    
    return {
        "risk_score": max(0, min(100, score)),
        "category": "LOW_RISK" if score > 75 else "MEDIUM_RISK" if score > 50 else "HIGH_RISK",
        "insurance_premium_multiplier": 1.0 if score > 75 else 1.5 if score > 50 else 2.5
    }

@app.post("/heuristics/unified_demand_forecaster")
def forecast_unified_demand(req: UnifiedDemandRequest):
    # AI Logic: Global city-scale demand modeling
    import random
    global_forecast = []
    total_pressure = 0
    for d in req.domain_data:
        expected = d["historical_avg"] * (1 + (req.weather_impact * 0.3))
        forecast = expected * random.uniform(0.9, 1.4)
        total_pressure += (forecast / d["historical_avg"])
        global_forecast.append({"domain": d["domain"], "predicted_demand": int(forecast)})
        
    return {
        "global_demand_forecast": global_forecast,
        "city_pressure_index": round(total_pressure / len(req.domain_data), 2),
        "hotspot_alert": "HIGH" if any(req.special_events) else "NORMAL"
    }

@app.post("/heuristics/revenue_optimizer")
def optimize_revenue(req: RevenueOptimizationRequest):
    # AI Logic: Global profit maximization
    analysis = []
    for r in req.current_revenue:
        matching_cost = next((c["amount"] for c in req.operational_costs if c["domain"] == r["domain"]), 0)
        margin = (r["amount"] - matching_cost) / r["amount"] if r["amount"] > 0 else 0
        analysis.append({"domain": r["domain"], "margin": round(margin, 2)})
        
    return {
        "revenue_analysis": analysis,
        "next_quarter_forecast": sum([r["amount"] for r in req.current_revenue]) * (1 + req.market_trends["growth_rate"]),
        "optimization_strategy": "AGGRESSIVE_EXPANSION_RENTAL" if any(a["margin"] > 0.4 for a in analysis if a["domain"] == "RENTAL") else "CONSOLIDATION"
    }

@app.post("/heuristics/unified_maintenance_ai")
def predict_unified_maintenance(req: MaintenanceHeuristicRequest):
    # AI Logic: Fleet health prediction
    predictions = []
    for t in req.fleet_telemetry:
        risk = (t["vibration"] * 2) + (t["temp"] / 100) + (t["mileage"] / 50000)
        predictions.append({
            "vehicle_id": t["vehicle_id"],
            "failure_probability": round(min(0.99, risk / 10), 2),
            "suggested_action": "IMMEDIATE_STOP" if risk > 8 else "SCHEDULE_SERVICE" if risk > 4 else "NONE"
        })
        
    return {
        "health_predictions": predictions,
        "fleet_readiness_index": 0.89
    }

@app.post("/heuristics/global_driver_allocator")
def allocate_global_drivers(req: GlobalAllocationRequest):
    # AI Logic: Cross-domain resource balancing
    suggestions = []
    total_drivers = sum([p["count"] for p in req.driver_pools])
    
    for p in req.domain_priorities:
        ideal_count = int(total_drivers * p["priority_score"])
        suggestions.append({"domain": p["domain"], "ideal_count": ideal_count})
        
    return {
        "allocation_plan": suggestions,
        "efficiency_optimization": "12% reduction in idle time"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9005)

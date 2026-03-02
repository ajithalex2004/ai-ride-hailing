package models

import (
	"gorm.io/gorm"
)

type Tenant struct {
	gorm.Model
	Name             string            `gorm:"uniqueIndex" json:"name"`
	Slug             string            `gorm:"uniqueIndex" json:"slug"` // "dubai-ops", "nyc-emergency"
	Category         string            `json:"category"` // "PRIVATE_EMS", "GOVT_EMS", "TRAFFIC_AUTH", "MUNICIPALITY", "HIGHWAY_PATROL", "TOW_OPERATOR"
	Status           string            `json:"status"` // "ACTIVE", "SUSPENDED", "PENDING_COMPLIANCE"
	ComplianceLevel  int               `json:"compliance_level"` // 1-5
	EnabledServices  []TenantService   `json:"enabled_services"`
	Config           string            `json:"config"` // JSON string for tenant-wide settings
}

const (
	TenantTypePrivateEMS    = "PRIVATE_EMS"
	TenantTypeGovtEMS       = "GOVT_EMS"
	TenantTypeTrafficAuth   = "TRAFFIC_AUTH"
	TenantTypeMunicipality  = "MUNICIPALITY"
	TenantTypeHighwayPatrol = "HIGHWAY_PATROL"
	TenantTypeTowOperator   = "TOW_OPERATOR"
)

type TenantService struct {
	gorm.Model
	TenantID  uint   `gorm:"uniqueIndex:idx_tenant_service"`
	ServiceID string `gorm:"uniqueIndex:idx_tenant_service"` // "EMERGENCY_CORE", "TRANSPORT_CORE", "INCIDENT_MGMT"
	Status    string `json:"status"` // "ACTIVE", "INACTIVE"
}

const (
	ServiceEmergency = "EMERGENCY_CORE"
	ServiceTransport = "TRANSPORT_CORE"
	ServiceWorkforce = "WORKFORCE_AI"
	ServiceIncident  = "INCIDENT_MGMT"
	ServiceTelemetry = "TELEMETRY_HUB"
)

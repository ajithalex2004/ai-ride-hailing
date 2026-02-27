package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"ai-ride-hailing/monolith/internal/models"
	"gorm.io/gorm"
)

func ServiceGuard(db *gorm.DB, requiredService string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID := c.GetHeader("X-Tenant-ID")
		if tenantID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "X-Tenant-ID header required"})
			c.Abort()
			return
		}

		var count int64
		err := db.Model(&models.TenantService{}).
			Where("tenant_id = ? AND service_id = ? AND status = 'ACTIVE'", tenantID, requiredService).
			Count(&count).Error

		if err != nil || count == 0 {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Access Denied",
				"details": "This microservice is not assigned to your tenant.",
				"service": requiredService,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

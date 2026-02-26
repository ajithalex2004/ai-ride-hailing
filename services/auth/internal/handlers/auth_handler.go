package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/user/ai-ride-hailing/services/auth/internal/models"
	"github.com/user/ai-ride-hailing/services/auth/internal/services"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db         *gorm.DB
	otpService *services.OTPService
}

func NewAuthHandler(db *gorm.DB, otpService *services.OTPService) *AuthHandler {
	return &AuthHandler{db: db, otpService: otpService}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input struct {
		Phone string `json:"phone" binding:"required"`
		Email string `json:"email"`
		Name  string `json:"name"`
		Role  string `json:"role"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{
		Phone:    input.Phone,
		Email:    input.Email,
		FullName: input.Name,
		Role:     models.UserRole(input.Role),
	}

	if err := h.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id": user.ID,
		"message": "User registered. MFA verification required.",
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input struct {
		Phone string `json:"phone" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.db.Where("phone = ?", input.Phone).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Trigger OTP
	_, err := h.otpService.GenerateOTP(user.ID, "LOGIN")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate OTP"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id":      user.ID,
		"otp_required": true,
		"message":      "OTP sent to your registered device",
	})
}

func (h *AuthHandler) VerifyOTP(c *gin.Context) {
	var input struct {
		UserID uint   `json:"user_id" binding:"required"`
		Code   string `json:"code" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	valid, err := h.otpService.VerifyOTP(input.UserID, input.Code, "LOGIN")
	if err != nil || !valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired OTP"})
		return
	}

	// In a real app, generate JWT here
	c.JSON(http.StatusOK, gin.H{
		"message":      "Login successful",
		"access_token": "mock-jwt-token",
	})
}

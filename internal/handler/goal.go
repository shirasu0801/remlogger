package handler

import (
	"net/http"
	"remlogger/db"
	"remlogger/internal/model"

	"github.com/gin-gonic/gin"
)

type GoalHandler struct{}

func NewGoalHandler() *GoalHandler {
	return &GoalHandler{}
}

func (h *GoalHandler) Get(c *gin.Context) {
	var goal model.Goal
	result := db.GetDB().First(&goal)
	if result.Error != nil {
		c.JSON(http.StatusOK, gin.H{
			"target_duration":  480, // default 8 hours
			"target_bedtime":   "23:00",
			"reminder_enabled": false,
			"reminder_time":    "22:30",
		})
		return
	}
	c.JSON(http.StatusOK, goal)
}

func (h *GoalHandler) Create(c *gin.Context) {
	var req model.CreateGoalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	goal := model.Goal{
		TargetDuration:  req.TargetDuration,
		TargetBedtime:   req.TargetBedtime,
		ReminderEnabled: req.ReminderEnabled,
		ReminderTime:    req.ReminderTime,
	}

	// Check if goal exists and update, otherwise create
	var existing model.Goal
	result := db.GetDB().First(&existing)
	if result.Error != nil {
		if err := db.GetDB().Create(&goal).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		goal.ID = existing.ID
		if err := db.GetDB().Save(&goal).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, goal)
}

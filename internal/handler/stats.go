package handler

import (
	"net/http"
	"remlogger/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	service *service.StatsService
}

func NewStatsHandler() *StatsHandler {
	return &StatsHandler{
		service: service.NewStatsService(),
	}
}

func (h *StatsHandler) GetDaily(c *gin.Context) {
	days := 30 // default
	if d := c.Query("days"); d != "" {
		if parsed, err := strconv.Atoi(d); err == nil {
			days = parsed
		}
	}

	stats, err := h.service.GetDailyStats(days)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *StatsHandler) GetWeekly(c *gin.Context) {
	weeks := 12 // default
	if w := c.Query("weeks"); w != "" {
		if parsed, err := strconv.Atoi(w); err == nil {
			weeks = parsed
		}
	}

	stats, err := h.service.GetWeeklyStats(weeks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *StatsHandler) GetMonthly(c *gin.Context) {
	months := 12 // default
	if m := c.Query("months"); m != "" {
		if parsed, err := strconv.Atoi(m); err == nil {
			months = parsed
		}
	}

	stats, err := h.service.GetMonthlyStats(months)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

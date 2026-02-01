package main

import (
	"log"
	"remlogger/db"
	"remlogger/internal/handler"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db.InitDB()

	// Setup Gin router
	r := gin.Default()

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	// Initialize handlers
	sleepHandler := handler.NewSleepHandler()
	goalHandler := handler.NewGoalHandler()
	statsHandler := handler.NewStatsHandler()

	// API routes
	api := r.Group("/api")
	{
		// Sleep records
		api.GET("/sleep", sleepHandler.GetAll)
		api.POST("/sleep", sleepHandler.Create)
		api.PUT("/sleep/:id", sleepHandler.Update)
		api.DELETE("/sleep/:id", sleepHandler.Delete)

		// Goals
		api.GET("/goal", goalHandler.Get)
		api.POST("/goal", goalHandler.Create)

		// Statistics
		api.GET("/stats/daily", statsHandler.GetDaily)
		api.GET("/stats/weekly", statsHandler.GetWeekly)
		api.GET("/stats/monthly", statsHandler.GetMonthly)
	}

	log.Println("Server starting on http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

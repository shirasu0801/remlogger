package model

import (
	"time"
)

type SleepRecord struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	SleepTime time.Time  `json:"sleep_time"`
	WakeTime  *time.Time `json:"wake_time"`
	Duration  int        `json:"duration"` // minutes
	Quality   int        `json:"quality"`  // 1-5
	Note      string     `json:"note"`
	CreatedAt time.Time  `json:"created_at"`
}

type CreateSleepRequest struct {
	SleepTime string `json:"sleep_time" binding:"required"`
	WakeTime  string `json:"wake_time"`
	Quality   int    `json:"quality"`
	Note      string `json:"note"`
}

type UpdateSleepRequest struct {
	SleepTime string `json:"sleep_time"`
	WakeTime  string `json:"wake_time"`
	Quality   int    `json:"quality"`
	Note      string `json:"note"`
}

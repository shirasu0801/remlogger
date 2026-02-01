package model

type Goal struct {
	ID              uint   `json:"id" gorm:"primaryKey"`
	TargetDuration  int    `json:"target_duration"`  // minutes
	TargetBedtime   string `json:"target_bedtime"`   // HH:MM format
	ReminderEnabled bool   `json:"reminder_enabled"`
	ReminderTime    string `json:"reminder_time"` // HH:MM format
}

type CreateGoalRequest struct {
	TargetDuration  int    `json:"target_duration"`
	TargetBedtime   string `json:"target_bedtime"`
	ReminderEnabled bool   `json:"reminder_enabled"`
	ReminderTime    string `json:"reminder_time"`
}

package repository

import (
	"remlogger/db"
	"remlogger/internal/model"
)

type GoalRepository struct{}

func NewGoalRepository() *GoalRepository {
	return &GoalRepository{}
}

func (r *GoalRepository) Get() (*model.Goal, error) {
	var goal model.Goal
	err := db.GetDB().First(&goal).Error
	return &goal, err
}

func (r *GoalRepository) CreateOrUpdate(goal *model.Goal) error {
	var existing model.Goal
	result := db.GetDB().First(&existing)
	if result.Error != nil {
		// No existing goal, create new
		return db.GetDB().Create(goal).Error
	}
	// Update existing goal
	goal.ID = existing.ID
	return db.GetDB().Save(goal).Error
}

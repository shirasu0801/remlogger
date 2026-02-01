package repository

import (
	"remlogger/db"
	"remlogger/internal/model"
	"time"
)

type SleepRepository struct{}

func NewSleepRepository() *SleepRepository {
	return &SleepRepository{}
}

func (r *SleepRepository) Create(record *model.SleepRecord) error {
	return db.GetDB().Create(record).Error
}

func (r *SleepRepository) GetAll() ([]model.SleepRecord, error) {
	var records []model.SleepRecord
	err := db.GetDB().Order("sleep_time desc").Find(&records).Error
	return records, err
}

func (r *SleepRepository) GetByID(id uint) (*model.SleepRecord, error) {
	var record model.SleepRecord
	err := db.GetDB().First(&record, id).Error
	return &record, err
}

func (r *SleepRepository) Update(record *model.SleepRecord) error {
	return db.GetDB().Save(record).Error
}

func (r *SleepRepository) Delete(id uint) error {
	return db.GetDB().Delete(&model.SleepRecord{}, id).Error
}

func (r *SleepRepository) GetByDateRange(start, end time.Time) ([]model.SleepRecord, error) {
	var records []model.SleepRecord
	err := db.GetDB().Where("sleep_time BETWEEN ? AND ?", start, end).
		Order("sleep_time asc").Find(&records).Error
	return records, err
}

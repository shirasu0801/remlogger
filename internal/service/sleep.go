package service

import (
	"remlogger/internal/model"
	"remlogger/internal/repository"
	"time"
)

type SleepService struct {
	repo *repository.SleepRepository
}

func NewSleepService() *SleepService {
	return &SleepService{
		repo: repository.NewSleepRepository(),
	}
}

func (s *SleepService) CreateRecord(req *model.CreateSleepRequest) (*model.SleepRecord, error) {
	sleepTime, err := time.Parse(time.RFC3339, req.SleepTime)
	if err != nil {
		return nil, err
	}

	record := &model.SleepRecord{
		SleepTime: sleepTime,
		Quality:   req.Quality,
		Note:      req.Note,
		CreatedAt: time.Now(),
	}

	if req.WakeTime != "" {
		wakeTime, err := time.Parse(time.RFC3339, req.WakeTime)
		if err != nil {
			return nil, err
		}
		record.WakeTime = &wakeTime
		record.Duration = int(wakeTime.Sub(sleepTime).Minutes())
	}

	err = s.repo.Create(record)
	return record, err
}

func (s *SleepService) GetAllRecords() ([]model.SleepRecord, error) {
	return s.repo.GetAll()
}

func (s *SleepService) GetRecord(id uint) (*model.SleepRecord, error) {
	return s.repo.GetByID(id)
}

func (s *SleepService) UpdateRecord(id uint, req *model.UpdateSleepRequest) (*model.SleepRecord, error) {
	record, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if req.SleepTime != "" {
		sleepTime, err := time.Parse(time.RFC3339, req.SleepTime)
		if err != nil {
			return nil, err
		}
		record.SleepTime = sleepTime
	}

	if req.WakeTime != "" {
		wakeTime, err := time.Parse(time.RFC3339, req.WakeTime)
		if err != nil {
			return nil, err
		}
		record.WakeTime = &wakeTime
		record.Duration = int(wakeTime.Sub(record.SleepTime).Minutes())
	}

	if req.Quality > 0 {
		record.Quality = req.Quality
	}

	record.Note = req.Note

	err = s.repo.Update(record)
	return record, err
}

func (s *SleepService) DeleteRecord(id uint) error {
	return s.repo.Delete(id)
}

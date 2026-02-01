package service

import (
	"remlogger/internal/model"
	"remlogger/internal/repository"
	"time"
)

type StatsService struct {
	sleepRepo *repository.SleepRepository
	goalRepo  *repository.GoalRepository
}

func NewStatsService() *StatsService {
	return &StatsService{
		sleepRepo: repository.NewSleepRepository(),
		goalRepo:  repository.NewGoalRepository(),
	}
}

type DailyStat struct {
	Date            string  `json:"date"`
	Duration        int     `json:"duration"`
	Quality         int     `json:"quality"`
	SleepTime       string  `json:"sleep_time"`
	WakeTime        string  `json:"wake_time"`
	GoalAchieved    bool    `json:"goal_achieved"`
	AchievementRate float64 `json:"achievement_rate"`
}

type WeeklyStat struct {
	WeekStart       string  `json:"week_start"`
	WeekEnd         string  `json:"week_end"`
	AvgDuration     float64 `json:"avg_duration"`
	AvgQuality      float64 `json:"avg_quality"`
	TotalRecords    int     `json:"total_records"`
	AchievementRate float64 `json:"achievement_rate"`
}

type MonthlyStat struct {
	Month           string  `json:"month"`
	AvgDuration     float64 `json:"avg_duration"`
	AvgQuality      float64 `json:"avg_quality"`
	TotalRecords    int     `json:"total_records"`
	AchievementRate float64 `json:"achievement_rate"`
}

func (s *StatsService) GetDailyStats(days int) ([]DailyStat, error) {
	end := time.Now()
	start := end.AddDate(0, 0, -days)

	records, err := s.sleepRepo.GetByDateRange(start, end)
	if err != nil {
		return nil, err
	}

	goal, _ := s.goalRepo.Get()

	var stats []DailyStat
	for _, r := range records {
		stat := DailyStat{
			Date:      r.SleepTime.Format("2006-01-02"),
			Duration:  r.Duration,
			Quality:   r.Quality,
			SleepTime: r.SleepTime.Format("15:04"),
		}
		if r.WakeTime != nil {
			stat.WakeTime = r.WakeTime.Format("15:04")
		}
		if goal != nil && goal.TargetDuration > 0 {
			stat.GoalAchieved = r.Duration >= goal.TargetDuration
			stat.AchievementRate = float64(r.Duration) / float64(goal.TargetDuration) * 100
		}
		stats = append(stats, stat)
	}

	return stats, nil
}

func (s *StatsService) GetWeeklyStats(weeks int) ([]WeeklyStat, error) {
	end := time.Now()
	start := end.AddDate(0, 0, -weeks*7)

	records, err := s.sleepRepo.GetByDateRange(start, end)
	if err != nil {
		return nil, err
	}

	goal, _ := s.goalRepo.Get()

	weeklyData := make(map[string][]model.SleepRecord)
	for _, r := range records {
		year, week := r.SleepTime.ISOWeek()
		weekStart := isoWeekStart(year, week)
		key := weekStart.Format("2006-01-02")
		weeklyData[key] = append(weeklyData[key], r)
	}

	var stats []WeeklyStat
	for weekStart, recs := range weeklyData {
		var totalDuration, totalQuality, achieved int
		for _, r := range recs {
			totalDuration += r.Duration
			totalQuality += r.Quality
			if goal != nil && goal.TargetDuration > 0 && r.Duration >= goal.TargetDuration {
				achieved++
			}
		}
		weekStartTime, _ := time.Parse("2006-01-02", weekStart)
		stat := WeeklyStat{
			WeekStart:    weekStart,
			WeekEnd:      weekStartTime.AddDate(0, 0, 6).Format("2006-01-02"),
			AvgDuration:  float64(totalDuration) / float64(len(recs)),
			AvgQuality:   float64(totalQuality) / float64(len(recs)),
			TotalRecords: len(recs),
		}
		if len(recs) > 0 {
			stat.AchievementRate = float64(achieved) / float64(len(recs)) * 100
		}
		stats = append(stats, stat)
	}

	return stats, nil
}

func (s *StatsService) GetMonthlyStats(months int) ([]MonthlyStat, error) {
	end := time.Now()
	start := end.AddDate(0, -months, 0)

	records, err := s.sleepRepo.GetByDateRange(start, end)
	if err != nil {
		return nil, err
	}

	goal, _ := s.goalRepo.Get()

	monthlyData := make(map[string][]model.SleepRecord)
	for _, r := range records {
		key := r.SleepTime.Format("2006-01")
		monthlyData[key] = append(monthlyData[key], r)
	}

	var stats []MonthlyStat
	for month, recs := range monthlyData {
		var totalDuration, totalQuality, achieved int
		for _, r := range recs {
			totalDuration += r.Duration
			totalQuality += r.Quality
			if goal != nil && goal.TargetDuration > 0 && r.Duration >= goal.TargetDuration {
				achieved++
			}
		}
		stat := MonthlyStat{
			Month:        month,
			AvgDuration:  float64(totalDuration) / float64(len(recs)),
			AvgQuality:   float64(totalQuality) / float64(len(recs)),
			TotalRecords: len(recs),
		}
		if len(recs) > 0 {
			stat.AchievementRate = float64(achieved) / float64(len(recs)) * 100
		}
		stats = append(stats, stat)
	}

	return stats, nil
}

func isoWeekStart(year, week int) time.Time {
	jan4 := time.Date(year, 1, 4, 0, 0, 0, 0, time.Local)
	_, jan4Week := jan4.ISOWeek()
	return jan4.AddDate(0, 0, (week-jan4Week)*7-int(jan4.Weekday())+1)
}

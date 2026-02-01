import { useState, useEffect } from 'react';
import SleepForm from '../components/SleepForm';
import { sleepAPI, goalAPI, statsAPI } from '../api/client';

function Home() {
  const [recentRecords, setRecentRecords] = useState([]);
  const [goal, setGoal] = useState(null);
  const [todayStats, setTodayStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sleepRes, goalRes, statsRes] = await Promise.all([
        sleepAPI.getAll(),
        goalAPI.get(),
        statsAPI.getDaily(7),
      ]);
      setRecentRecords(sleepRes.data?.slice(0, 3) || []);
      setGoal(goalRes.data);

      const stats = statsRes.data || [];
      if (stats.length > 0) {
        const avgDuration = stats.reduce((acc, s) => acc + s.duration, 0) / stats.length;
        const avgQuality = stats.reduce((acc, s) => acc + s.quality, 0) / stats.length;
        setTodayStats({
          avgDuration,
          avgQuality,
          totalRecords: stats.length,
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      await sleepAPI.create(data);
      loadData();
    } catch (error) {
      console.error('Failed to create record:', error);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '--';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}時間${mins}分`;
  };

  return (
    <div>
      <h1 className="page-title">睡眠時間管理</h1>

      {todayStats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{formatDuration(todayStats.avgDuration)}</div>
            <div className="stat-label">過去7日間の平均睡眠時間</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{todayStats.avgQuality.toFixed(1)}/5</div>
            <div className="stat-label">過去7日間の平均睡眠の質</div>
          </div>
          {goal && goal.target_duration > 0 && (
            <div className="stat-card">
              <div className="stat-value">
                {((todayStats.avgDuration / goal.target_duration) * 100).toFixed(0)}%
              </div>
              <div className="stat-label">目標達成率</div>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h2>睡眠を記録する</h2>
        <SleepForm onSubmit={handleSubmit} />
      </div>

      {recentRecords.length > 0 && (
        <div className="card">
          <h2>最近の記録</h2>
          <ul className="sleep-list">
            {recentRecords.map((record) => (
              <li key={record.id} className="sleep-item">
                <div className="sleep-info">
                  <div className="sleep-date">
                    {new Date(record.sleep_time).toLocaleDateString('ja-JP', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="sleep-times">
                    {new Date(record.sleep_time).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    →{' '}
                    {record.wake_time
                      ? new Date(record.wake_time).toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '--:--'}
                  </div>
                </div>
                <div className="sleep-duration">{formatDuration(record.duration)}</div>
                <div className="quality-stars">
                  {'★'.repeat(record.quality)}
                  {'☆'.repeat(5 - record.quality)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;

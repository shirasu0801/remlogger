import { useState, useEffect } from 'react';
import StatsChart from '../components/StatsChart';
import { statsAPI, goalAPI } from '../api/client';

function Stats() {
  const [viewType, setViewType] = useState('daily');
  const [stats, setStats] = useState([]);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [viewType]);

  const loadStats = async () => {
    try {
      setLoading(true);
      let response;
      if (viewType === 'daily') {
        response = await statsAPI.getDaily(30);
      } else if (viewType === 'weekly') {
        response = await statsAPI.getWeekly(12);
      } else {
        response = await statsAPI.getMonthly(12);
      }
      setStats(response.data || []);

      const goalRes = await goalAPI.get();
      setGoal(goalRes.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    if (!stats || stats.length === 0) return null;

    let totalDuration = 0;
    let totalQuality = 0;
    let achieved = 0;

    stats.forEach((s) => {
      if (viewType === 'daily') {
        totalDuration += s.duration || 0;
        totalQuality += s.quality || 0;
        if (goal && goal.target_duration > 0 && s.duration >= goal.target_duration) {
          achieved++;
        }
      } else {
        totalDuration += s.avg_duration || 0;
        totalQuality += s.avg_quality || 0;
      }
    });

    return {
      avgDuration: totalDuration / stats.length,
      avgQuality: totalQuality / stats.length,
      achievementRate: viewType === 'daily' ? (achieved / stats.length) * 100 : null,
    };
  };

  const summary = calculateSummary();

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}時間${mins}分`;
  };

  return (
    <div>
      <h1 className="page-title">統計</h1>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <button
            className={`btn ${viewType === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewType('daily')}
            style={{ marginRight: '10px' }}
          >
            日別
          </button>
          <button
            className={`btn ${viewType === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewType('weekly')}
            style={{ marginRight: '10px' }}
          >
            週別
          </button>
          <button
            className={`btn ${viewType === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewType('monthly')}
          >
            月別
          </button>
        </div>

        {summary && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{formatDuration(summary.avgDuration)}</div>
              <div className="stat-label">平均睡眠時間</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.avgQuality.toFixed(1)}/5</div>
              <div className="stat-label">平均睡眠の質</div>
            </div>
            {summary.achievementRate !== null && (
              <div className="stat-card">
                <div className="stat-value">{summary.achievementRate.toFixed(0)}%</div>
                <div className="stat-label">目標達成率</div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <StatsChart data={stats} type={viewType} />
        )}
      </div>
    </div>
  );
}

export default Stats;

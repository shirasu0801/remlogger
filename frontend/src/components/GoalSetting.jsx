import { useState, useEffect } from 'react';
import { goalAPI } from '../api/client';

function GoalSetting() {
  const [goal, setGoal] = useState({
    target_duration: 480,
    target_bedtime: '23:00',
    reminder_enabled: false,
    reminder_time: '22:30',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    try {
      const response = await goalAPI.get();
      setGoal(response.data);
    } catch (error) {
      console.error('Failed to load goal:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGoal((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDurationChange = (e) => {
    const hours = parseInt(e.target.value) || 0;
    setGoal((prev) => ({
      ...prev,
      target_duration: hours * 60,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await goalAPI.create(goal);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  return (
    <div className="card">
      <h2>目標設定</h2>
      <form onSubmit={handleSubmit}>
        <div className="goal-setting">
          <div className="form-group">
            <label>目標睡眠時間 (時間)</label>
            <input
              type="number"
              min="1"
              max="24"
              value={Math.round(goal.target_duration / 60)}
              onChange={handleDurationChange}
            />
          </div>

          <div className="form-group">
            <label>目標就寝時刻</label>
            <input
              type="time"
              name="target_bedtime"
              value={goal.target_bedtime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>リマインダー時刻</label>
            <input
              type="time"
              name="reminder_time"
              value={goal.reminder_time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>リマインダー通知</label>
            <div className="reminder-toggle">
              <div
                className={`toggle-switch ${goal.reminder_enabled ? 'active' : ''}`}
                onClick={() =>
                  setGoal((prev) => ({
                    ...prev,
                    reminder_enabled: !prev.reminder_enabled,
                  }))
                }
              />
              <span>{goal.reminder_enabled ? 'オン' : 'オフ'}</span>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
          保存
        </button>
        {saved && <span style={{ marginLeft: '10px', color: 'green' }}>保存しました!</span>}
      </form>
    </div>
  );
}

export default GoalSetting;

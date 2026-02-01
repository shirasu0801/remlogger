import { useState, useEffect } from 'react';
import { goalAPI } from '../api/client';

function Reminder() {
  const [permission, setPermission] = useState('default');
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
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

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('睡眠時間管理アプリ', {
        body: 'そろそろ就寝の時間です!',
        icon: '/favicon.ico',
      });
    }
  };

  useEffect(() => {
    if (!goal || !goal.reminder_enabled || permission !== 'granted') return;

    const checkTime = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      if (currentTime === goal.reminder_time) {
        new Notification('睡眠時間管理アプリ', {
          body: `${goal.target_bedtime}に就寝して、${Math.round(
            goal.target_duration / 60
          )}時間の睡眠を目指しましょう!`,
          icon: '/favicon.ico',
        });
      }
    };

    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [goal, permission]);

  return (
    <div className="card">
      <h2>リマインダー設定</h2>

      <div style={{ marginBottom: '20px' }}>
        <p>
          通知権限:{' '}
          <strong>
            {permission === 'granted'
              ? '許可済み'
              : permission === 'denied'
              ? '拒否'
              : '未設定'}
          </strong>
        </p>

        {permission === 'default' && (
          <button className="btn btn-primary" onClick={requestPermission}>
            通知を許可する
          </button>
        )}

        {permission === 'granted' && (
          <button className="btn btn-secondary" onClick={testNotification}>
            テスト通知を送信
          </button>
        )}

        {permission === 'denied' && (
          <p style={{ color: '#e53e3e' }}>
            ブラウザの設定から通知を許可してください。
          </p>
        )}
      </div>

      {goal && goal.reminder_enabled && (
        <p>
          毎日 {goal.reminder_time} に通知が届きます。目標就寝時刻: {goal.target_bedtime}
        </p>
      )}
    </div>
  );
}

export default Reminder;

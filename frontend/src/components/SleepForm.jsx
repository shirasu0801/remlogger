import { useState, useEffect } from 'react';

function SleepForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    sleep_time: '',
    wake_time: '',
    quality: 3,
    note: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        sleep_time: initialData.sleep_time ? formatDateTimeLocal(initialData.sleep_time) : '',
        wake_time: initialData.wake_time ? formatDateTimeLocal(initialData.wake_time) : '',
        quality: initialData.quality || 3,
        note: initialData.note || '',
      });
    }
  }, [initialData]);

  const formatDateTimeLocal = (isoString) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      sleep_time: new Date(formData.sleep_time).toISOString(),
      wake_time: formData.wake_time ? new Date(formData.wake_time).toISOString() : '',
      quality: parseInt(formData.quality),
      note: formData.note,
    };
    onSubmit(data);
    if (!initialData) {
      setFormData({ sleep_time: '', wake_time: '', quality: 3, note: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>就寝時刻</label>
        <input
          type="datetime-local"
          name="sleep_time"
          value={formData.sleep_time}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>起床時刻</label>
        <input
          type="datetime-local"
          name="wake_time"
          value={formData.wake_time}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>睡眠の質 (1-5)</label>
        <select name="quality" value={formData.quality} onChange={handleChange}>
          <option value={1}>1 - 非常に悪い</option>
          <option value={2}>2 - 悪い</option>
          <option value={3}>3 - 普通</option>
          <option value={4}>4 - 良い</option>
          <option value={5}>5 - 非常に良い</option>
        </select>
      </div>

      <div className="form-group">
        <label>メモ</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows="3"
          placeholder="睡眠に関するメモ..."
        />
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? '更新' : '記録'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}

export default SleepForm;

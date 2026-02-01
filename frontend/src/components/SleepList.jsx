function SleepList({ records, onEdit, onDelete }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '--';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  const renderQuality = (quality) => {
    return '★'.repeat(quality) + '☆'.repeat(5 - quality);
  };

  if (!records || records.length === 0) {
    return <p>記録がありません。</p>;
  }

  return (
    <ul className="sleep-list">
      {records.map((record) => (
        <li key={record.id} className="sleep-item">
          <div className="sleep-info">
            <div className="sleep-date">{formatDate(record.sleep_time)}</div>
            <div className="sleep-times">
              就寝: {formatTime(record.sleep_time)} → 起床: {formatTime(record.wake_time)}
            </div>
            {record.note && <div className="sleep-note">{record.note}</div>}
          </div>
          <div className="sleep-duration">{formatDuration(record.duration)}</div>
          <div className="quality-stars">{renderQuality(record.quality)}</div>
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => onEdit(record)}>
              編集
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(record.id)}>
              削除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SleepList;

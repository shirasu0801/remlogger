import { useState, useEffect } from 'react';
import SleepForm from '../components/SleepForm';
import SleepList from '../components/SleepList';
import { sleepAPI } from '../api/client';

function History() {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await sleepAPI.getAll();
      setRecords(response.data || []);
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  const handleUpdate = async (data) => {
    try {
      await sleepAPI.update(editingRecord.id, data);
      setEditingRecord(null);
      loadRecords();
    } catch (error) {
      console.error('Failed to update record:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('この記録を削除しますか?')) return;
    try {
      await sleepAPI.delete(id);
      loadRecords();
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleCancel = () => {
    setEditingRecord(null);
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h1 className="page-title">睡眠履歴</h1>

      {editingRecord && (
        <div className="card">
          <h2>記録を編集</h2>
          <SleepForm
            onSubmit={handleUpdate}
            initialData={editingRecord}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="card">
        <h2>すべての記録 ({records.length}件)</h2>
        <SleepList records={records} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default History;

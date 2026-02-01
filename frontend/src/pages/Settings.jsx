import GoalSetting from '../components/GoalSetting';
import Reminder from '../components/Reminder';

function Settings() {
  return (
    <div>
      <h1 className="page-title">設定</h1>
      <GoalSetting />
      <Reminder />
    </div>
  );
}

export default Settings;

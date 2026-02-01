import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatsChart({ data, type = 'daily' }) {
  if (!data || data.length === 0) {
    return <p>データがありません。</p>;
  }

  const formatDuration = (minutes) => {
    const hours = minutes / 60;
    return hours.toFixed(1);
  };

  const chartData = {
    labels: data.map((d) => {
      if (type === 'daily') return d.date;
      if (type === 'weekly') return `${d.week_start}`;
      if (type === 'monthly') return d.month;
      return '';
    }),
    datasets: [
      {
        label: '睡眠時間 (時間)',
        data: data.map((d) => {
          if (type === 'daily') return formatDuration(d.duration);
          return formatDuration(d.avg_duration);
        }),
        borderColor: 'rgb(74, 108, 247)',
        backgroundColor: 'rgba(74, 108, 247, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const qualityData = {
    labels: data.map((d) => {
      if (type === 'daily') return d.date;
      if (type === 'weekly') return `${d.week_start}`;
      if (type === 'monthly') return d.month;
      return '';
    }),
    datasets: [
      {
        label: '睡眠の質',
        data: data.map((d) => {
          if (type === 'daily') return d.quality;
          return d.avg_quality?.toFixed(1);
        }),
        borderColor: 'rgb(246, 173, 85)',
        backgroundColor: 'rgba(246, 173, 85, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const qualityOptions = {
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <div>
      <div className="chart-container">
        <h3>睡眠時間</h3>
        <Line data={chartData} options={options} />
      </div>
      <div className="chart-container" style={{ marginTop: '40px' }}>
        <h3>睡眠の質</h3>
        <Bar data={qualityData} options={qualityOptions} />
      </div>
    </div>
  );
}

export default StatsChart;

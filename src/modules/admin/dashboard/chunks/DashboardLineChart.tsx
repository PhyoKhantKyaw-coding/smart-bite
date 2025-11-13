import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const weekData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Revenue (Ks)",
      data: [1200000, 1500000, 1800000, 2000000, 1700000, 2200000, 1600000],
      borderColor: "#a21caf",
      backgroundColor: "rgba(162,28,175,0.1)",
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#a21caf",
      fill: true,
    },
  ],
};
const monthData = {
  labels: ["W1", "W2", "W3", "W4"],
  datasets: [
    {
      label: "Revenue (Ks)",
      data: [9000000, 11000000, 9500000, 12000000],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.1)",
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#6366f1",
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
  },
};

const DashboardLineChart = ({ range }: { range: "week" | "month" }) => (
  <div className="w-full h-64">
    <Line data={range === "week" ? weekData : monthData} options={options} />
  </div>
);

export default DashboardLineChart;

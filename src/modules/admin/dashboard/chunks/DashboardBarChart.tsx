import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const weekData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Orders",
      data: [120, 150, 180, 200, 170, 220, 160],
      backgroundColor: "#3b82f6",
      borderRadius: 6,
    },
  ],
};
const monthData = {
  labels: ["W1", "W2", "W3", "W4"],
  datasets: [
    {
      label: "Orders",
      data: [900, 1100, 950, 1200],
      backgroundColor: "#6366f1",
      borderRadius: 6,
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

const DashboardBarChart = ({ range }: { range: "week" | "month" }) => (
  <div className="w-full h-64">
    <Bar data={range === "week" ? weekData : monthData} options={options} />
  </div>
);

export default DashboardBarChart;

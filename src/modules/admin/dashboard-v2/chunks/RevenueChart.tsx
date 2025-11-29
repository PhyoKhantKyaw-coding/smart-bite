import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getRevenueChart } from "@/api/dashboard";
import type { RevenueDataDTO } from "@/api/dashboard/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const weekData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Revenue",
      data: [15000000, 18000000, 16000000, 22000000, 19000000, 25000000, 21000000],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: "#3b82f6",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    },
  ],
};

const monthData = {
  labels: ["W1", "W2", "W3", "W4"],
  datasets: [
    {
      label: "Revenue",
      data: [85000000, 95000000, 88000000, 102000000],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointBackgroundColor: "#6366f1",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleColor: "#fff",
      bodyColor: "#fff",
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#6b7280" },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(229, 231, 235, 0.5)" },
      ticks: { color: "#6b7280" },
    },
  },
};

const RevenueChart = ({ timeRange }: { timeRange: string }) => {
  const [revenueData, setRevenueData] = useState<RevenueDataDTO[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const range = timeRange === "today" ? "week" : timeRange === "year" ? "year" : timeRange === "month" ? "month" : "week";
        const response = await getRevenueChart({ range: range as "week" | "month" | "year" });
        if (response.data) {
          setRevenueData(response.data);
          const sum = response.data.reduce((acc, item) => acc + (item.revenue || 0), 0);
          setTotal(sum);
        }
      } catch (error) {
        console.error("Failed to fetch revenue chart:", error);
      }
    };
    fetchData();
  }, [timeRange]);

  const chartData = {
    labels: revenueData.length > 0 ? revenueData.map(d => d.date || "") : weekData.labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData.length > 0 ? revenueData.map(d => d.revenue || 0) : weekData.datasets[0].data,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <Card className="shadow-lg bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Revenue Analytics
          </CardTitle>
          <div className="text-sm text-muted-foreground">Total: {(total / 1000000).toFixed(1)}M Ks</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <Line key={timeRange} data={chartData} options={{ ...options, maintainAspectRatio: false, responsive: true }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { ShoppingCart } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getOrdersChart } from "@/api/dashboard";
import type { OrdersDataDTO } from "@/api/dashboard/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Completed",
      data: [120, 150, 180, 170, 200, 220, 190],
      backgroundColor: "#10b981",
      borderRadius: 8,
    },
    {
      label: "Pending",
      data: [30, 25, 40, 35, 30, 45, 38],
      backgroundColor: "#f59e0b",
      borderRadius: 8,
    },
    {
      label: "Cancelled",
      data: [10, 8, 12, 15, 10, 13, 11],
      backgroundColor: "#ef4444",
      borderRadius: 8,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: { padding: 15, usePointStyle: true },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#6b7280" } },
    y: { beginAtZero: true, grid: { color: "rgba(229, 231, 235, 0.5)" }, ticks: { color: "#6b7280" } },
  },
};

const OrdersChart = () => {
  const [ordersData, setOrdersData] = useState<OrdersDataDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrdersChart({ range: "week" });
        if (response.data) {
          setOrdersData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders chart:", error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: ordersData.length > 0 ? ordersData.map(d => d.date || "") : data.labels,
    datasets: [
      {
        label: "Completed",
        data: ordersData.length > 0 ? ordersData.map(d => d.completed || 0) : data.datasets[0].data,
        backgroundColor: "#10b981",
        borderRadius: 8,
      },
      {
        label: "Pending",
        data: ordersData.length > 0 ? ordersData.map(d => d.pending || 0) : data.datasets[1].data,
        backgroundColor: "#f59e0b",
        borderRadius: 8,
      },
      {
        label: "Cancelled",
        data: ordersData.length > 0 ? ordersData.map(d => d.cancelled || 0) : data.datasets[2].data,
        backgroundColor: "#ef4444",
        borderRadius: 8,
      },
    ],
  };

  return (
    <Card className="shadow-lg bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-purple-500" />
          Orders Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <Bar data={chartData} options={{ ...options, maintainAspectRatio: false, responsive: true }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersChart;

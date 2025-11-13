import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { PieChart } from "lucide-react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Burgers", "Pizza", "Desserts", "Drinks", "Others"],
  datasets: [
    {
      data: [35, 25, 20, 12, 8],
      backgroundColor: [
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
        "#f59e0b",
        "#10b981",
      ],
      borderWidth: 0,
      hoverOffset: 10,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { padding: 15, usePointStyle: true },
    },
  },
};

const CategoryChart = () => (
  <Card className="shadow-lg bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-pink-950/30 dark:via-rose-950/30 dark:to-orange-950/30 border-pink-200 dark:border-pink-800">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <PieChart className="w-5 h-5 text-pink-500" />
        Sales by Category
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </CardContent>
  </Card>
);

export default CategoryChart;

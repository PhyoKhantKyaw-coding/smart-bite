import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, LineChart } from "lucide-react";
import DashboardSummaryCards from "./DashboardSummaryCards";
import DashboardBarChart from "./chunks/DashboardBarChart";
import DashboardLineChart from "./chunks/DashboardLineChart";
import DashboardLatestOrders from "./chunks/DashboardLatestOrders";

const mockStats = {
  totalOrders: 12450,
  totalRevenue: 245000000,
  totalUsers: 3200,
  activeUsers: 1800,
  avgOrderValue: 19680,
  todayOrders: 320,
  todayRevenue: 6500000,
};

const DashboardView = () => {
  const [barChartRange, setBarChartRange] = useState<"week" | "month">("week");
  const [lineChartRange, setLineChartRange] = useState<"week" | "month">("month");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
              <BarChart2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Powerful analytics and management overview
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <DashboardSummaryCards stats={mockStats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-orange-500" />
                Daily Orders
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant={barChartRange === "week" ? "default" : "outline"} onClick={() => setBarChartRange("week")}>Week</Button>
                <Button size="sm" variant={barChartRange === "month" ? "default" : "outline"} onClick={() => setBarChartRange("month")}>Month</Button>
              </div>
            </CardHeader>
            <CardContent>
              <DashboardBarChart range={barChartRange} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-purple-500" />
                Revenue Trend
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant={lineChartRange === "week" ? "default" : "outline"} onClick={() => setLineChartRange("week")}>Week</Button>
                <Button size="sm" variant={lineChartRange === "month" ? "default" : "outline"} onClick={() => setLineChartRange("month")}>Month</Button>
              </div>
            </CardHeader>
            <CardContent>
              <DashboardLineChart range={lineChartRange} />
            </CardContent>
          </Card>
        </div>

        {/* Latest Orders Table */}
        <DashboardLatestOrders />
      </div>
    </div>
  );
};

export default DashboardView;

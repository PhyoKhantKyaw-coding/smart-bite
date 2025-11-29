import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  Package
} from "lucide-react";
import RevenueChart from "./chunks/RevenueChart";
import OrdersChart from "./chunks/OrdersChart";
import CategoryChart from "./chunks/CategoryChart";
import SalesOverview from "./chunks/SalesOverview";
import TopProducts from "./chunks/TopProducts";
import RecentActivity from "./chunks/RecentActivity";
import { getDashboardStats } from "@/api/dashboard";
import type { DashboardStatsDTO } from "@/api/dashboard/types";

const DashboardV2View = () => {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "year">("week");
  const [stats, setStats] = useState<DashboardStatsDTO>({
    totalRevenue: 125000000,
    totalOrders: 8450,
    totalUsers: 4200,
    avgOrderValue: 14793,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats({ period: timeRange });
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50  p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Real-time business insights and performance metrics
            </p>
          </div>
          <Tabs value={timeRange} onValueChange={(v: string) => setTimeRange(v as typeof timeRange)} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-l-4 border-l-blue-500 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.totalRevenue || 0).toLocaleString()} Ks</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500 font-medium">+12.5%</span>
                <span className="text-muted-foreground">from last {timeRange}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-purple-500 bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingCart className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.totalOrders || 0).toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingDown className="w-3 h-3 text-red-500" />
                <span className="text-red-500 font-medium">-3.2%</span>
                <span className="text-muted-foreground">from last {timeRange}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-green-500 bg-linear-to-br from-green-50 to-white dark:from-green-950/20 dark:to-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
              <Users className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.totalUsers || 0).toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500 font-medium">+8.1%</span>
                <span className="text-muted-foreground">from last {timeRange}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-orange-500 bg-linear-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
              <Package className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.avgOrderValue || 0).toLocaleString()} Ks</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500 font-medium">+5.4%</span>
                <span className="text-muted-foreground">from last {timeRange}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RevenueChart key={`revenue-${timeRange}`} timeRange={timeRange} />
            <OrdersChart key="orders-chart" />
          </div>
          <div className="space-y-6">
            <CategoryChart key="category-chart" />
            <SalesOverview />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default DashboardV2View;

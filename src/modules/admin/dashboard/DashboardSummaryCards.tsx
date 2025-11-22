import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, DollarSign, Users, TrendingUp, Package, Clock } from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  avgOrderValue: number;
  todayOrders: number;
  todayRevenue: number;
}

const formatNumber = (n: number) => n.toLocaleString();

const DashboardSummaryCards = ({ stats }: { stats: DashboardStats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    <Card className="bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        <Package className="w-5 h-5 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(stats.totalOrders)}</div>
      </CardContent>
    </Card>
    <Card className="bg-linear-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="w-5 h-5 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(stats.totalRevenue)} Ks</div>
      </CardContent>
    </Card>
    <Card className="bg-linear-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        <Users className="w-5 h-5 text-purple-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
      </CardContent>
    </Card>
    <Card className="bg-linear-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        <TrendingUp className="w-5 h-5 text-pink-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(stats.activeUsers)}</div>
      </CardContent>
    </Card>
    <Card className="bg-linear-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
        <BarChart2 className="w-5 h-5 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(stats.avgOrderValue)} Ks</div>
      </CardContent>
    </Card>
    <Card className="bg-linear-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
        <Clock className="w-5 h-5 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(stats.todayOrders)}</div>
        <div className="text-xs text-muted-foreground mt-1">{formatNumber(stats.todayRevenue)} Ks</div>
      </CardContent>
    </Card>
  </div>
);

export default DashboardSummaryCards;

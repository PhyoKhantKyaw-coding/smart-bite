import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package } from "lucide-react";

const DeliveryPerformanceChart = () => {
  const weekData = [
    { day: "Mon", deliveries: 45, earnings: 180000 },
    { day: "Tue", deliveries: 52, earnings: 208000 },
    { day: "Wed", deliveries: 38, earnings: 152000 },
    { day: "Thu", deliveries: 61, earnings: 244000 },
    { day: "Fri", deliveries: 55, earnings: 220000 },
    { day: "Sat", deliveries: 72, earnings: 288000 },
    { day: "Sun", deliveries: 48, earnings: 192000 },
  ];

  const maxDeliveries = Math.max(...weekData.map((d) => d.deliveries));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Weekly Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {weekData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {data.deliveries}
                  </span>
                  <div
                    className="w-full bg-linear-to-t from-orange-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${(data.deliveries / maxDeliveries) * 100}%`,
                      minHeight: "20px",
                    }}
                  />
                </div>
                <span className="text-xs font-medium">{data.day}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              <span className="text-muted-foreground">Deliveries Completed</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">
                {weekData.reduce((sum, d) => sum + d.deliveries, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Deliveries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {(weekData.reduce((sum, d) => sum + d.earnings, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {(weekData.reduce((sum, d) => sum + d.deliveries, 0) / 7).toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">Daily Average</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryPerformanceChart;

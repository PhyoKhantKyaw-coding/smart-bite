import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { getRecentActivity } from "@/api/dashboard";
import type { RecentActivityDTO } from "@/api/dashboard/types";

const activities = [
  { type: "order", user: "Aung Kyaw", action: "placed an order", amount: "12,500 Ks", time: "2 min ago", status: "new" },
  { type: "delivery", user: "Kyaw Kyaw", action: "completed delivery", amount: "18,200 Ks", time: "5 min ago", status: "success" },
  { type: "order", user: "Mya Mya", action: "cancelled order", amount: "8,900 Ks", time: "12 min ago", status: "cancelled" },
  { type: "user", user: "Zaw Zaw", action: "registered account", amount: "", time: "18 min ago", status: "info" },
  { type: "order", user: "Hla Hla", action: "placed an order", amount: "15,600 Ks", time: "25 min ago", status: "new" },
  { type: "delivery", user: "Myo Myo", action: "picked up order", amount: "22,100 Ks", time: "32 min ago", status: "pending" },
];

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusColors: Record<string, BadgeVariant> = {
  new: "default",
  success: "default",
  cancelled: "destructive",
  info: "secondary",
  pending: "outline",
};

const RecentActivity = () => {
  const [activities, setActivities] = useState<RecentActivityDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRecentActivity(10);
        if (response.data) {
          setActivities(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status?: string): BadgeVariant => {
    if (!status) return "default";
    const colors: Record<string, BadgeVariant> = {
      completed: "default",
      success: "default",
      cancelled: "destructive",
      pending: "outline",
      new: "secondary",
    };
    return colors[status.toLowerCase()] || "default";
  };

  return (
    <Card className="shadow-lg bg-linear-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/30 dark:via-sky-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 border backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-900/70 transition-colors">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{activity.title}</span>
                  {activity.status && (
                    <Badge variant={getStatusColor(activity.status)} className="text-xs">
                      {activity.status}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground">{activity.description}</span>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-muted-foreground py-8">No recent activity</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

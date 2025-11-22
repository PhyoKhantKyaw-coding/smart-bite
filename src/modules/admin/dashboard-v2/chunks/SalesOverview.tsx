import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const stats = [
  { label: "Today's Sales", value: "4.2M Ks", change: "+18%", color: "text-green-500" },
  { label: "This Week", value: "28.5M Ks", change: "+12%", color: "text-green-500" },
  { label: "This Month", value: "125M Ks", change: "+8%", color: "text-green-500" },
  { label: "Conversion Rate", value: "3.2%", change: "-2%", color: "text-red-500" },
];

const SalesOverview = () => (
  <Card className="shadow-lg bg-linear-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/30 dark:via-violet-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-500" />
        Sales Overview
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 border backdrop-blur-sm">
            <div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xl font-bold mt-1">{stat.value}</div>
            </div>
            <div className={`text-sm font-semibold ${stat.color}`}>{stat.change}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default SalesOverview;

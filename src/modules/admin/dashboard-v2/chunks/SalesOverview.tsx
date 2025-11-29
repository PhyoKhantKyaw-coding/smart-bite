import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { getSalesOverview } from "@/api/dashboard";
import type { SalesOverviewDTO } from "@/api/dashboard/types";

const stats = [
  { label: "Today's Sales", value: "4.2M Ks", change: "+18%", color: "text-green-500" },
  { label: "This Week", value: "28.5M Ks", change: "+12%", color: "text-green-500" },
  { label: "This Month", value: "125M Ks", change: "+8%", color: "text-green-500" },
  { label: "Conversion Rate", value: "3.2%", change: "-2%", color: "text-red-500" },
];

const SalesOverview = () => {
  const [overview, setOverview] = useState<SalesOverviewDTO | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSalesOverview("today");
        if (response.data) {
          setOverview(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch sales overview:", error);
      }
    };
    fetchData();
  }, []);

  const displayStats = [
    { label: "Today's Sales", value: `${((overview?.todaySales || 0) / 1000000).toFixed(1)}M Ks`, change: "+18%", color: "text-green-500" },
    { label: "This Week", value: `${((overview?.weekSales || 0) / 1000000).toFixed(1)}M Ks`, change: "+12%", color: "text-green-500" },
    { label: "This Month", value: `${((overview?.monthSales || 0) / 1000000).toFixed(1)}M Ks`, change: "+8%", color: "text-green-500" },
    { label: "Growth Rate", value: `${(overview?.growthRate || 0).toFixed(1)}%`, change: `${overview?.growthRate ? (overview.growthRate > 0 ? '+' : '') : ''}${(overview?.growthRate || 0).toFixed(1)}%`, color: (overview?.growthRate || 0) > 0 ? "text-green-500" : "text-red-500" },
  ];

  return (
    <Card className="shadow-lg bg-linear-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/30 dark:via-violet-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Sales Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayStats.map((stat, idx) => (
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
};

export default SalesOverview;

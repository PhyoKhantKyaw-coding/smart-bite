import { Card, CardContent } from "@/components/ui/card";
import { Truck, Users, Activity, DollarSign, TrendingUp, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalDeliveries: number;
    activeDeliveries: number;
    onlineNow: number;
    totalEarnings: number;
    todayDeliveries: number;
    avgRating: string;
  };
}

const DeliveryStatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Total Delivery Staff",
      value: stats.totalDeliveries,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Personnel",
      value: stats.activeDeliveries,
      icon: Truck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Online Now",
      value: stats.onlineNow,
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Total Earnings",
      value: `${(stats.totalEarnings / 1000).toFixed(0)}K MMK`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Today's Deliveries",
      value: stats.todayDeliveries,
      icon: CheckCircle,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950",
      textColor: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Average Rating",
      value: `${stats.avgRating} ⭐`,
      icon: TrendingUp,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className={`${card.bgColor} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-linear-to-br ${card.color}`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DeliveryStatsCards;

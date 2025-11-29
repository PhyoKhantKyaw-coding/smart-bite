import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { getTopProducts } from "@/api/dashboard";
import type { TopProductDTO } from "@/api/dashboard/types";

const products = [
  { name: "Classic Burger", sales: 1250, revenue: "18.5M Ks", trend: "+12%", color: "bg-blue-500" },
  { name: "Pepperoni Pizza", sales: 980, revenue: "15.2M Ks", trend: "+8%", color: "bg-purple-500" },
  { name: "Cheese Burger", sales: 850, revenue: "12.8M Ks", trend: "+15%", color: "bg-pink-500" },
  { name: "Chicken Wings", sales: 720, revenue: "9.5M Ks", trend: "+6%", color: "bg-orange-500" },
  { name: "Chocolate Cake", sales: 650, revenue: "8.2M Ks", trend: "+20%", color: "bg-green-500" },
];

const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-green-500"];

const TopProducts = () => {
  const [products, setProducts] = useState<TopProductDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTopProducts({ limit: 5 });
        if (response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="shadow-lg bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Top Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length > 0 ? products.map((product, idx) => (
            <div key={product.foodId} className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 border backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-900/70 transition-colors">
              <div className={`w-10 h-10 rounded-lg ${colors[idx % colors.length]} flex items-center justify-center text-white font-bold shadow-md`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{product.foodName}</div>
                <div className="text-sm text-muted-foreground">{product.totalOrders} sales</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{((product.totalRevenue || 0) / 1000000).toFixed(1)}M Ks</div>
                <div className="text-sm text-muted-foreground">{product.category}</div>
              </div>
            </div>
          )) : (
            <div className="text-center text-muted-foreground py-8">No data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;

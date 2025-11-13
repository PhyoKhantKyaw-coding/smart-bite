import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockOrders = [
  { id: "ORD-1001", user: "Aung Kyaw", amount: 12000, status: "Delivered", time: "10:32 AM" },
  { id: "ORD-1002", user: "Mya Mya", amount: 8500, status: "Pending", time: "11:10 AM" },
  { id: "ORD-1003", user: "Ko Ko", amount: 15000, status: "Delivered", time: "12:05 PM" },
  { id: "ORD-1004", user: "Soe Soe", amount: 9800, status: "Cancelled", time: "12:30 PM" },
  { id: "ORD-1005", user: "Hla Hla", amount: 11200, status: "Delivered", time: "1:15 PM" },
];

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusColor: Record<string, BadgeVariant> = {
  Delivered: "default",
  Pending: "secondary",
  Cancelled: "destructive",
};

const DashboardLatestOrders = () => (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        Latest Orders
        <span className="text-xs text-muted-foreground">(Today)</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left font-semibold">Order ID</th>
              <th className="py-2 px-4 text-left font-semibold">User</th>
              <th className="py-2 px-4 text-left font-semibold">Amount</th>
              <th className="py-2 px-4 text-left font-semibold">Status</th>
              <th className="py-2 px-4 text-left font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="py-2 px-4 font-mono">{order.id}</td>
                <td className="py-2 px-4">{order.user}</td>
                <td className="py-2 px-4">{order.amount.toLocaleString()} Ks</td>
                <td className="py-2 px-4">
                  <Badge variant={statusColor[order.status] || "secondary"}>{order.status}</Badge>
                </td>
                <td className="py-2 px-4">{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export default DashboardLatestOrders;

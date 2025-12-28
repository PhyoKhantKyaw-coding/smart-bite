import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Eye } from "lucide-react";
import OrderDetailDialog from "./OrderDetailDialog";

interface OrderItem {
  foodName: string;
  quantity: number;
  price: number;
}

interface DeliveryOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  orderDate: string;
  totalAmount: number;
  status: "New" | "Picked Up" | "In Transit" | "Delivered";
  items: OrderItem[];
  distance: string;
  estimatedTime: string;
}

const DeliveredOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Mock delivered orders
  const [deliveredOrders] = useState<DeliveryOrder[]>([
    {
      orderId: "ORD-095",
      customerName: "Ma Su Su",
      customerPhone: "+95 9666777888",
      pickupAddress: "Fast Food Corner, Yangon",
      deliveryAddress: "321 Cedar Lane, Yangon",
      orderDate: "2025-11-30 10:30 AM",
      totalAmount: 22000,
      status: "Delivered",
      distance: "3.5 km",
      estimatedTime: "Completed",
      items: [
        { foodName: "Burger Combo", quantity: 1, price: 12000 },
        { foodName: "French Fries", quantity: 2, price: 5000 },
      ],
    },
    {
      orderId: "ORD-094",
      customerName: "U Tin Tin",
      customerPhone: "+95 9222333444",
      pickupAddress: "Noodle House, Yangon",
      deliveryAddress: "654 Maple Drive, Yangon",
      orderDate: "2025-11-30 09:15 AM",
      totalAmount: 15000,
      status: "Delivered",
      distance: "2.8 km",
      estimatedTime: "Completed",
      items: [{ foodName: "Shan Noodles", quantity: 3, price: 5000 }],
    },
    {
      orderId: "ORD-093",
      customerName: "Ma Nilar",
      customerPhone: "+95 9888999000",
      pickupAddress: "Coffee Shop, Downtown",
      deliveryAddress: "987 Birch Avenue, Yangon",
      orderDate: "2025-11-30 08:45 AM",
      totalAmount: 12000,
      status: "Delivered",
      distance: "1.5 km",
      estimatedTime: "Completed",
      items: [
        { foodName: "Cappuccino", quantity: 2, price: 4000 },
        { foodName: "Croissant", quantity: 2, price: 2000 },
      ],
    },
    {
      orderId: "ORD-092",
      customerName: "Ko Zaw Min",
      customerPhone: "+95 9555666777",
      pickupAddress: "Tea House, Yangon",
      deliveryAddress: "234 Palm Street, Yangon",
      orderDate: "2025-11-30 08:00 AM",
      totalAmount: 8000,
      status: "Delivered",
      distance: "1.0 km",
      estimatedTime: "Completed",
      items: [
        { foodName: "Milk Tea", quantity: 2, price: 3000 },
        { foodName: "Samosa", quantity: 4, price: 500 },
      ],
    },
    {
      orderId: "ORD-091",
      customerName: "Daw Thandar",
      customerPhone: "+95 9444555666",
      pickupAddress: "Shan Kitchen, Yangon",
      deliveryAddress: "567 Beach Road, Yangon",
      orderDate: "2025-11-29 06:30 PM",
      totalAmount: 35000,
      status: "Delivered",
      distance: "4.2 km",
      estimatedTime: "Completed",
      items: [
        { foodName: "Shan Rice", quantity: 2, price: 12000 },
        { foodName: "Tofu Salad", quantity: 2, price: 5500 },
      ],
    },
  ]);

  const getStatusColor = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewOrder = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          Delivered Orders ({deliveredOrders.length})
        </h2>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No delivery history
                  </TableCell>
                </TableRow>
              ) : (
                deliveredOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>
                      <div>{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                    </TableCell>
                    <TableCell className="text-sm">{order.orderDate}</TableCell>
                    <TableCell className="text-sm">{order.distance}</TableCell>
                    <TableCell className="font-semibold">
                      {order.totalAmount.toLocaleString()} MMK
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {deliveredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No delivery history
            </CardContent>
          </Card>
        ) : (
          deliveredOrders.map((order) => (
            <Card key={order.orderId}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{order.orderId}</h3>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{order.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span>{order.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">{order.totalAmount.toLocaleString()} MMK</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          open={showOrderDetail}
          onOpenChange={setShowOrderDetail}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default DeliveredOrders;

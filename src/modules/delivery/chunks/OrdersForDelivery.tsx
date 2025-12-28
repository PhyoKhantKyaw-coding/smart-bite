import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Package, Phone, User } from "lucide-react";
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

const OrdersForDelivery = () => {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Mock new orders
  const [newOrders] = useState<DeliveryOrder[]>([
    {
      orderId: "ORD-101",
      customerName: "Ma Aye Aye",
      customerPhone: "+95 9111222333",
      pickupAddress: "Downtown Restaurant, 45 Main St, Yangon",
      deliveryAddress: "Building A, 123 Street, Yangon",
      orderDate: "2025-11-30 11:45 AM",
      totalAmount: 18000,
      status: "New",
      distance: "2.5 km",
      estimatedTime: "15 mins",
      items: [
        { foodName: "Chicken Fried Rice", quantity: 2, price: 7000 },
        { foodName: "Spring Rolls", quantity: 1, price: 4000 },
      ],
    },
    {
      orderId: "ORD-102",
      customerName: "U Kyaw Kyaw",
      customerPhone: "+95 9444555666",
      pickupAddress: "City Mall Food Court, Mandalay",
      deliveryAddress: "123 Oak Avenue, Mandalay",
      orderDate: "2025-11-30 11:50 AM",
      totalAmount: 25000,
      status: "New",
      distance: "3.8 km",
      estimatedTime: "20 mins",
      items: [
        { foodName: "Pizza Margherita", quantity: 1, price: 18000 },
        { foodName: "Coca Cola", quantity: 2, price: 3500 },
      ],
    },
  ]);

  // Mock in-progress orders
  const [inProgressOrders] = useState<DeliveryOrder[]>([
    {
      orderId: "ORD-098",
      customerName: "Daw Mya Mya",
      customerPhone: "+95 9777888999",
      pickupAddress: "Golden Restaurant, Yangon",
      deliveryAddress: "456 Pine Road, Yangon",
      orderDate: "2025-11-30 11:30 AM",
      totalAmount: 32000,
      status: "In Transit",
      distance: "1.2 km",
      estimatedTime: "8 mins",
      items: [
        { foodName: "Beef Noodles", quantity: 2, price: 10000 },
        { foodName: "Iced Tea", quantity: 2, price: 6000 },
      ],
    },
    {
      orderId: "ORD-099",
      customerName: "Ko Aung Aung",
      customerPhone: "+95 9333444555",
      pickupAddress: "Spice Corner, Downtown",
      deliveryAddress: "789 Elm Street, Yangon",
      orderDate: "2025-11-30 11:20 AM",
      totalAmount: 28000,
      status: "Picked Up",
      distance: "2.0 km",
      estimatedTime: "12 mins",
      items: [
        { foodName: "Thai Green Curry", quantity: 1, price: 15000 },
        { foodName: "Jasmine Rice", quantity: 2, price: 6500 },
      ],
    },
  ]);

  const getStatusColor = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-500";
      case "Picked Up":
        return "bg-purple-500";
      case "In Transit":
        return "bg-orange-500";
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
      {/* New Orders Section */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6" />
          New Orders ({newOrders.length})
        </h2>
        {newOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No new orders available
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {newOrders.map((order) => (
              <Card key={order.orderId} className="border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{order.orderId}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="w-4 h-4" />
                          {order.customerName}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {order.customerPhone}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} w-fit`}>
                        {order.status}
                      </Badge>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-1" />
                        <div className="text-sm">
                          <div className="font-medium">Pickup</div>
                          <div className="text-muted-foreground">{order.pickupAddress}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                        <div className="text-sm">
                          <div className="font-medium">Delivery</div>
                          <div className="text-muted-foreground">{order.deliveryAddress}</div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{order.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>~{order.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{order.totalAmount.toLocaleString()} MMK</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="flex-1 sm:flex-initial"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="gradient-primary flex-1 sm:flex-initial"
                      >
                        Accept Order
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* In Progress Orders Section */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6" />
          In Progress ({inProgressOrders.length})
        </h2>
        {inProgressOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No orders in progress
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {inProgressOrders.map((order) => (
              <Card key={order.orderId} className="border-2 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{order.orderId}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="w-4 h-4" />
                          {order.customerName}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {order.customerPhone}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} w-fit`}>
                        {order.status}
                      </Badge>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-1" />
                        <div className="text-sm">
                          <div className="font-medium">Pickup</div>
                          <div className="text-muted-foreground">{order.pickupAddress}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                        <div className="text-sm">
                          <div className="font-medium">Delivery</div>
                          <div className="text-muted-foreground">{order.deliveryAddress}</div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{order.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>~{order.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{order.totalAmount.toLocaleString()} MMK</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="flex-1 sm:flex-initial"
                      >
                        View Details
                      </Button>
                      {order.status === "Picked Up" && (
                        <Button
                          size="sm"
                          className="gradient-primary flex-1 sm:flex-initial"
                        >
                          Start Delivery
                        </Button>
                      )}
                      {order.status === "In Transit" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial"
                        >
                          Complete Delivery
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

export default OrdersForDelivery;

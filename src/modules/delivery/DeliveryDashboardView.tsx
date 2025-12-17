import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  MapPin,
  Phone,
  Bike,
  Star,
  DollarSign,
  Bell,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import OrderDetailDialog from "./chunks/OrderDetailDialog";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

const DeliveryDashboardView = () => {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("inprogress");

  // Mock delivery person data
  const deliveryPerson = {
    name: "Ko Zaw Zaw",
    phone: "+95 9123456789",
    email: "zawzaw@delivery.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZawZaw",
    rating: 4.8,
    totalDeliveries: 156,
    completedToday: 8,
    earnings: 45000,
    vehicleType: "Bicycle",
  };

  // Mock new orders (notifications)
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

  // Mock delivered orders (history)
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
  ]);

  // Performance chart data
  const performanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Deliveries",
        data: [12, 15, 18, 14, 20, 22, 8],
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

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
    <div className="space-y-4 md:space-y-6 w-full">
      {/* Header with Profile */}
      <Card className="bg-linear-to-r from-orange-500 to-pink-500 text-white">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white">
                <AvatarImage src={deliveryPerson.avatar} alt={deliveryPerson.name} />
                <AvatarFallback>{deliveryPerson.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{deliveryPerson.name}</h2>
                <div className="flex items-center gap-2 text-sm md:text-base mt-1">
                  <Phone className="w-4 h-4" />
                  {deliveryPerson.phone}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Bike className="w-4 h-4" />
                  <span className="text-sm">{deliveryPerson.vehicleType}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 md:gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-initial text-center bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg md:text-xl font-bold">{deliveryPerson.rating}</span>
                </div>
                <div className="text-xs">Rating</div>
              </div>
              <div className="flex-1 md:flex-initial text-center bg-white/20 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{deliveryPerson.totalDeliveries}</div>
                <div className="text-xs">Total</div>
              </div>
              <div className="flex-1 md:flex-initial text-center bg-white/20 rounded-lg p-3">
                <div className="text-lg md:text-xl font-bold">{deliveryPerson.completedToday}</div>
                <div className="text-xs">Today</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{newOrders.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">New Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{inProgressOrders.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{deliveryPerson.completedToday}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{deliveryPerson.earnings.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-muted-foreground">MMK Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <TrendingUp className="w-5 h-5" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Delivery Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new" className="text-xs md:text-sm">
                New ({newOrders.length})
              </TabsTrigger>
              <TabsTrigger value="inprogress" className="text-xs md:text-sm">
                In Progress ({inProgressOrders.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs md:text-sm">
                History ({deliveredOrders.length})
              </TabsTrigger>
            </TabsList>

            {/* New Orders Tab */}
            <TabsContent value="new" className="space-y-3 md:space-y-4 mt-4">
              {newOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No new orders available
                </div>
              ) : (
                newOrders.map((order) => (
                  <Card key={order.orderId} className="border-2 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm md:text-base">{order.orderId}</span>
                            <Badge className={`${getStatusColor(order.status)} text-xs`}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs md:text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                              <div>
                                <div className="font-medium">Pickup:</div>
                                <div className="text-muted-foreground">{order.pickupAddress}</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              <div>
                                <div className="font-medium">Delivery:</div>
                                <div className="text-muted-foreground">{order.deliveryAddress}</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <span className="text-muted-foreground">
                                <Package className="w-3 h-3 inline mr-1" />
                                {order.distance}
                              </span>
                              <span className="text-muted-foreground">
                                <Clock className="w-3 h-3 inline mr-1" />
                                ~{order.estimatedTime}
                              </span>
                              <span className="font-semibold text-orange-600">
                                {order.totalAmount.toLocaleString()} MMK
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                            className="flex-1 md:flex-initial text-xs md:text-sm"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="gradient-primary flex-1 md:flex-initial text-xs md:text-sm"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* In Progress Tab */}
            <TabsContent value="inprogress" className="space-y-3 md:space-y-4 mt-4">
              {inProgressOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No orders in progress
                </div>
              ) : (
                inProgressOrders.map((order) => (
                  <Card key={order.orderId} className="border-2 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm md:text-base">{order.orderId}</span>
                            <Badge className={`${getStatusColor(order.status)} text-xs`}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs md:text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{order.customerName}</span>
                              <span className="text-muted-foreground">{order.customerPhone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              <div className="text-muted-foreground">{order.deliveryAddress}</div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <span className="text-muted-foreground">
                                <Package className="w-3 h-3 inline mr-1" />
                                {order.distance}
                              </span>
                              <span className="text-muted-foreground">
                                <Clock className="w-3 h-3 inline mr-1" />
                                ~{order.estimatedTime}
                              </span>
                              <span className="font-semibold text-orange-600">
                                {order.totalAmount.toLocaleString()} MMK
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                            className="flex-1 md:flex-initial text-xs md:text-sm"
                          >
                            View
                          </Button>
                          {order.status === "Picked Up" && (
                            <Button
                              size="sm"
                              className="gradient-primary flex-1 md:flex-initial text-xs md:text-sm"
                            >
                              Start Delivery
                            </Button>
                          )}
                          {order.status === "In Transit" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 flex-1 md:flex-initial text-xs md:text-sm"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm">Order ID</TableHead>
                      <TableHead className="text-xs md:text-sm">Customer</TableHead>
                      <TableHead className="text-xs md:text-sm hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-xs md:text-sm">Amount</TableHead>
                      <TableHead className="text-xs md:text-sm">Status</TableHead>
                      <TableHead className="text-right text-xs md:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No delivery history
                        </TableCell>
                      </TableRow>
                    ) : (
                      deliveredOrders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell className="font-medium text-xs md:text-sm">{order.orderId}</TableCell>
                          <TableCell className="text-xs md:text-sm">
                            <div>{order.customerName}</div>
                            <div className="text-muted-foreground md:hidden">{order.orderDate}</div>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm hidden md:table-cell">{order.orderDate}</TableCell>
                          <TableCell className="text-xs md:text-sm font-semibold">
                            {order.totalAmount.toLocaleString()} MMK
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} text-xs`}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              className="text-xs md:text-sm"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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

export default DeliveryDashboardView;

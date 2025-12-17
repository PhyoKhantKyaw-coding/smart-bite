import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderDetailDialog from "./chunks/OrderDetailDialog";

interface OrderItem {
  foodId: string;
  foodName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderDate: string;
  deliveryAddress: string;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  paymentMethod: string;
  items: OrderItem[];
  deliveryPerson?: string;
  storeName: string;
}

const OrderManagementView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Mock data
  const [orders] = useState<Order[]>([
    {
      orderId: "ORD-001",
      customerName: "John Doe",
      customerPhone: "+95 9123456789",
      customerEmail: "john@example.com",
      orderDate: "2025-11-30 10:30 AM",
      deliveryAddress: "123 Main Street, Yangon",
      totalAmount: 25000,
      status: "Pending",
      paymentMethod: "Cash on Delivery",
      storeName: "Downtown Branch",
      items: [
        { foodId: "F001", foodName: "Chicken Burger", quantity: 2, price: 8000 },
        { foodId: "F002", foodName: "French Fries", quantity: 1, price: 3000 },
        { foodId: "F003", foodName: "Coca Cola", quantity: 2, price: 3000 },
      ],
    },
    {
      orderId: "ORD-002",
      customerName: "Jane Smith",
      customerPhone: "+95 9987654321",
      customerEmail: "jane@example.com",
      orderDate: "2025-11-30 09:15 AM",
      deliveryAddress: "456 Oak Avenue, Mandalay",
      totalAmount: 32000,
      status: "Confirmed",
      paymentMethod: "Credit Card",
      storeName: "Mandalay Store",
      deliveryPerson: "U Aung Aung",
      items: [
        { foodId: "F004", foodName: "Pizza Margherita", quantity: 1, price: 18000 },
        { foodId: "F005", foodName: "Caesar Salad", quantity: 1, price: 8000 },
        { foodId: "F006", foodName: "Iced Tea", quantity: 2, price: 3000 },
      ],
    },
    {
      orderId: "ORD-003",
      customerName: "Mike Johnson",
      customerPhone: "+95 9456789123",
      customerEmail: "mike@example.com",
      orderDate: "2025-11-30 08:45 AM",
      deliveryAddress: "789 Pine Road, Naypyidaw",
      totalAmount: 45000,
      status: "Out for Delivery",
      paymentMethod: "E-Wallet",
      storeName: "City Center Store",
      deliveryPerson: "Daw Mya Mya",
      items: [
        { foodId: "F007", foodName: "Sushi Platter", quantity: 1, price: 35000 },
        { foodId: "F008", foodName: "Miso Soup", quantity: 2, price: 5000 },
      ],
    },
    {
      orderId: "ORD-004",
      customerName: "Sarah Williams",
      customerPhone: "+95 9321654987",
      customerEmail: "sarah@example.com",
      orderDate: "2025-11-29 07:20 PM",
      deliveryAddress: "321 Elm Street, Yangon",
      totalAmount: 28000,
      status: "Delivered",
      paymentMethod: "Cash on Delivery",
      storeName: "Downtown Branch",
      deliveryPerson: "Ko Zaw Zaw",
      items: [
        { foodId: "F009", foodName: "Beef Steak", quantity: 1, price: 22000 },
        { foodId: "F010", foodName: "Mineral Water", quantity: 2, price: 3000 },
      ],
    },
    {
      orderId: "ORD-005",
      customerName: "David Brown",
      customerPhone: "+95 9789456123",
      customerEmail: "david@example.com",
      orderDate: "2025-11-29 06:00 PM",
      deliveryAddress: "654 Maple Drive, Mandalay",
      totalAmount: 15000,
      status: "Cancelled",
      paymentMethod: "Credit Card",
      storeName: "Mandalay Store",
      items: [
        { foodId: "F011", foodName: "Pasta Carbonara", quantity: 1, price: 12000 },
        { foodId: "F012", foodName: "Garlic Bread", quantity: 1, price: 3000 },
      ],
    },
    {
      orderId: "ORD-006",
      customerName: "Emily Davis",
      customerPhone: "+95 9147258369",
      customerEmail: "emily@example.com",
      orderDate: "2025-11-30 11:00 AM",
      deliveryAddress: "987 Cedar Lane, Yangon",
      totalAmount: 38000,
      status: "Preparing",
      paymentMethod: "E-Wallet",
      storeName: "Downtown Branch",
      items: [
        { foodId: "F013", foodName: "Tom Yum Soup", quantity: 2, price: 8000 },
        { foodId: "F014", foodName: "Pad Thai", quantity: 2, price: 11000 },
      ],
    },
  ]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Confirmed":
        return "bg-blue-500";
      case "Preparing":
        return "bg-purple-500";
      case "Out for Delivery":
        return "bg-orange-500";
      case "Delivered":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "Preparing":
        return <Package className="w-4 h-4" />;
      case "Out for Delivery":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailDialog(true);
  };

  const statusCounts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "Pending").length,
    Confirmed: orders.filter((o) => o.status === "Confirmed").length,
    Preparing: orders.filter((o) => o.status === "Preparing").length,
    "Out for Delivery": orders.filter((o) => o.status === "Out for Delivery").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
              Order Management
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Track and manage customer orders
            </p>
          </div>
        </div>

        {/* Status Filter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Card
              key={status}
              className={`cursor-pointer transition-all ${
                statusFilter === status ? "ring-2 ring-orange-500 shadow-lg" : ""
              }`}
              onClick={() => setStatusFilter(status)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-muted-foreground mt-1">{status}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-xl sm:text-2xl">
                Orders ({filteredOrders.length})
              </CardTitle>
              <div className="relative flex-1 sm:flex-initial w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-96"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-medium">{order.orderId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.customerPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{order.storeName}</TableCell>
                        <TableCell className="text-sm">{order.orderDate}</TableCell>
                        <TableCell className="font-semibold">
                          {order.totalAmount.toLocaleString()} MMK
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{order.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        {selectedOrder && (
          <OrderDetailDialog
            open={showDetailDialog}
            onOpenChange={setShowDetailDialog}
            order={selectedOrder}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagementView;

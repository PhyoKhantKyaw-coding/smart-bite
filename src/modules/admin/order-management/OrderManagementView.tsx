import { useState, useEffect, useRef } from "react";
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
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import OrderDetailDialog from "./chunks/OrderDetailDialog";
import { getAllOrders } from "@/api/order";
import { GetOrderDTO } from "@/api/order/types";

const OrderManagementView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<GetOrderDTO | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [orders, setOrders] = useState<GetOrderDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  const hasFetched = useRef(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders(1, pageSize);
      console.log("Order API Response:", response);
      
      // Backend returns status: 0 for success, not "Successful"
      if (response.status === 0 && response.data?.data) {
        setOrders(response.data.data);
        console.log("Orders loaded:", response.data.data.length);
      } else {
        toast.error(response.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchOrders();
    }
  }, []);

  const getStatusColor = (status?: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "cooking":
      case "preparing":
        return "bg-purple-500";
      case "delivery":
      case "delivering":
      case "out for delivery":
        return "bg-orange-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status?: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "cooking":
      case "preparing":
        return <Package className="w-4 h-4" />;
      case "delivery":
      case "delivering":
      case "out for delivery":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: GetOrderDTO) => {
    setSelectedOrder(order);
    setShowDetailDialog(true);
  };

  const statusCounts = {
    All: orders.length,
    Cooking: orders.filter((o) => o.status?.toLowerCase() === "cooking").length,
    Delivery: orders.filter((o) => o.status?.toLowerCase() === "delivery").length,
    Delivering: orders.filter((o) => o.status?.toLowerCase() === "delivering").length,
    Delivered: orders.filter((o) => o.status?.toLowerCase() === "delivered").length,
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <span className="ml-2 text-muted-foreground">Loading orders...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Town</TableHead>
                      <TableHead>Delivery Person</TableHead>
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
                            <div className="font-medium">{order.userName || "N/A"}</div>
                          </TableCell>
                          <TableCell>{order.storeName || "N/A"}</TableCell>
                          <TableCell>{order.townName || "N/A"}</TableCell>
                          <TableCell>{order.deliveryName || "Not Assigned"}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{order.paymentType || "N/A"}</TableCell>
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
            )}
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

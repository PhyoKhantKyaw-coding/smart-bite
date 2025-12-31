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
import { DeliveredOrder } from "@/types/delivery";

interface DeliveredOrdersProps {
  orders: DeliveredOrder[];
  loading: boolean;
}

const DeliveredOrders = ({ orders, loading }: DeliveredOrdersProps) => {
  const [selectedOrder, setSelectedOrder] = useState<DeliveredOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  console.log("DeliveredOrders - Received orders:", orders);
  console.log("DeliveredOrders - Orders length:", orders.length);

  const getStatusColor = (status: DeliveredOrder["status"]) => {
    switch (status) {
      case "Delivered":
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewOrder = (order: DeliveredOrder) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          Delivered Orders ({orders.length})
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
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No delivery history
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order.id || `delivered-order-${index}`}>
                    <TableCell className="font-medium">{order.orderNumber || order.id || 'N/A'}</TableCell>
                    <TableCell>
                      <div>{order.customerName || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">{order.customerPhone || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="text-sm">{order.orderDate || 'N/A'}</TableCell>
                    <TableCell className="text-sm">{order.distance || 'N/A'}</TableCell>
                    <TableCell className="font-semibold">
                      {order.totalAmount?.toLocaleString() || '0'} MMK
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {order.status || 'N/A'}
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
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No delivery history
            </CardContent>
          </Card>
        ) : (
          orders.map((order, index) => (
            <Card key={order.id || `delivered-mobile-${index}`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex-wrap justify-between">
                    <div>
                      <h3 className="font-semibold">{order.orderNumber || order.id || 'N/A'}</h3>
                      <p className="text-sm text-muted-foreground">{order.customerName || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">{order.customerPhone || 'N/A'}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)}`}>
                      {order.status || 'N/A'}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{order.orderDate || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span>{order.distance || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">{order.totalAmount?.toLocaleString() || '0'} MMK</span>
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

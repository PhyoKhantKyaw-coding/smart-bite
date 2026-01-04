import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Package, Phone, User, CheckCircle, XCircle, Navigation } from "lucide-react";
import OrderTrackingMapDialog from "@/components/OrderTrackingMapDialog";
import { DeliveryOrder } from "@/types/delivery";
import { updateOrderStatus } from "@/api/delivery";
import { toast } from "sonner";

interface OrdersForDeliveryProps {
  orders: DeliveryOrder[];
  loading: boolean;
  onRefresh?: () => void;
}

const OrdersForDelivery = ({ orders = [], loading, onRefresh }: OrdersForDeliveryProps) => {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const [localOrders, setLocalOrders] = useState<DeliveryOrder[]>(orders);

  // Sync local orders with props
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  console.log("OrdersForDelivery - Received orders:", orders);
  console.log("OrdersForDelivery - Orders length:", orders.length);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    try {
      console.log("Updating order status:", { orderId, newStatus });
      const response = await updateOrderStatus(orderId, newStatus);
      console.log("Update status response:", response);
      
      // Check for success - API might return status: 1 or status: 0 for success
      if (response.status === 1 || response.status === 0) {
        toast.success(response.message || "Order status updated successfully");
        
        // Refresh data from parent to get latest from server
        if (onRefresh) {
          console.log("Calling onRefresh to fetch latest data...");
          await onRefresh();
          console.log("onRefresh completed");
        } else {
          console.warn("onRefresh is not provided");
        }
      } else {
        toast.error(response.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Filter orders by status - cast to DeliveryOrder type
  // Orders with "Delivery" status should show as new orders
  const newOrders = localOrders.filter((order) => {
    const status = order.status;
    console.log("Checking order status:", status);
    return status === "Delivery" || status === "New";
  });
  
  const inProgressOrders = localOrders.filter((order) => {
    const status = order.status;
    return status === "delivering";
  });

  const getStatusColor = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "New":
      case "Delivery":
        return "bg-blue-500";
      case "delivering":
        return "bg-orange-500";
      case "Picked Up":
        return "bg-purple-500";
      case "In Transit":
        return "bg-orange-500";
      case "Delivered":
      case "delivered":
        return "bg-green-500";
      case "cancel":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewOrder = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setShowTrackingDialog(true);
  };

  // Use API data directly
  const displayNewOrders = newOrders;
  const displayInProgressOrders = inProgressOrders;

  console.log("Display New Orders:", displayNewOrders.length);
  console.log("Display In Progress Orders:", displayInProgressOrders.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Orders Section */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6" />
          New Orders ({displayNewOrders.length})
        </h2>
        {displayNewOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No new orders available
            </CardContent>
          </Card>
        ) : (
          <div className=" flex flex-wrap" style={{ maxWidth: '50%' }}>
            {displayNewOrders.map((order, index) => (
              <Card key={order.id || `new-order-${index}`} className="border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{order.orderNumber || order.id || 'N/A'}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="w-4 h-4" />
                          {order.customerName || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {order.customerPhone || 'N/A'}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} w-fit`}>
                        {order.status || 'N/A'}
                      </Badge>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-1" />
                        <div className="text-sm">
                          <div className="font-medium">Pickup</div>
                          <div className="text-muted-foreground">{order.pickupAddress || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                        <div className="text-sm">
                          <div className="font-medium">Delivery</div>
                          <div className="text-muted-foreground">{order.deliveryAddress || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{order.distance || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>~{order.estimatedTime || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{order.totalAmount?.toLocaleString() || '0'} MMK</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="flex-1 sm:flex-initial"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Track Order
                      </Button>
                     <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1 sm:flex-initial"
                            onClick={() => handleUpdateStatus(order.id, "cancel")}
                            disabled={updatingOrders.has(order.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            {updatingOrders.has(order.id) ? "Updating..." : "Cancel"}
                          </Button>
                      <Button
                        size="sm"
                        className="gradient-primary flex-1 sm:flex-initial"
                        onClick={() => handleUpdateStatus(order.id, "delivering")}
                        disabled={updatingOrders.has(order.id)}
                      >
                            <CheckCircle className="w-4 h-4 mr-2" />
                        {updatingOrders.has(order.id) ? "Updating..." : "Accept Order"}
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
          In Progress ({displayInProgressOrders.length})
        </h2>
        {displayInProgressOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No orders in progress
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4" style={{ maxWidth: '50%' }}>
            {displayInProgressOrders.map((order, index) => (
              <Card key={order.id || `progress-order-${index}`} className="border-2 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{order.orderNumber || order.id || 'N/A'}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="w-4 h-4" />
                          {order.customerName || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {order.customerPhone || 'N/A'}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} w-fit`}>
                        {order.status || 'N/A'}
                      </Badge>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-1" />
                        <div className="text-sm">
                          <div className="font-medium">Pickup</div>
                          <div className="text-muted-foreground">{order.pickupAddress || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                        <div className="text-sm">
                          <div className="font-medium">Delivery</div>
                          <div className="text-muted-foreground">{order.deliveryAddress || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{order.distance || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>~{order.estimatedTime || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{order.totalAmount?.toLocaleString() || '0'} MMK</span>
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
                        <Navigation className="w-4 h-4 mr-2" />
                        Track Order
                      </Button>
                      {order.status === "delivering" ? (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1 sm:flex-initial"
                            onClick={() => handleUpdateStatus(order.id, "cancel")}
                            disabled={updatingOrders.has(order.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            {updatingOrders.has(order.id) ? "Updating..." : "Cancel"}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial"
                            onClick={() => handleUpdateStatus(order.id, "delivered")}
                            disabled={updatingOrders.has(order.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {updatingOrders.has(order.id) ? "Updating..." : "User Accept"}
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Tracking Map Dialog */}
      {selectedOrder && (
        <OrderTrackingMapDialog
          open={showTrackingDialog}
          onOpenChange={setShowTrackingDialog}
          orderId={selectedOrder.id}
          orderNumber={selectedOrder.orderNumber}
          storeLatitude={selectedOrder.storeLatitude || 16.8661}
          storeLongitude={selectedOrder.storeLongitude || 96.1951}
          pickupAddress={selectedOrder.pickupAddress}
          orderLatitude={selectedOrder.orderLatitude || 16.8661}
          orderLongitude={selectedOrder.orderLongitude || 96.1951}
          deliveryAddress={selectedOrder.deliveryAddress}
          deliveryLatitude={selectedOrder.deliveryLatitude}
          deliveryLongitude={selectedOrder.deliveryLongitude}
          deliveryId={selectedOrder.assignedDriver}
          deliveryName={selectedOrder.assignedDriver || "Delivery Person"}
          deliveryPhone={selectedOrder.customerPhone}
          status={selectedOrder.status}
        />
      )}
    </div>
  );
};

export default OrdersForDelivery;

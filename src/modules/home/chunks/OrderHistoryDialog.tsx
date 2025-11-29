import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  History,
  Package,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Store,
  Bike,
  CreditCard,
  Clock,
  RefreshCw,
} from "lucide-react";
import TrackingMapDialog from "./TrackingMapDialog";
import { Map } from "lucide-react";
import { getFoodImageUrl } from "@/lib/imageUtils";

interface OrderHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: VoucherDTO[];
  onReorder?: (orderId: string) => void;
  onRefresh?: () => void;
}

const OrderHistoryDialog: React.FC<OrderHistoryDialogProps> = ({
  open,
  orders,
  onReorder,
  onRefresh,
}) => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 10 seconds when dialog is open
  useEffect(() => {
    if (open && onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, 10000); // 10 seconds
      return () => clearInterval(interval);
    }
  }, [open, onRefresh]);

  const handleManualRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "delivering":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const toggleExpand = (orderId: string | undefined) => {
    if (!orderId) return;
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const statusOptions = ["All", "Pending", "Preparing", "Delivering", "Delivered", "Cancelled"];

  if (!open) return null;

  return (
    <>
      <div className="relative w-[80%] mx-auto overflow-hidden text-yellow-900 border-4 border-yellow-400 shadow-lg rounded-[48px] flex flex-col" style={{ background: 'linear-gradient(120deg, #fffbe6 0%, #fbbf24 100%)', minHeight: '500px', maxHeight: '600px' }}>
        <div className="container max-w-5xl mx-auto flex-1 overflow-y-auto scrollbar-hide py-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-400 to-blue-500 shadow-lg mb-4">
              <History className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Order History
              </h1>
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="h-10 w-10 hover:bg-white/50 rounded-full"
                >
                  <RefreshCw className={`w-5 h-5 text-purple-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </div>
            <p className="text-sm sm:text-base text-yellow-800 opacity-80">
              Track your orders and reorder your favorites {onRefresh && '• Auto-updates every 10s'}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={`text-xs sm:text-sm ${filterStatus === status ? "gradient-primary" : ""}`}
                >
                  {status}
                </Button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-purple-100 to-blue-200 mb-6">
                    <Package className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">No orders found</h3>
                  <p className="text-gray-500 text-lg">
                    {filterStatus === "All"
                      ? "You haven't placed any orders yet"
                      : `No ${filterStatus.toLowerCase()} orders`}
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <Card
                    key={order.orderId}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-yellow-300 bg-white/95 backdrop-blur-sm hover:scale-[1.01]"
                  >
                    <div className="bg-linear-to-r from-orange-50 to-pink-50 p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                          <div className="p-2 bg-white rounded-lg">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Order ID</p>
                            <p className="font-mono font-semibold text-xs sm:text-sm">
                              #{order.orderId?.slice(0, 8) || 'N/A'}
                            </p>
                          </div>
                          <Separator orientation="vertical" className="h-10 sm:h-12 hidden sm:block" />
                          <div className="hidden sm:block">
                            <p className="text-xs text-muted-foreground">Order Date</p>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <p className="font-semibold text-xs sm:text-sm">
                                {formatDate(order.orderDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <Badge
                            className={`${getStatusColor(order.status)} text-white px-2 sm:px-3 py-1 text-xs`}
                          >
                            {order.status || 'Unknown'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleExpand(order.orderId)}
                            className="h-8 w-8"
                          >
                            {expandedOrders.has(order.orderId || '') ? (
                              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {/* Order date for mobile */}
                      <div className="sm:hidden mt-2 pt-2 border-t border-white/50">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <p className="font-semibold text-xs">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3 sm:p-4">
                      {/* Summary Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Town:</span>
                          <span className="font-medium truncate">{order.townName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Store className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Store:</span>
                          <span className="font-medium truncate">{order.storeName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bike className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Delivery:</span>
                          <span className="font-medium truncate">{order.deliveryName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Payment:</span>
                          <span className="font-medium truncate">{order.paymentType}</span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedOrders.has(order.orderId || '') && (
                        <>
                          <Separator className="my-3" />
                          <div className="space-y-2">
                            <h4 className="font-semibold text-xs sm:text-sm">Order Items</h4>
                            {order.cartDTOs?.map((item, index) => (
                              <div
                                key={index}
                                className="flex gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg"
                              >
                                <img
                                  src={getFoodImageUrl(item.foodImage)}
                                  alt={item.name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shrink-0"
                                />
                                <div className="flex-1 text-xs min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="font-semibold truncate">{item.name}</p>
                                      <Badge variant="outline" className="text-xs mt-1">
                                        {item.catName}
                                      </Badge>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="font-semibold text-primary whitespace-nowrap">
                                        {item.eachPrice?.toLocaleString() || 0} MMK
                                      </p>
                                      <p className="text-muted-foreground">x {item.quantity}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.estimatedDeliveryTime && (
                            <div className="flex items-center gap-2 text-xs sm:text-sm mt-3">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Est. Delivery:</span>
                              <span className="font-medium">
                                {order.estimatedDeliveryTime} min
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      <Separator className="my-3" />

                      {/* Footer - Show total and track button */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-lg sm:text-xl font-bold text-primary">
                            {order.totalPrice?.toLocaleString() || 0} MMK
                          </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          {(order.status?.toLowerCase() === "pending" || 
                            order.status?.toLowerCase() === "preparing" || 
                            order.status?.toLowerCase() === "cooking" || 
                            order.status?.toLowerCase() === "delivering") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => order.orderId && setTrackingOrderId(order.orderId)}
                            >
                              <Map className="w-4 h-4 mr-2" />
                              Track Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
            </div>
          </div>
        </div>

        {/* Fixed Footer with Reorder */}
        {filteredOrders.length > 0 && filteredOrders[0] && (
          <div className="border-t border-yellow-400 bg-linear-to-r from-yellow-50 to-yellow-100 p-4">
            <div className="container max-w-5xl mx-auto">
              <Button
                className="w-full gradient-primary text-base py-5"
                size="lg"
                onClick={() => {
                  const latestOrder = filteredOrders[0];
                  if (latestOrder.orderId) {
                    onReorder?.(latestOrder.orderId);
                  }
                }}
              >
                <Package className="w-5 h-5 mr-2" />
                Reorder Latest
              </Button>
            </div>
          </div>
        )}
      </div>

      {trackingOrderId && (
        <TrackingMapDialog
          open={!!trackingOrderId}
          onOpenChange={(open) => !open && setTrackingOrderId(null)}
          orderId={trackingOrderId}
        />
      )}
    </>
  );
};

export default OrderHistoryDialog;

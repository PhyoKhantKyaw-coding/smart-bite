import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  MapPin,
  CreditCard,
  Store,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { GetOrderDTO, VoucherDTO, OrderRouteDTO } from "@/api/order/types";
import { getVoucherByOrderId, getOrderRouteByOrderId, updateOrderStatus } from "@/api/order";
import ClickableMap from "@/components/ClickableMap";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: GetOrderDTO;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onOpenChange,
  order,
}) => {
  const [voucher, setVoucher] = useState<VoucherDTO | null>(null);
  const [orderRoute, setOrderRoute] = useState<OrderRouteDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetails = async () => {
    if (!order.orderId) return;
    
    setLoading(true);
    try {
      const [voucherResponse, routeResponse] = await Promise.all([
        getVoucherByOrderId(order.orderId),
        getOrderRouteByOrderId(order.orderId)
      ]);

      // Backend returns status: 0 for success
      if (voucherResponse.status === 0) {
        setVoucher(voucherResponse.data);
      }

      if (routeResponse.status === 0) {
        setOrderRoute(routeResponse.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && order.orderId) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, order.orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order.orderId) return;
    
    setUpdating(true);
    try {
      const response = await updateOrderStatus(order.orderId, newStatus);
      // Backend returns status: 0 for success
      if (response.status === 0) {
        toast.success(`Order status updated to ${newStatus}`);
        onOpenChange(false);
        window.location.reload(); // Refresh to see updated data
      } else {
        toast.error(response.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const openInGoogleMaps = () => {
    if (orderRoute?.storeLatitude && orderRoute?.storeLongitude && 
        orderRoute?.orderLatitude && orderRoute?.orderLongitude) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${orderRoute.storeLatitude},${orderRoute.storeLongitude}&destination=${orderRoute.orderLatitude},${orderRoute.orderLongitude}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90%] md:w-[85%] lg:w-[70%] max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Order Details</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Order ID: {order.orderId}
              </DialogDescription>
            </div>
            <Badge className={`${getStatusColor(order.status)} flex items-center gap-2`}>
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-muted-foreground">Loading order details...</span>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Basic Order Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Customer</div>
                    <div className="font-medium">{order.userName || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Store</div>
                    <div className="font-medium">{order.storeName || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Town</div>
                    <div className="font-medium">{order.townName || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Delivery Person</div>
                    <div className="font-medium">{order.deliveryName || "Not Assigned"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Payment Method</div>
                    <div className="font-medium">{order.paymentType || "N/A"}</div>
                  </div>
                </div>
                {order.orderDescription && (
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <Package className="w-4 h-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Order Description</div>
                      <div className="font-medium">{order.orderDescription}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Route Map */}
            {orderRoute && orderRoute.storeLatitude && orderRoute.storeLongitude && 
             orderRoute.orderLatitude && orderRoute.orderLongitude && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Delivery Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">Start: Store Location</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Lat: {orderRoute.storeLatitude}, Lng: {orderRoute.storeLongitude}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span className="font-semibold text-orange-600">End: Delivery Location</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Lat: {orderRoute.orderLatitude}, Lng: {orderRoute.orderLongitude}
                      </div>
                      {orderRoute.orderingPlace && (
                        <div className="text-sm font-medium mt-1">{orderRoute.orderingPlace}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Interactive Map with Route */}
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden border-2 border-orange-200 dark:border-orange-800 shadow-lg">
                    <ClickableMap
                      latitude={orderRoute.storeLatitude}
                      longitude={orderRoute.storeLongitude}
                      clickable={false}
                      showStoreToDestinationRoute={true}
                      showRoute={true}
                      routeColor="#f97316"
                      destinationPosition={{
                        lat: orderRoute.orderLatitude,
                        lng: orderRoute.orderLongitude,
                      }}
                      storeName={order.storeName || "Store"}
                      destinationName={orderRoute.orderingPlace || "Delivery Location"}
                    />
                  </div>

                  <Button 
                    onClick={openInGoogleMaps}
                    className="w-full"
                    variant="outline"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Open in Google Maps
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Voucher Details */}
            {voucher && (
              <>
                {/* Order Items */}
                {voucher.cartDTOs && voucher.cartDTOs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Order Items</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/30">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium">Item</th>
                            <th className="text-center p-3 text-sm font-medium">Quantity</th>
                            <th className="text-right p-3 text-sm font-medium">Price</th>
                            <th className="text-right p-3 text-sm font-medium">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {voucher.cartDTOs.map((item, index) => (
                            <tr key={index} className={index !== voucher.cartDTOs!.length - 1 ? "border-b" : ""}>
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  {item.foodImage && (
                                    <img 
                                      src={item.foodImage} 
                                      alt={item.name || "Food"} 
                                      className="w-12 h-12 rounded object-cover"
                                    />
                                  )}
                                  <div>
                                    <div className="font-medium">{item.name || "N/A"}</div>
                                    {item.catName && (
                                      <div className="text-xs text-muted-foreground">{item.catName}</div>
                                    )}
                                    {item.foodDescription && (
                                      <div className="text-xs text-muted-foreground line-clamp-1">
                                        {item.foodDescription}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center">{item.quantity || 0}</td>
                              <td className="p-3 text-right">{(item.eachPrice || 0).toLocaleString()} MMK</td>
                              <td className="p-3 text-right font-medium">
                                {((item.quantity || 0) * (item.eachPrice || 0)).toLocaleString()} MMK
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Financial Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Summary</h3>
                  <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Price:</span>
                      <span className="font-semibold">{(voucher.totalPrice || 0).toLocaleString()} MMK</span>
                    </div>
                    {voucher.totalCost !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Cost:</span>
                        <span className="font-semibold">{(voucher.totalCost || 0).toLocaleString()} MMK</span>
                      </div>
                    )}
                    {voucher.totalProfit !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Profit:</span>
                        <span className="font-semibold text-green-600">
                          {(voucher.totalProfit || 0).toLocaleString()} MMK
                        </span>
                      </div>
                    )}
                    {voucher.estimatedDeliveryTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Delivery Time:</span>
                        <span className="font-semibold">{voucher.estimatedDeliveryTime} mins</span>
                      </div>
                    )}
                    {voucher.deliveryStarted && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Started:</span>
                        <span className="font-semibold">{formatDateTime(voucher.deliveryStarted)}</span>
                      </div>
                    )}
                    {voucher.deliveredTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivered At:</span>
                        <span className="font-semibold">{formatDateTime(voucher.deliveredTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total */}
                <Separator />
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {(voucher.totalPrice || 0).toLocaleString()} MMK
                  </span>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {order.status?.toLowerCase() === "cooking" && (
                <Button 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleStatusUpdate("delivery")}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Truck className="w-4 h-4 mr-2" />}
                  Ready for Delivery
                </Button>
              )}
              {order.status?.toLowerCase() === "delivery" && (
                <Button 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleStatusUpdate("delivering")}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Truck className="w-4 h-4 mr-2" />}
                  Out for Delivery
                </Button>
              )}
              {order.status?.toLowerCase() === "delivering" && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate("delivered")}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;

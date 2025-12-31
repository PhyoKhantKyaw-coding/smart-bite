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
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { DeliveryOrder } from "@/types/delivery";
import ClickableMap from "@/components/ClickableMap";
import { useState, useEffect } from "react";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: DeliveryOrder;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onOpenChange,
  order,
}) => {
  const [currentDeliveryPosition, setCurrentDeliveryPosition] = useState({
    lat: order.deliveryLatitude || 0,
    lng: order.deliveryLongitude || 0,
  });

  // Check if order is in active delivery status
  const isActiveDelivery = 
    order.status === "Delivery" || 
    order.status === "delivering" ||
    order.status === "In Transit" ||
    order.status === "Picked Up";

  // Real-time location update for active deliveries
  useEffect(() => {
    if (!isActiveDelivery || !open) return;

    // Simulate real-time updates every 5 seconds
    // In production, replace this with actual API calls or WebSocket
    const intervalId = setInterval(() => {
      // TODO: Replace with actual API call to get delivery person's current location
      // Example: fetchDeliveryLocation(order.id).then(pos => setCurrentDeliveryPosition(pos))
      
      // Simulated position update - replace with actual API call
      setCurrentDeliveryPosition(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
      console.log("Fetching real-time delivery location for order:", order.id);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isActiveDelivery, open, order.id]);

  const getStatusColor = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-500";
      case "Picked Up":
        return "bg-purple-500";
      case "In Transit":
        return "bg-orange-500";
      case "Delivered":
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "New":
        return <Package className="w-4 h-4" />;
      case "Picked Up":
        return <CheckCircle className="w-4 h-4" />;
      case "In Transit":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90%] md:w-[70%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl md:text-2xl">Order Details</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Order ID: {order.orderNumber || order.id}
              </DialogDescription>
            </div>
            <Badge className={`${getStatusColor(order.status)} flex items-center gap-2`}>
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6 mt-4">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Name</div>
                  <div className="font-medium">{order.customerName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="font-medium">{order.customerPhone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Information
            </h3>
            
            {/* Delivery Route Map - Always show map, but hide delivery location for delivered orders */}
            <div className="w-full rounded-lg overflow-hidden border" style={{ height: '200px' }}>
              <ClickableMap
                latitude={order.storeLatitude || 16.8661}
                longitude={order.storeLongitude || 96.1951}
                clickable={false}
                showStoreToDestinationRoute={true}
                showRoute={isActiveDelivery && !!currentDeliveryPosition.lat && !!currentDeliveryPosition.lng}
                routeColor="#3b82f6"
                deliveryPosition={
                  isActiveDelivery && currentDeliveryPosition.lat && currentDeliveryPosition.lng
                    ? { lat: currentDeliveryPosition.lat, lng: currentDeliveryPosition.lng }
                    : undefined
                }
                destinationPosition={
                  order.orderLatitude && order.orderLongitude
                    ? { lat: order.orderLatitude, lng: order.orderLongitude }
                    : undefined
                }
                storeName={order.pickupAddress || "Pickup Location"}
                deliveryManName={order.assignedDriver || "Delivery Person"}
                destinationName={order.deliveryAddress || "Delivery Location"}
              />
            </div>
            
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Pickup Address</div>
                  <div className="font-medium text-sm">{order.pickupAddress}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                <div>
                  <div className="text-xs text-muted-foreground">Delivery Address</div>
                  <div className="font-medium text-sm">{order.deliveryAddress}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>{order.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>~{order.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{order.orderDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base md:text-lg">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-3 font-medium">Item</th>
                    <th className="text-center p-3 font-medium">Qty</th>
                    <th className="text-right p-3 font-medium">Price</th>
                    <th className="text-right p-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className={index !== order.items.length - 1 ? "border-b" : ""}>
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{item.price.toLocaleString()} MMK</td>
                      <td className="p-3 text-right font-medium">
                        {(item.quantity * item.price).toLocaleString()} MMK
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="space-y-2">
            <Separator />
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <span className="text-base md:text-lg font-semibold">Total Amount</span>
              <span className="text-xl md:text-2xl font-bold text-orange-600">
                {order.totalAmount.toLocaleString()} MMK
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Close
            </Button>
            {(order.status === "New" || order.status === "Delivery") && (
              <Button className="gradient-primary w-full sm:w-auto">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Order
              </Button>
            )}
            {order.status === "delivering" && (
              <>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  User Accept
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;

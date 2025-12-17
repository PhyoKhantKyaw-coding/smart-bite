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
} from "lucide-react";

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
                Order ID: {order.orderId}
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
                      <td className="p-3 font-medium">{item.foodName}</td>
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
            {order.status === "New" && (
              <Button className="gradient-primary w-full sm:w-auto">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Order
              </Button>
            )}
            {order.status === "Picked Up" && (
              <Button className="gradient-primary w-full sm:w-auto">
                <Truck className="w-4 h-4 mr-2" />
                Start Delivery
              </Button>
            )}
            {order.status === "In Transit" && (
              <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Delivered
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;

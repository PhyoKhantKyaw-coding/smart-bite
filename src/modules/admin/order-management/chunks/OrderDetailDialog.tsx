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
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Store,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

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

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onOpenChange,
  order,
}) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90%] md:w-[85%] lg:w-[70%] max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <div className="space-y-6 mt-4">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
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
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="font-medium">{order.customerEmail}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Delivery Address</div>
                  <div className="font-medium">{order.deliveryAddress}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Order Date</div>
                  <div className="font-medium">{order.orderDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Store</div>
                  <div className="font-medium">{order.storeName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Payment Method</div>
                  <div className="font-medium">{order.paymentMethod}</div>
                </div>
              </div>
              {order.deliveryPerson && (
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Delivery Person</div>
                    <div className="font-medium">{order.deliveryPerson}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
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
                  {order.items.map((item, index) => (
                    <tr key={item.foodId} className={index !== order.items.length - 1 ? "border-b" : ""}>
                      <td className="p-3">
                        <div className="font-medium">{item.foodName}</div>
                        <div className="text-xs text-muted-foreground">ID: {item.foodId}</div>
                      </td>
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
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-orange-600">
                {order.totalAmount.toLocaleString()} MMK
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {order.status === "Pending" && (
              <>
                <Button variant="destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
                <Button className="gradient-primary">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Order
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

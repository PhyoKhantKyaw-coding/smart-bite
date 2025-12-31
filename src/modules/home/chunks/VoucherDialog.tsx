import { X, Calendar, User, Phone, MapPin, CreditCard, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VoucherItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface VoucherData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: VoucherItem[];
  totalAmount: number;
  paymentMethod: string;
  orderDate: string;
  status: string;
  deliveryTime?: string | null;
  assignedDriver?: string;
  notes?: string;
}

interface VoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucherData: VoucherData | null;
}

const VoucherDialog: React.FC<VoucherDialogProps> = ({ open, onOpenChange, voucherData }) => {
  if (!open || !voucherData) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "cooking":
        return "bg-yellow-500";
      case "delivery":
        return "bg-blue-500";
      case "delivering":
        return "bg-purple-500";
      case "deliveried":
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-amber-500 p-6 text-white relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Order Voucher</h2>
              <p className="text-white/90 text-sm">#{voucherData.orderNumber}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Status Badge */}
          <div className="flex justify-between items-center mb-6">
            <Badge className={`${getStatusColor(voucherData.status)} text-white px-4 py-2 text-sm`}>
              {voucherData.status}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {formatDate(voucherData.orderDate)}
            </div>
          </div>

          {/* Customer Information */}
          <Card className="p-4 mb-6 bg-linear-to-br from-orange-50 to-amber-50 border-orange-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              Customer Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Name</p>
                  <p className="font-medium text-gray-800">{voucherData.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="font-medium text-gray-800">{voucherData.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Delivery Address</p>
                  <p className="font-medium text-gray-800">{voucherData.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            <div className="space-y-3">
              {voucherData.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">${(item.price / item.quantity).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment & Total */}
          <Card className="p-4 bg-linear-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Payment Method</span>
                </div>
                <span className="font-semibold text-gray-800">{voucherData.paymentMethod}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  ${voucherData.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          {(voucherData.assignedDriver || voucherData.notes || voucherData.deliveryTime) && (
            <Card className="p-4 mt-6 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">Additional Information</h3>
              <div className="space-y-2 text-sm">
                {voucherData.assignedDriver && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned Driver:</span>
                    <span className="font-medium text-gray-800">{voucherData.assignedDriver}</span>
                  </div>
                )}
                {voucherData.deliveryTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Time:</span>
                    <span className="font-medium text-gray-800">{formatDate(voucherData.deliveryTime)}</span>
                  </div>
                )}
                {voucherData.notes && (
                  <div>
                    <span className="text-gray-600">Notes:</span>
                    <p className="font-medium text-gray-800 mt-1">{voucherData.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Thank you for your order!</p>
            <p className="mt-1">For any inquiries, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherDialog;

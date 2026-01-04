import { useState, useEffect } from "react";
import { X, MapPin, FileText, Calendar, User, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getOrdersByStatus, getVoucher } from "@/api/delivery";
import OrderTrackingMapDialog from "@/components/OrderTrackingMapDialog";
import VoucherDialog from "./VoucherDialog";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  orderDate: string;
  status: string;
  deliveryTime: string | null;
  assignedDriver: string;
  notes: string;
  storeLatitude: number;
  storeLongitude: number;
  orderLatitude: number;
  orderLongitude: number;
  deliveryLatitude: number;
  deliveryLongitude: number;
}

interface OrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrdersDialog: React.FC<OrdersDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [voucherData, setVoucherData] = useState<Order | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);

  const tabs = ["All", "Cooking", "Delivery", "Delivering", "Deliveried"];

  useEffect(() => {
    if (open) {
      fetchOrders(activeTab);
    }
  }, [open, activeTab]);

  const fetchOrders = async (status: string) => {
    setLoading(true);
    try {
      const response = await getOrdersByStatus(status);
      if (response.status === 0 && response.data) {
        setOrders(response.data as Order[]);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetail = async (order: Order) => {
    try {
      const response = await getVoucher(order.id);
      if (response.status === 0 && response.data) {
        // Use the order data directly since it has all the information
        setVoucherData(order);
        setShowVoucher(true);
        toast.success("Voucher loaded successfully!");
      } else {
        toast.error("Failed to retrieve voucher");
      }
    } catch (error) {
      console.error("Error fetching voucher:", error);
      toast.error("Failed to retrieve voucher");
    }
  };

  const handleTrackOrder = (order: Order) => {
    setTrackingOrder(order);
    setShowTrackingDialog(true);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onMouseDown={() => onOpenChange(false)}
      >
        <div
          className="relative w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-200 flex flex-col max-h-[90vh]"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-orange-50/50 via-white to-amber-50/50 rounded-3xl pointer-events-none"></div>

          {/* Content */}
          <div className="relative flex-1 overflow-hidden flex flex-col">
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Header */}
            <div className="p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                My Orders
              </h2>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab} value={tab} className="mt-0">
                    <div className="max-h-[calc(90vh-280px)] overflow-y-auto pr-2">
                      {loading ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Loading orders...</p>
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No orders found</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {orders.map((order) => (
                            <Card
                              key={order.id}
                              className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500"
                            >
                              {/* Subtle background gradient */}
                              <div className="absolute inset-0 bg-linear-to-br from-orange-50/30 to-amber-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              
                              <div className="relative p-5">
                                {/* Header Section */}
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <FileText className="w-5 h-5 text-orange-500" />
                                      <h3 className="font-bold text-lg text-gray-800">
                                        #{order.orderNumber.slice(0, 13)}
                                      </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <Calendar className="w-4 h-4" />
                                      {formatDate(order.orderDate)}
                                    </div>
                                  </div>
                                  <Badge className={`${getStatusColor(order.status)} text-white px-3 py-1 shadow-md`}>
                                    {order.status}
                                  </Badge>
                                </div>

                                {/* Customer Info Card */}
                                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-3 mb-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                      <User className="w-4 h-4 text-gray-500 shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Customer</p>
                                        <p className="font-semibold text-gray-800 truncate">{order.customerName}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="w-4 h-4 text-gray-500 shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Payment</p>
                                        <p className="font-semibold text-gray-800 truncate">{order.paymentMethod}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Items Summary */}
                                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-3 mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-gray-700">Order Items ({order.items.length})</p>
                                    <p className="text-xs text-gray-500">Total Qty: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                                  </div>
                                  <div className="space-y-2 max-h-24 overflow-y-auto">
                                    {order.items.slice(0, 3).map((item) => (
                                      <div key={item.id} className="flex justify-between items-center text-sm bg-white/60 rounded px-2 py-1">
                                        <span className="text-gray-700 font-medium truncate flex-1">
                                          {item.name} <span className="text-gray-500">×{item.quantity}</span>
                                        </span>
                                        <span className="font-semibold text-gray-800 ml-2">${item.price.toFixed(2)}</span>
                                      </div>
                                    ))}
                                    {order.items.length > 3 && (
                                      <p className="text-xs text-gray-500 text-center">+{order.items.length - 3} more items</p>
                                    )}
                                  </div>
                                </div>

                                {/* Total Amount */}
                                <div className="bg-linear-to-r from-green-500 to-emerald-500 rounded-lg p-3 mb-4 text-white shadow-md">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-xs text-white/80">Total Amount</p>
                                      <p className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    {order.assignedDriver && (
                                      <div className="text-right">
                                        <p className="text-xs text-white/80">Driver</p>
                                        <p className="font-semibold text-sm">{order.assignedDriver}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewOrderDetail(order)}
                                    className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Voucher
                                  </Button>
                                  {order.status.toLowerCase() === "delivering" && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleTrackOrder(order)}
                                      className="flex-1 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                                    >
                                      <MapPin className="w-4 h-4 mr-2" />
                                      Track Live
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Order Tracking Map Dialog */}
      {showTrackingDialog && trackingOrder && (
        <OrderTrackingMapDialog
          open={showTrackingDialog}
          onOpenChange={setShowTrackingDialog}
          orderId={trackingOrder.id}
          orderNumber={trackingOrder.orderNumber}
          storeLatitude={trackingOrder.storeLatitude}
          storeLongitude={trackingOrder.storeLongitude}
          pickupAddress="Store Location"
          orderLatitude={trackingOrder.orderLatitude}
          orderLongitude={trackingOrder.orderLongitude}
          deliveryAddress={trackingOrder.deliveryAddress}
          deliveryLatitude={trackingOrder.deliveryLatitude}
          deliveryLongitude={trackingOrder.deliveryLongitude}
          deliveryId={trackingOrder.assignedDriver}
          deliveryName={trackingOrder.assignedDriver}
          deliveryPhone={trackingOrder.customerPhone}
          status={trackingOrder.status}
        />
      )}

      {/* Voucher Dialog */}
      {showVoucher && voucherData && (
        <VoucherDialog
          open={showVoucher}
          onOpenChange={setShowVoucher}
          voucherData={voucherData}
        />
      )}
    </>
  );
};

export default OrdersDialog;

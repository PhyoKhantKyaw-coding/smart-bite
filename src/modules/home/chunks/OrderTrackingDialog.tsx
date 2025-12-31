import { useEffect, useState } from "react";
import { X, MapPin, Store, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTracking } from "@/api/delivery";

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

interface OrderTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

const OrderTrackingDialog: React.FC<OrderTrackingDialogProps> = ({
  open,
  onOpenChange,
  order,
}) => {
  const [deliveryLocation, setDeliveryLocation] = useState({
    lat: order.deliveryLatitude,
    lng: order.deliveryLongitude,
  });

  // Poll for real-time delivery location updates
  useEffect(() => {
    if (!open) return;

    const fetchDeliveryLocation = async () => {
      try {
        const response = await getTracking(order.id);
        if (response.status === 0 && response.data) {
          // Get delivery location from tracking or delivery data
          const lat = response.data.tracking?.currentLatitude || 
                      response.data.delivery?.currentLatitude || 
                      order.deliveryLatitude;
          const lng = response.data.tracking?.currentLongitude || 
                      response.data.delivery?.currentLongitude || 
                      order.deliveryLongitude;
          setDeliveryLocation({ lat, lng });
        }
      } catch (error) {
        console.error("Error fetching delivery location:", error);
      }
    };

    // Initial fetch
    fetchDeliveryLocation();

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchDeliveryLocation, 5000);

    return () => clearInterval(interval);
  }, [open, order.id, order.deliveryLatitude, order.deliveryLongitude]);

  if (!open) return null;

  // Open in Google Maps (for click action)
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/${order.storeLatitude},${order.storeLongitude}/${deliveryLocation.lat},${deliveryLocation.lng}/${order.orderLatitude},${order.orderLongitude}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b bg-linear-to-r from-orange-500 to-amber-500 rounded-t-3xl">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-6 h-6" />
            Order Tracking
          </h2>
          <p className="text-white/90 text-sm mt-1">
            Order #{order.orderNumber.slice(0, 8)}... • {order.assignedDriver}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="p-4 h-[500px] relative overflow-hidden">
                {/* Simple visual map representation */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-green-50">
                  {/* Store Location */}
                  <div
                    className="absolute bg-orange-500 rounded-full p-3 shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{
                      left: "20%",
                      top: "30%",
                    }}
                  >
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className="absolute text-sm font-semibold text-orange-700 bg-white px-2 py-1 rounded-md shadow-sm"
                    style={{
                      left: "20%",
                      top: "40%",
                    }}
                  >
                    Store
                  </div>

                  {/* Delivery Person (Real-time) */}
                  <div
                    className="absolute bg-purple-500 rounded-full p-3 shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                  >
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className="absolute text-sm font-semibold text-purple-700 bg-white px-2 py-1 rounded-md shadow-sm"
                    style={{
                      left: "50%",
                      top: "60%",
                    }}
                  >
                    {order.assignedDriver}
                  </div>

                  {/* Destination */}
                  <div
                    className="absolute bg-green-500 rounded-full p-3 shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{
                      left: "80%",
                      top: "30%",
                    }}
                  >
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className="absolute text-sm font-semibold text-green-700 bg-white px-2 py-1 rounded-md shadow-sm"
                    style={{
                      left: "80%",
                      top: "40%",
                    }}
                  >
                    Destination
                  </div>

                  {/* Route Line */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 5 }}
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
                      </marker>
                    </defs>
                    <path
                      d="M 20% 30% Q 35% 35% 50% 50%"
                      stroke="#94a3b8"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                    <path
                      d="M 50% 50% Q 65% 35% 80% 30%"
                      stroke="#94a3b8"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                  </svg>
                </div>

                {/* Coordinates Display */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="font-semibold text-orange-600">Store</p>
                      <p className="text-gray-600">
                        {order.storeLatitude.toFixed(6)}, {order.storeLongitude.toFixed(6)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-600">Delivery</p>
                      <p className="text-gray-600">
                        {deliveryLocation.lat.toFixed(6)}, {deliveryLocation.lng.toFixed(6)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-green-600">Destination</p>
                      <p className="text-gray-600">
                        {order.orderLatitude.toFixed(6)}, {order.orderLongitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Open in Google Maps Button */}
              <Button
                onClick={openInGoogleMaps}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
            </div>

            {/* Order Info Section */}
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium text-purple-600">{order.status}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Items</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-orange-600">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-2">
                  <Navigation className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Live Tracking</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Location updates every 5 seconds
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingDialog;

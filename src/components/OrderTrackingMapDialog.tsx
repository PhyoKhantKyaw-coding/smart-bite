import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  MapPin, Store, Navigation, Phone, User, Package } from "lucide-react";
import ClickableMap from "@/components/ClickableMap";
import { signalRService, OrderDeliveryLocationUpdate } from "@/services/signalRService";
import { toast } from "sonner";

interface OrderTrackingMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber?: string;
  // Store/Pickup Location
  storeLatitude: number;
  storeLongitude: number;
  pickupAddress?: string;
  // Order/Destination Location
  orderLatitude: number;
  orderLongitude: number;
  deliveryAddress?: string;
  // Initial Delivery Location
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  // Delivery Person Info
  deliveryId?: string;
  deliveryName: string;
  deliveryPhone?: string;
  // Order Status
  status?: string;
}

const OrderTrackingMapDialog: React.FC<OrderTrackingMapDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  storeLatitude,
  storeLongitude,
  pickupAddress,
  orderLatitude,
  orderLongitude,
  deliveryAddress,
  deliveryLatitude,
  deliveryLongitude,
  deliveryName,
  deliveryPhone,
}) => {
  const [currentDeliveryPosition, setCurrentDeliveryPosition] = useState({
    lat: deliveryLatitude || storeLatitude,
    lng: deliveryLongitude || storeLongitude,
  });
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize SignalR connection and subscribe to order updates
  useEffect(() => {
    if (!open || !orderId) return;

    let isSubscribed = true;

    const initializeTracking = async () => {
      try {
        // Start SignalR connection with timeout
        const connectionTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Connection timeout")), 10000)
        );
        
        await Promise.race([
          signalRService.startConnection(),
          connectionTimeout
        ]);
        
        if (isSubscribed) {
          setIsConnected(true);
          
          // Subscribe to this specific order
          await signalRService.subscribeToOrder(orderId);
          
          // Listen for real-time location updates
          signalRService.onOrderDeliveryLocationUpdate((data: OrderDeliveryLocationUpdate) => {
            if (data.orderId === orderId && isSubscribed) {
              console.log("Real-time location update:", data);
              setCurrentDeliveryPosition({
                lat: data.latitude,
                lng: data.longitude,
              });
              setLastUpdateTime(new Date(data.timestamp));
            }
          });

          toast.success("Live tracking enabled");
        }
      } catch (error) {
        console.error("Error initializing tracking:", error);
        
        // Show a more user-friendly error message
        if (error instanceof Error) {
          if (error.message.includes("timeout")) {
            toast.error("Connection timeout - tracking may be unavailable");
          } else if (error.message.includes("WebSocket")) {
            toast.warning("Live tracking unavailable - showing last known location");
          } else {
            toast.error("Failed to connect to live tracking");
          }
        }
        
        setIsConnected(false);
        // Continue showing the map with initial position
      }
    };

    initializeTracking();

    // Cleanup on unmount or when dialog closes
    return () => {
      isSubscribed = false;
      
      if (orderId) {
        signalRService.unsubscribeFromOrder(orderId).catch(err => {
          console.error("Error unsubscribing:", err);
        });
        signalRService.offOrderDeliveryLocationUpdate();
      }
    };
  }, [open, orderId]);

  // Open in Google Maps with full route
//   const openInGoogleMaps = () => {
//     const url = `https://www.google.com/maps/dir/${storeLatitude},${storeLongitude}/${currentDeliveryPosition.lat},${currentDeliveryPosition.lng}/${orderLatitude},${orderLongitude}`;
//     window.open(url, "_blank");
//   };

  // Format time ago
  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "Waiting for update...";
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[70%] max-h-[95vh] overflow-hidden p-0 gap-0 bg-linear-to-br from-slate-50 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950/20">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-linear-to-r from-orange-600 via-amber-500 to-orange-600 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI0IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xMiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          
          <DialogHeader className="relative px-8 py-6 text-white">
            {/* <button
              onClick={() => onOpenChange(false)}
              className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg hover:scale-110"
            >
              <X className="w-5 h-5 text-white" />
            </button> */}
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold mb-2 drop-shadow-lg">
                  Live Order Tracking
                </DialogTitle>
                <DialogDescription className="text-white/90 text-base font-medium flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                    Order #{orderNumber || orderId.slice(0, 8)}
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {deliveryName}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section - Enhanced */}
            <div className="lg:col-span-2 space-y-5">
              {/* Connection Status - Modern Design */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/50 dark:bg-slate-800/80 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center gap-3">
                  {isConnected ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                      <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                  )}
                  <div>
                    <p className={`font-bold text-sm ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {isConnected ? "Live Tracking Active" : "Connecting..."}
                    </p>
                    {lastUpdateTime && (
                      <p className="text-xs text-muted-foreground">
                        Updated {formatTimeAgo(lastUpdateTime)}
                      </p>
                    )}
                  </div>
                </div>
                {isConnected && (
                  <Badge className="bg-green-500 text-white px-3 py-1 shadow-md">
                    Real-Time
                  </Badge>
                )}
              </div>

              {/* Map - Enhanced with Shadow */}
              <Card className="overflow-hidden rounded-3xl shadow-2xl border-2 border-orange-200/50 dark:border-orange-800/50">
                <ClickableMap
                  latitude={storeLatitude}
                  longitude={storeLongitude}
                  clickable={false}
                  showStoreToDestinationRoute={true}
                  showRoute={true}
                  routeColor="#f97316"
                  deliveryPosition={{
                    lat: currentDeliveryPosition.lat,
                    lng: currentDeliveryPosition.lng,
                  }}
                  destinationPosition={{
                    lat: orderLatitude,
                    lng: orderLongitude,
                  }}
                  storeName="Store"
                  deliveryManName={deliveryName}
                  destinationName="Ordered Place"
                />
              </Card>

              {/* Coordinates Display - Modern Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Store Location */}
                <Card className="p-4 bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-2 border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-orange-500 text-white shadow-md">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-orange-700 dark:text-orange-400 text-lg">Store</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono bg-white/50 dark:bg-slate-900/50 p-2 rounded-lg">
                    {storeLatitude.toFixed(6)}, {storeLongitude.toFixed(6)}
                  </p>
                </Card>

                {/* Delivery Person Location */}
                <Card className="p-4 bg-linear-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-700 dark:text-purple-400 text-lg">{deliveryName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono bg-white/50 dark:bg-slate-900/50 p-2 rounded-lg">
                    {currentDeliveryPosition.lat.toFixed(6)}, {currentDeliveryPosition.lng.toFixed(6)}
                  </p>
                </Card>

                {/* Ordered Place Location */}
                <Card className="p-4 bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-green-600 text-white shadow-md">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-green-700 dark:text-green-400 text-lg">Ordered Place</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono bg-white/50 dark:bg-slate-900/50 p-2 rounded-lg">
                    {orderLatitude.toFixed(6)}, {orderLongitude.toFixed(6)}
                  </p>
                </Card>
              </div>

              {/* Open in Google Maps Button - Enhanced */}
              {/* <Button
                onClick={openInGoogleMaps}
                className="w-full h-14 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <MapPin className="w-5 h-5 mr-3" />
                Open Full Route in Google Maps
              </Button> */}
            </div>

            {/* Info Section - Enhanced */}
            <div className="space-y-5">
              {/* Delivery Person Info - Premium Card */}
              <Card className="overflow-hidden rounded-3xl shadow-xl border-2 border-purple-200/50 dark:border-purple-800/50">
                <div className="bg-linear-to-br from-purple-600 via-indigo-600 to-purple-700 p-5 text-white">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                      <User className="w-6 h-6" />
                    </div>
                    Delivery Person
                  </h3>
                </div>
                <div className="p-5 space-y-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium">Name</p>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{deliveryName}</p>
                    </div>
                  </div>
                  {deliveryPhone && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium">Phone</p>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{deliveryPhone}</p>
                      </div>
                    </div>
                  )}
                  {/* {deliveryId && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                        <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium">Delivery ID</p>
                        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm font-mono">{deliveryId.slice(0, 13)}</p>
                      </div>
                    </div>
                  )} */}
                </div>
              </Card>

              {/* Order Info - Premium Card */}
              {/* <Card className="overflow-hidden rounded-3xl shadow-xl border-2 border-orange-200/50 dark:border-orange-800/50">
                <div className="bg-linear-to-br from-orange-600 via-amber-600 to-orange-700 p-5 text-white">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                      <Package className="w-6 h-6" />
                    </div>
                    Order Information
                  </h3>
                </div>
                <div className="p-5 space-y-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <div className="p-4 rounded-xl bg-linear-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Order ID</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg font-mono">{orderNumber || orderId.slice(0, 13)}</p>
                  </div>
                  {status && (
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900">
                      <p className="text-xs text-muted-foreground font-medium mb-2">Status</p>
                      <Badge className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 text-base shadow-lg">
                        {status}
                      </Badge>
                    </div>
                  )}
                </div>
              </Card> */}

              {/* Addresses - Premium Card */}
              <Card className="overflow-hidden rounded-3xl shadow-xl border-2 border-blue-200/50 dark:border-blue-800/50">
                <div className="bg-linear-to-br from-blue-600 via-cyan-600 to-blue-700 p-5 text-white">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    Locations
                  </h3>
                </div>
                <div className="p-5 space-y-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border-l-4 border-orange-500">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 shrink-0">
                      <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-orange-700 dark:text-orange-400 mb-1">Pickup - Store</p>
                      <p className="text-sm text-muted-foreground wrap-break-word">
                        {pickupAddress || `${storeLatitude.toFixed(4)}, ${storeLongitude.toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border-l-4 border-green-500">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 shrink-0">
                      <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-green-700 dark:text-green-400 mb-1">Delivery - Ordered Place</p>
                      <p className="text-sm text-muted-foreground wrap-break-word">
                        {deliveryAddress || `${orderLatitude.toFixed(4)}, ${orderLongitude.toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Live Tracking Info - Premium Alert
              <div className="p-5 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-xl border-2 border-blue-400">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">
                      Real-Time Tracking Active
                    </p>
                    <p className="text-sm text-blue-100">
                      Location updates automatically every few seconds via SignalR WebSocket connection
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Footer with Delivery Info - Premium Design */}
        <div className="border-t-2 mb-2  border-gray-200 dark:border-slate-800 bg-linear-to-r from-slate-100 via-white to-orange-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-orange-950/20 backdrop-blur-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2  py-2 rounded-xl bg-white dark:bg-slate-900 shadow-md">
                <User className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-gray-900 dark:text-gray-100">{deliveryName}</span>
              </div>
              {deliveryPhone && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 shadow-md">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="text-gray-900 dark:text-gray-100">{deliveryPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 shadow-md">
                <Package className="w-4 h-4 text-orange-600" />
                <span className="font-mono text-gray-900 dark:text-gray-100">#{orderNumber || orderId.slice(0, 8)}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 rounded-xl font-bold border-2  shadow-md hover:shadow-lg transition-all duration-300"
            >
              Close Tracking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingMapDialog;

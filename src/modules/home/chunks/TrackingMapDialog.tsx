import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Store, Navigation } from "lucide-react";
import { getTracking } from "@/api/delivery";
import ClickableMap from "@/components/ClickableMap";

interface TrackingMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const TrackingMapDialog: React.FC<TrackingMapDialogProps> = ({
  open,
  onOpenChange,
  orderId,
}) => {
  const { data: trackingData, refetch } = getTracking(orderId).useQuery({
    enabled: open && !!orderId,
  });

  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        refetch();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [open, refetch]);

  const tracking = trackingData?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90%] md:w-[85%] lg:w-[75%] max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
            Order Tracking
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Real-time delivery tracking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {tracking && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Store className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Store</p>
                    <p className="font-medium">Store Location</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery To</p>
                    <p className="font-medium truncate">{tracking.orderingPlace || 'Destination'}</p>
                  </div>
                </div>
                {tracking.delivery && (
                  <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                    <Navigation className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery Person</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{tracking.delivery.deliveryName}</p>
                        {tracking.delivery.isOnline && (
                          <Badge className="bg-green-500 text-white text-xs">Online</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Badge className="bg-blue-500 text-white text-xs sm:text-sm">
                {tracking.status || 'Processing'}
              </Badge>

              {/* Interactive Map - View Only */}
              <div className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border">
                <ClickableMap
                  latitude={tracking.storeLatitude || 16.8661}
                  longitude={tracking.storeLongitude || 96.1951}
                  clickable={false}
                  showStoreToDestinationRoute={true}
                  showRoute={!!tracking.tracking}
                  routeColor="#ef4444"
                  deliveryPosition={
                    tracking.tracking?.currentLatitude && tracking.tracking?.currentLongitude
                      ? { lat: tracking.tracking.currentLatitude, lng: tracking.tracking.currentLongitude }
                      : tracking.delivery?.currentLatitude && tracking.delivery?.currentLongitude
                      ? { lat: tracking.delivery.currentLatitude, lng: tracking.delivery.currentLongitude }
                      : undefined
                  }
                  destinationPosition={
                    tracking.orderingLatitude && tracking.orderingLongitude
                      ? { lat: tracking.orderingLatitude, lng: tracking.orderingLongitude }
                      : undefined
                  }
                  storeName="Store Location"
                  deliveryManName={tracking.delivery?.deliveryName || "Delivery Person"}
                  destinationName={tracking.orderingPlace || "Delivery Destination"}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingMapDialog;

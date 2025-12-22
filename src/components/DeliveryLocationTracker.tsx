import { useEffect, useState } from 'react';
import { useDeliveryLocation } from '@/hooks/useDeliveryLocation';
import { setDeliveryOnlineStatus } from '@/api/delivery';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Power, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DeliveryLocationTrackerProps {
  deliveryId: string;
  deliveryName: string;
  initialOnlineStatus?: boolean;
}

/**
 * Component to track delivery person's location in real-time
 * Use this after delivery login to automatically update location
 */
const DeliveryLocationTracker: React.FC<DeliveryLocationTrackerProps> = ({
  deliveryId,
  initialOnlineStatus = true,
}) => {
  const [isOnline, setIsOnline] = useState(initialOnlineStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Start location tracking with the hook
  const { latitude, longitude, error, isTracking, startTracking, stopTracking } =
    useDeliveryLocation({
      deliveryId,
      enabled: isOnline,
      updateInterval: 30000, // Update every 30 seconds
    });

  // Update online status on the server
  const handleToggleOnlineStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      const newStatus = !isOnline;
      const response = await setDeliveryOnlineStatus(deliveryId, newStatus);
      
      if (response.status === 0 || response.status === 200) {
        setIsOnline(newStatus);
        toast.success(
          newStatus
            ? 'You are now online and accepting deliveries'
            : 'You are now offline and not accepting deliveries'
        );
      } else {
        toast.error('Failed to update online status');
      }
    } catch (error) {
      console.error('Failed to toggle online status:', error);
      toast.error('Failed to update online status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Request location permission on mount
  useEffect(() => {
    if (isOnline && !isTracking && !error) {
      startTracking();
    }
  }, [error, isOnline, isTracking, startTracking]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Location Tracking</h3>
            <p className="text-sm text-muted-foreground">
              {isOnline ? 'Active - Location updating in real-time' : 'Inactive'}
            </p>
          </div>
          <Button
            variant={isOnline ? 'destructive' : 'default'}
            size="sm"
            onClick={handleToggleOnlineStatus}
            disabled={isUpdatingStatus}
            className={isOnline ? '' : 'bg-green-600 hover:bg-green-700'}
          >
            <Power className="w-4 h-4 mr-2" />
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-green-600' : ''}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          {isTracking && (
            <Badge variant="outline" className="bg-blue-50">
              <Navigation className="w-3 h-3 mr-1" />
              Tracking Active
            </Badge>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Location Error</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  stopTracking();
                  setTimeout(() => startTracking(), 500);
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Current Location */}
        {!error && latitude && longitude && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Location Active</p>
                <div className="mt-2 space-y-1 text-xs text-green-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>
                      Latitude: {latitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>
                      Longitude: {longitude.toFixed(6)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => {
                    if (latitude && longitude) {
                      window.open(
                        `https://www.google.com/maps?q=${latitude},${longitude}`,
                        '_blank'
                      );
                    }
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  View My Location
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your location is updated automatically every 30 seconds</li>
            <li>Location only tracks when you are online</li>
            <li>Admin and customers can see your location for deliveries</li>
            <li>You can go offline anytime to stop tracking</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default DeliveryLocationTracker;

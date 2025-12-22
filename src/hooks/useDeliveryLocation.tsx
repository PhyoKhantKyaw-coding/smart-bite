import { useEffect, useRef, useState } from 'react';
import { updateDeliveryLocation } from '@/api/delivery';
import { toast } from 'sonner';

interface UseDeliveryLocationOptions {
  deliveryId?: string;
  enabled?: boolean;
  updateInterval?: number; // in milliseconds
}

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isTracking: boolean;
}

export const useDeliveryLocation = ({
  deliveryId,
  enabled = false,
  updateInterval = 30000, // Default: 30 seconds
}: UseDeliveryLocationOptions) => {
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isTracking: false,
  });

  const watchIdRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<{ lat: number; lng: number } | null>(null);

  const updateLocationToServer = async (latitude: number, longitude: number) => {
    if (!deliveryId) return;

    // Check if location changed significantly (at least 10 meters)
    if (lastUpdateRef.current) {
      const distance = calculateDistance(
        lastUpdateRef.current.lat,
        lastUpdateRef.current.lng,
        latitude,
        longitude
      );
      if (distance < 0.01) return; // Less than 10 meters, skip update
    }

    try {
      await updateDeliveryLocation({
        deliveryId,
        currentLatitude: latitude,
        currentLongitude: longitude,
        deviceToken: localStorage.getItem('deviceToken') || null,
      });
      lastUpdateRef.current = { lat: latitude, lng: longitude };
    } catch (error) {
      console.error('Failed to update delivery location:', error);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setLocationState((prev) => ({ ...prev, isTracking: true, error: null }));

    // Watch position for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationState({
          latitude,
          longitude,
          error: null,
          isTracking: true,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationState((prev) => ({
          ...prev,
          error: errorMessage,
          isTracking: false,
        }));
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Set interval to update server
    intervalIdRef.current = setInterval(() => {
      if (locationState.latitude && locationState.longitude) {
        updateLocationToServer(locationState.latitude, locationState.longitude);
      }
    }, updateInterval);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setLocationState((prev) => ({ ...prev, isTracking: false }));
  };

  useEffect(() => {
    if (enabled && deliveryId) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, deliveryId]);

  // Update server when location changes
  useEffect(() => {
    if (
      enabled &&
      deliveryId &&
      locationState.latitude &&
      locationState.longitude &&
      locationState.isTracking
    ) {
      updateLocationToServer(locationState.latitude, locationState.longitude);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState.latitude, locationState.longitude]);

  return {
    ...locationState,
    startTracking,
    stopTracking,
  };
};

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

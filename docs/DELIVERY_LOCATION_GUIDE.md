# Delivery Location Tracking Integration Guide

## Overview
This guide explains how to integrate real-time location tracking for delivery personnel after login.

## Components Created

### 1. API Endpoints (`/api/delivery/index.ts`)
- `updateDeliveryLocation()` - Update delivery person's current location
- `getNearbyDeliveries()` - Get delivery persons within a radius
- `setDeliveryOnlineStatus()` - Set online/offline status
- `getAllActiveDeliveryLocations()` - Get all active delivery locations for map

### 2. Custom Hook (`/hooks/useDeliveryLocation.tsx`)
Provides automatic location tracking with:
- Real-time GPS monitoring
- Automatic server updates every 30 seconds
- Smart updates (only when location changes > 10 meters)
- Error handling and permissions

### 3. Components

#### DeliveryLocationTracker (`/components/DeliveryLocationTracker.tsx`)
UI component for delivery persons to:
- Toggle online/offline status
- View current location
- See tracking status
- Handle location errors

#### DeliveryMapView (`/modules/admin/delivery-management/chunks/DeliveryMapView.tsx`)
Admin map view showing:
- All active delivery persons on map
- Real-time location updates
- Auto-refresh every 15 seconds
- Coverage circles

## Integration Steps

### Step 1: Add to Delivery Dashboard
After delivery person logs in, add the location tracker component:

```tsx
// In DeliveryDashboardView.tsx or DeliveryView.tsx
import DeliveryLocationTracker from '@/components/DeliveryLocationTracker';
import { useAppSelector } from '@/store';

function DeliveryDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <div className="space-y-6">
      {/* Location Tracker - Add this at the top */}
      {user?.userId && (
        <DeliveryLocationTracker
          deliveryId={user.userId}
          deliveryName={user.name || 'Delivery Person'}
          initialOnlineStatus={true}
        />
      )}
      
      {/* Rest of dashboard content */}
      <div>
        {/* Orders, stats, etc. */}
      </div>
    </div>
  );
}
```

### Step 2: Update Login Flow
After successful delivery login, automatically start location tracking:

```tsx
// In LoginView.tsx or auth slice
import { updateDeliveryLocation } from '@/api/delivery';

// After successful login
const handleDeliveryLogin = async (credentials) => {
  const response = await login(credentials);
  
  if (response.data && response.data.role === 'Delivery') {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Update location immediately after login
          await updateDeliveryLocation({
            deliveryId: response.data.userId,
            currentLatitude: position.coords.latitude,
            currentLongitude: position.coords.longitude,
            deviceToken: localStorage.getItem('deviceToken') || null,
          });
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  }
};
```

### Step 3: Add to Admin Dashboard
Show delivery map in admin delivery management:

```tsx
// In DeliveryManagementView.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeliveryMapView from './chunks/DeliveryMapView';

function DeliveryManagementView() {
  return (
    <Tabs defaultValue="list">
      <TabsList>
        <TabsTrigger value="list">Delivery List</TabsTrigger>
        <TabsTrigger value="map">Live Map</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list">
        {/* Existing delivery table */}
      </TabsContent>
      
      <TabsContent value="map">
        <DeliveryMapView autoRefresh={true} refreshInterval={15000} />
      </TabsContent>
    </Tabs>
  );
}
```

## API Usage Examples

### Update Location Manually
```typescript
import { updateDeliveryLocation } from '@/api/delivery';

await updateDeliveryLocation({
  deliveryId: 'guid-here',
  currentLatitude: 16.8661,
  currentLongitude: 96.1951,
  deviceToken: 'fcm-token-here',
});
```

### Get Nearby Deliveries
```typescript
import { getNearbyDeliveries } from '@/api/delivery';

const nearby = await getNearbyDeliveries({
  latitude: 16.8661,
  longitude: 96.1951,
  radiusInKm: 5,
  townId: 'optional-town-guid',
});
```

### Toggle Online Status
```typescript
import { setDeliveryOnlineStatus } from '@/api/delivery';

await setDeliveryOnlineStatus('delivery-guid', true); // Go online
await setDeliveryOnlineStatus('delivery-guid', false); // Go offline
```

## Features

### Location Hook Features
- ✅ Automatic GPS tracking
- ✅ Smart updates (only when moved > 10m)
- ✅ Configurable update interval
- ✅ Battery-efficient
- ✅ Error handling
- ✅ Permission management

### Security & Privacy
- Location only tracked when delivery is online
- Can go offline anytime to stop tracking
- Location permissions required from browser
- Automatic cleanup on unmount

### Performance
- Updates every 30 seconds by default
- Only sends updates when location changes significantly
- Auto-refresh map every 15 seconds
- Efficient state management

## Browser Compatibility
Requires browsers with Geolocation API support:
- ✅ Chrome 5+
- ✅ Firefox 3.5+
- ✅ Safari 5+
- ✅ Edge 12+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Location Permission Denied
- User must grant location permission in browser
- Show clear error message with retry button
- Provide instructions for enabling location

### Location Not Updating
- Check if delivery is online
- Verify internet connection
- Check browser console for errors
- Ensure location services enabled on device

### Map Not Showing Deliveries
- Verify deliveries have valid lat/lng coordinates
- Check if deliveries are online
- Verify API is returning data
- Check network tab for API errors

## Notes
- Location accuracy depends on device GPS capability
- Indoor locations may be less accurate
- Battery usage increases with more frequent updates
- Consider reducing update frequency to save battery

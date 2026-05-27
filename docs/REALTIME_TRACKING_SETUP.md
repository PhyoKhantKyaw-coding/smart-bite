# Real-Time Order Tracking Setup Guide

## Overview
This guide explains how to set up and use the real-time order tracking feature using SignalR for live delivery location updates.

## Architecture

### Components Created

1. **OrderTrackingMapDialog** (`src/components/OrderTrackingMapDialog.tsx`)
   - Unified tracking dialog with live map
   - Shows store location, delivery person location, and destination
   - Real-time updates via SignalR
   - Footer with delivery person info (name, phone, order ID)

2. **SignalR Service** (`src/services/signalRService.ts`)
   - Manages SignalR connection lifecycle
   - Handles subscriptions to specific orders
   - Automatic reconnection logic
   - Real-time location update handling

### Updated Components

1. **OrdersForDelivery** (`src/modules/delivery/chunks/OrdersForDelivery.tsx`)
   - "Track Order" button now opens the unified tracking dialog
   - Passes all required props (order ID, locations, delivery info)

2. **OrdersDialog** (`src/modules/home/chunks/OrdersDialog.tsx`)
   - "Track Live" button opens the unified tracking dialog
   - Connected for customer-side order tracking

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# API Base URL (adjust for your backend)
VITE_API_BASE_URL=http://localhost:5000/api
```

The SignalR hub URL will be automatically constructed as:
```
{VITE_API_BASE_URL}/deliveryTrackingHub
```

### Backend Requirements

Your backend must implement the SignalR hub with these methods:

#### Hub Methods

```csharp
// Subscribe to order tracking
Task SubscribeToOrder(Guid orderId)

// Unsubscribe from order tracking
Task UnsubscribeFromOrder(Guid orderId)

// Send location update (called by delivery app)
Task SendOrderDeliveryLocationUpdate(
    Guid orderId, 
    Guid deliveryId, 
    string deliveryName,
    decimal latitude, 
    decimal longitude
)
```

#### Hub Events (Server to Client)

```csharp
// Client receives this event when delivery location updates
ReceiveOrderDeliveryLocationUpdate(OrderDeliveryLocationResponseDTO data)

// DTO Structure:
{
    "orderId": "guid",
    "deliveryId": "guid",
    "deliveryName": "string",
    "latitude": decimal,
    "longitude": decimal,
    "timestamp": "datetime"
}
```

## Usage

### For Delivery Person Dashboard

1. View orders in the delivery dashboard
2. Click "Track Order" button on any order
3. Dialog opens showing:
   - Live map with route
   - Store location (orange marker)
   - Delivery person location (purple marker, updates in real-time)
   - Destination location (green marker)
   - Delivery person info in footer
   - Connection status badge

### For Customer View

1. View your orders in the orders dialog
2. For orders with status "Delivering", click "Track Live"
3. Same tracking dialog opens with real-time updates
4. Footer shows delivery person name, phone, and order ID

## Props Reference

### OrderTrackingMapDialog Props

```typescript
interface OrderTrackingMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;                  // Required: Order ID to track
  orderNumber?: string;             // Display order number
  
  // Store/Pickup Location
  storeLatitude: number;            // Required
  storeLongitude: number;           // Required
  storeName?: string;               // Display name
  pickupAddress?: string;           // Full address
  
  // Order/Destination Location
  orderLatitude: number;            // Required
  orderLongitude: number;           // Required
  deliveryAddress?: string;         // Full address
  
  // Initial Delivery Location (updated via SignalR)
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  
  // Delivery Person Info (shown in footer)
  deliveryId?: string;
  deliveryName: string;             // Required
  deliveryPhone?: string;           // Phone number
  
  // Order Status
  status?: string;                  // e.g., "In Transit", "Delivering"
}
```

## SignalR Connection Flow

1. **Dialog Opens**
   - SignalR connection starts automatically
   - Subscribes to specific order using `orderId`
   - Connection status badge shows "Live Tracking Active"

2. **Real-Time Updates**
   - Backend sends `ReceiveOrderDeliveryLocationUpdate` events
   - Frontend updates delivery marker position on map
   - "Updated X seconds ago" timestamp displayed

3. **Dialog Closes**
   - Unsubscribes from order updates
   - Cleans up event listeners
   - Connection remains open for other subscriptions

4. **Reconnection**
   - Automatic reconnection on connection loss
   - Exponential backoff (1s, 2s, 4s, 8s, 16s, 30s max)
   - Max 5 reconnection attempts

## Testing

### Test Without Backend

The component includes fallback behavior:
- Shows last known position if SignalR fails
- Displays "Connecting..." status
- Gracefully handles connection errors

### Test With Backend

1. Start your backend with SignalR hub running
2. Open the tracking dialog
3. Send location updates from delivery app:
```javascript
// Example delivery app code
await connection.invoke(
  "SendOrderDeliveryLocationUpdate",
  orderId,
  deliveryId,
  "John Doe",
  16.8661,
  96.1951
);
```
4. Watch the marker update in real-time on the map

## Troubleshooting

### SignalR Not Connecting

- Check `VITE_API_BASE_URL` in `.env`
- Verify backend hub is running at `/deliveryTrackingHub`
- Check browser console for connection errors
- Ensure WebSockets are enabled on your server

### Location Not Updating

- Verify delivery app is sending updates
- Check order subscription is active (see console logs)
- Ensure orderId matches between frontend and backend
- Verify backend is broadcasting to correct group: `order_{orderId}`

### Map Not Showing Route

- Verify all lat/long coordinates are valid
- Check ClickableMap component props
- Ensure Google Maps API key is configured

## Features

✅ Real-time delivery location updates via SignalR
✅ Automatic reconnection on connection loss
✅ Route visualization (store → delivery → destination)
✅ Delivery person info in footer
✅ Connection status indicator
✅ "Time ago" for last update
✅ Open in Google Maps button
✅ Responsive design (mobile, tablet, desktop)
✅ Used from both delivery and customer views

## Future Enhancements

- [ ] Add delivery person photo
- [ ] Show ETA based on current location
- [ ] Add chat between customer and delivery person
- [ ] Show historical route/breadcrumbs
- [ ] Add notification when delivery person is nearby
- [ ] Support multiple stops/waypoints

## Dependencies

```json
{
  "@microsoft/signalr": "^8.0.0"
}
```

Already installed in your project via `pnpm add @microsoft/signalr`.

# SignalR Backend Setup Guide

## Issues Fixed

✅ **Connection State Race Condition** - Added proper connection state management
✅ **Multiple Connection Attempts** - Implemented connection promise to prevent duplicate connections
✅ **Transport Fallback** - Enabled WebSockets, SSE, and Long Polling as fallbacks
✅ **Connection Timeout** - Added 10-second timeout with graceful error handling
✅ **Better Error Messages** - User-friendly error notifications

## Backend Configuration Required

### 1. Update Your Backend `Program.cs` or Startup

Make sure SignalR is properly configured with CORS:

```csharp
// Add services
builder.Services.AddSignalR();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.WithOrigins("http://localhost:5173", "http://localhost:3000") // Your frontend URLs
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

var app = builder.Build();

// Use CORS before routing
app.UseCors("AllowAll");

// Map SignalR Hub
app.MapHub<DeliveryTrackingHub1>("/deliveryTrackingHub");
```

### 2. Environment Variable Setup

Create or update `.env` file in your project root:

```env
# Backend API URL (without /api suffix)
VITE_API_BASE_URL=http://localhost:5000

# For production
# VITE_API_BASE_URL=https://your-production-api.com
```

### 3. Verify Backend Hub Endpoint

Make sure your SignalR hub is accessible at:
```
http://localhost:5000/deliveryTrackingHub
```

Test it by visiting:
```
http://localhost:5000/deliveryTrackingHub/negotiate
```

You should get a JSON response (not an error).

### 4. Backend Hub Methods Required

Your `DeliveryTrackingHub1` must have these methods:

```csharp
public async Task SubscribeToOrder(Guid orderId)
{
    await Groups.AddToGroupAsync(Context.ConnectionId, $"order_{orderId}");
}

public async Task UnsubscribeFromOrder(Guid orderId)
{
    await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"order_{orderId}");
}
```

### 5. Broadcasting Location Updates

To send location updates to clients:

```csharp
// In your DeliveryService
await _hubContext.Clients.Group($"order_{orderId}")
    .SendAsync("ReceiveOrderDeliveryLocationUpdate", new
    {
        OrderId = orderId,
        DeliveryId = deliveryId,
        DeliveryName = deliveryName,
        Latitude = latitude,
        Longitude = longitude,
        Timestamp = DateTime.UtcNow
    });
```

## Testing Without Backend

If your backend is not ready yet, the dialog will:
- Show a warning toast: "Live tracking unavailable - showing last known location"
- Display the map with the initial delivery position
- All other features work normally
- No crashes or blocking errors

## Troubleshooting

### Error: "WebSocket failed to connect"
**Solution:** 
1. Check if backend is running on the correct port
2. Verify CORS is configured properly
3. Make sure `/deliveryTrackingHub` endpoint exists

### Error: "Connection timeout"
**Solution:**
1. Backend might be slow to start
2. Check firewall/antivirus settings
3. Verify network connectivity

### Error: "Cannot send data if not Connected"
**Solution:** This is now fixed with proper connection state management

### Still having issues?
1. Open browser console (F12)
2. Check the Network tab for WebSocket connections
3. Verify the hub URL is correct in `.env`
4. Make sure backend SignalR middleware is registered before routing

## Current Features

✅ Graceful fallback when backend is unavailable
✅ Multiple transport protocol support (WebSocket → SSE → LongPolling)
✅ Automatic reconnection with exponential backoff
✅ Connection timeout handling
✅ User-friendly error messages
✅ Continues to show map even without live tracking

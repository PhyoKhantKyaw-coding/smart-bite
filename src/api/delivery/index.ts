import axios from '@/configs/axios';
import type {
  GetDeliveryDTO,
  GetAllDeliveriesDTO,
  PaginatedDeliveryResult,
  RealTimeOrderTrackingDTO,
  UpdateDeliveryLocationDTO,
  GetNearbyDeliveriesRequest,
  DeliveryLocationDTO,
} from './types.d';

interface ResponseDTO<T> {
  status: number;
  message?: string;
  data?: T;
}

// ============ Delivery Management ============

// Add Delivery Person
export async function addDelivery(data: FormData): Promise<ResponseDTO<null>> {
  const response = await axios.post('/api/Delivery/delivery/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Update Delivery Person
export async function updateDelivery(data: FormData): Promise<ResponseDTO<null>> {
  const response = await axios.put('/api/Delivery/delivery/update', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Get All Deliveries with Pagination
export async function getAllDeliveries(params: GetAllDeliveriesDTO): Promise<ResponseDTO<PaginatedDeliveryResult>> {
  const response = await axios.get('/api/Delivery/delivery/all', { params });
  return response.data;
}

// Delete Delivery Person
export async function deleteDelivery(deliveryId: string): Promise<ResponseDTO<null>> {
  const response = await axios.delete(`/api/Delivery/delivery/delete/${deliveryId}`);
  return response.data;
}

// Get Delivery by ID
export async function getDeliveryById(deliveryId: string): Promise<ResponseDTO<GetDeliveryDTO>> {
  const response = await axios.get(`/api/Delivery/delivery/${deliveryId}`);
  return response.data;
}

// ============ Location Management ============

// Update Delivery Location
export async function updateDeliveryLocation(data: UpdateDeliveryLocationDTO): Promise<ResponseDTO<GetDeliveryDTO>> {
  const response = await axios.post('/api/Delivery/location/update', data);
  return response.data;
}

// Get Nearby Deliveries
export async function getNearbyDeliveries(request: GetNearbyDeliveriesRequest): Promise<ResponseDTO<DeliveryLocationDTO[]>> {
  const response = await axios.post('/api/Delivery/location/nearby', request);
  return response.data;
}

// Set Delivery Online Status
export async function setDeliveryOnlineStatus(deliveryId: string, isOnline: boolean): Promise<ResponseDTO<{ deliveryId: string; isOnline: boolean }>> {
  const response = await axios.put(`/api/Delivery/location/status/${deliveryId}`, isOnline);
  return response.data;
}

// Get All Active Delivery Locations
export async function getAllActiveDeliveryLocations(): Promise<ResponseDTO<DeliveryLocationDTO[]>> {
  const response = await axios.get('/api/Delivery/location/active-all');
  return response.data;
}

// ============ Order Tracking (Existing) ============

// Add Order
export async function addOrder(orderData: Record<string, unknown>): Promise<ResponseDTO<Record<string, unknown>>> {
  const response = await axios.post('/api/Delivery/add', orderData);
  return response.data;
}

// Get My Orders
export async function getMyOrders(): Promise<ResponseDTO<Record<string, unknown>[]>> {
  const response = await axios.get('/api/Delivery/my-orders');
  return response.data;
}

// Get Orders by Status
export async function getOrdersByStatus(status: string): Promise<ResponseDTO<Record<string, unknown>[]>> {
  const response = await axios.get(`/api/Delivery/status/${status}`);
  return response.data;
}

// Get Voucher by OrderId
export async function getVoucher(orderId: string): Promise<ResponseDTO<Record<string, unknown>>> {
  const response = await axios.get(`/api/Delivery/voucher/${orderId}`);
  return response.data;
}

// Update Tracking
export async function updateTracking(trackingData: Record<string, unknown>): Promise<ResponseDTO<Record<string, unknown>>> {
  const response = await axios.post('/api/Delivery/update-tracking', trackingData);
  return response.data;
}

// Get Real-Time Tracking
export async function getTracking(orderId: string): Promise<ResponseDTO<RealTimeOrderTrackingDTO>> {
  const response = await axios.get(`/api/Delivery/tracking/${orderId}`);
  return response.data;
}

// Export all types for convenience
export * from './types.d';

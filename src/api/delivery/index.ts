import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

// Add Order
export const addOrder = {
  useMutation: (opt?: Partial<UseMutationOptions<ResponseDTO<OrderDTO>, Error, AddOrderDTO>>) => {
    return useMutation<ResponseDTO<OrderDTO>, Error, AddOrderDTO>({
      mutationFn: async (orderData) => {
        const request = await axios.post(`/api/Delivery/add`, orderData);
        return request.data;
      },
      ...opt
    });
  }
};

// Get My Orders
export const getMyOrders = {
  useQuery: (opt?: Partial<UseQueryOptions<ResponseDTO<VoucherDTO[]>, Error>>) => {
    return useQuery<ResponseDTO<VoucherDTO[]>, Error>({
      queryKey: ['myOrders'],
      queryFn: async () => {
        const request = await axios.get(`/api/Delivery/my-orders`);
        return request.data;
      },
      ...opt
    });
  }
};

// Get Orders by Status
export const getOrdersByStatus = (status: string) => ({
  useQuery: (opt?: Partial<UseQueryOptions<ResponseDTO<VoucherDTO[]>, Error>>) => {
    return useQuery<ResponseDTO<VoucherDTO[]>, Error>({
      queryKey: ['ordersByStatus', status],
      queryFn: async () => {
        const request = await axios.get(`/api/Delivery/status/${status}`);
        return request.data;
      },
      ...opt
    });
  }
});

// Get Voucher by OrderId
export const getVoucher = (orderId: string) => ({
  useQuery: (opt?: Partial<UseQueryOptions<ResponseDTO<VoucherDTO>, Error>>) => {
    return useQuery<ResponseDTO<VoucherDTO>, Error>({
      queryKey: ['voucher', orderId],
      queryFn: async () => {
        const request = await axios.get(`/api/Delivery/voucher/${orderId}`);
        return request.data;
      },
      ...opt
    });
  }
});

// Update Tracking
export const updateTracking = {
  useMutation: (opt?: Partial<UseMutationOptions<ResponseDTO<DeliveryTrackingModel>, Error, DeliveryTrackingModel>>) => {
    return useMutation<ResponseDTO<DeliveryTrackingModel>, Error, DeliveryTrackingModel>({
      mutationFn: async (trackingData) => {
        const request = await axios.post(`/api/Delivery/update-tracking`, trackingData);
        return request.data;
      },
      ...opt
    });
  }
};

// Get Real-Time Tracking
export const getTracking = (orderId: string) => ({
  useQuery: (opt?: Partial<UseQueryOptions<ResponseDTO<RealTimeOrderTrackingDTO>, Error>>) => {
    return useQuery<ResponseDTO<RealTimeOrderTrackingDTO>, Error>({
      queryKey: ['tracking', orderId],
      queryFn: async () => {
        const request = await axios.get(`/api/Delivery/tracking/${orderId}`);
        return request.data;
      },
      refetchInterval: 5000, // Auto-refetch every 5 seconds for real-time tracking
      ...opt
    });
  }
});

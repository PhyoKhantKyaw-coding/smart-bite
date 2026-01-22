import axios from "@/configs/axios";

const ORDER_API_BASE = "/api/Order";

/**
 * Get all orders with pagination
 * @param page - Page number (default: 1)
 * @param pageSize - Page size (default: 10)
 */
export const getAllOrders = async (page: number = 1, pageSize: number = 10) => {
  const response = await axios.get(`${ORDER_API_BASE}/all`, {
    params: { page, pageSize }
  });
  return response.data;
};

/**
 * Get voucher details by order ID
 * @param orderId - Order ID
 */
export const getVoucherByOrderId = async (orderId: string) => {
  const response = await axios.get(`${ORDER_API_BASE}/voucher/${orderId}`);
  return response.data;
};

/**
 * Get order route (store and delivery locations) by order ID
 * @param orderId - Order ID
 */
export const getOrderRouteByOrderId = async (orderId: string) => {
  const response = await axios.get(`${ORDER_API_BASE}/route/${orderId}`);
  return response.data;
};

/**
 * Update order status
 * @param orderId - Order ID
 * @param status - New status (Cooking, Delivery, Delivering, Delivered)
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await axios.put(`${ORDER_API_BASE}/status/${orderId}`, {
    status
  });
  return response.data;
};

/**
 * Delete order (soft delete)
 * @param orderId - Order ID
 */
export const deleteOrder = async (orderId: string) => {
  const response = await axios.delete(`${ORDER_API_BASE}/delete/${orderId}`);
  return response.data;
};

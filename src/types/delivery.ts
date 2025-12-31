export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  status: "Delivery" | "Delivered" | "delivering" | "cancel" | "delivered" | "delivery" | "New" | "Picked Up" | "In Transit" | "new" | "pending";
  deliveryTime?: string | null;
  assignedDriver?: string;
  notes?: string;
  items: OrderItem[];
  distance?: string;
  estimatedTime?: string;
  pickupAddress?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  orderLatitude?: number;
  orderLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
}

export interface DeliveredOrder extends DeliveryOrder {
  deliveredAt?: string;
  deliveredBy?: string;
  customerSignature?: string;
}

export interface OrderDTO {
  orderId?: string;
  paymentId?: string;
  storeId?: string;
  townId?: string;
  deliveryId?: string;
  userId?: string;
  totalPrice?: number;
  totalCost?: number;
  totalProfit?: number;
  orderDate?: string;
  orderingPlace?: string;
  orderLatitude?: number;
  orderLongitude?: number;
  status?: string;
  orderDescription?: string;
  estimatedDeliveryTime?: number;
  deliveryStarted?: string;
  deliveredTime?: string;
}

export interface OrderRouteDTO {
  orderId?: string;
  orderDate?: string;
  orderingPlace?: string;
  orderLatitude?: number;
  orderLongitude?: number;
  storeLatitude?: number;
  storeLongitude?: number;
}

export interface GetOrderDTO {
  orderId?: string;
  userName?: string;
  townName?: string;
  storeName?: string;
  deliveryName?: string;
  paymentType?: string;
  orderDescription?: string;
  status?: string;
}

export interface MapDTO {
  place?: string;
  latitude?: number;
  longitude?: number;
}

export interface OtherTopicModel {
  id?: string;
  name?: string;
  price?: number;
}

export interface OrderDetailDTO {
  totalPrice?: number;
  name?: string;
  eachPrice?: number;
  cookingTime?: number;
  foodImage?: string;
  foodDescription?: string;
  catName?: string;
  quantity?: number;
  topics?: OtherTopicModel[];
}

export interface VoucherDTO {
  orderId?: string;
  userName?: string;
  townName?: string;
  storeName?: string;
  deliveryName?: string;
  paymentType?: string;
  orderDescription?: string;
  status?: string;
  totalPrice?: number;
  totalCost?: number;
  totalProfit?: number;
  estimatedDeliveryTime?: number;
  deliveryStarted?: string;
  deliveredTime?: string;
  cartDTOs?: OrderDetailDTO[];
}

export interface UpdateOrderStatusDTO {
  status: string;
}

export interface PaginatedOrderResponse {
  data: GetOrderDTO[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export type OrderStatus = 
  | "Pending"
  | "Confirmed"
  | "Cooking"
  | "Delivery"
  | "Delivering"
  | "Delivered"
  | "Cancelled";

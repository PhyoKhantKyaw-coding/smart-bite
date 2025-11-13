interface MapDTO {
  place?: string;
  latitude?: number;
  longitude?: number;
}

interface TopicDTO {
  otherId?: string;
}

interface AddCartDTO {
  foodId?: string;
  quantity?: number;
  topics?: TopicDTO[];
}

interface AddOrderDTO {
  orderdetail?: AddCartDTO[];
  townId?: string;
  orderplaceMap?: MapDTO;
  orderDescription?: string;
  paymentType?: string;
  paymentAmount?: number;
}

interface OrderDTO {
  orderId?: string;
  paymentId?: string;
  storeId?: string;
  townId?: string;
  deliveryId?: string;
  userId?: string;
  totalPrice?: number;
  totalCost?: number;
  totalProfit?: number;
  orderDate?: Date;
  orderingPlace?: string;
  orderLatitude?: number;
  orderLongitude?: number;
  status?: string;
  orderDescription?: string;
  estimatedDeliveryTime?: number;
  deliveryStarted?: Date;
  deliveredTime?: Date;
}

interface DeliveryTrackingModel {
  orderId?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  status?: string;
}

interface DeliveryDTO {
  deliveryId?: string;
  deliveryName?: string;
  email?: string;
  phNo?: string;
  isOnline?: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
}

interface DeliveryTrackingDTO {
  trackingId?: string;
  orderId?: string;
  deliveryId?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  timestamp?: string | Date;
  status?: string;
}

interface RealTimeOrderTrackingDTO {
  orderId?: string;
  status?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  orderDate?: string | Date;
  orderingPlace?: string;
  orderingLatitude?: number;
  orderingLongitude?: number;
  delivery?: DeliveryDTO;
  tracking?: DeliveryTrackingDTO;
}

// Legacy type - kept for backward compatibility, but should use RealTimeOrderTrackingDTO
interface TrackingDTO {
  orderId?: string;
  storeName?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  orderPlace?: string;
  orderLatitude?: number;
  orderLongitude?: number;
  currentLatitude?: number;
  currentLongitude?: number;
  status?: string;
  estimatedDeliveryTime?: number;
}

interface OrderDetailDTO {
  foodId?: string;
  name?: string;
  eachPrice?: number;
  cookingTime?: number;
  foodImage?: string;
  foodDescription?: string;
  catName?: string;
  quantity?: number;
  totalPrice?: number;
  topics?: {
    topicId?: string;
    topicName?: string;
  }[];
}

interface VoucherDTO {
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
  orderDate?: string | Date;
  deliveryStarted?: string | Date;
  deliveredTime?: string | Date;
  cartDTOs?: OrderDetailDTO[];
}

// Delivery DTOs
export interface DeliveryDTO {
  deliveryId?: string;
  deliveryName?: string;
  email?: string;
  phNo?: string;
  isOnline?: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
}

export interface AddDeliveryDTO {
  deliveryName?: string;
  password?: string;
  email?: string;
  profile?: string;
  phNo?: string;
  townId?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  deviceToken?: string | null;
  isOnline?: boolean;
}

export interface UpdateDeliveryDTO {
  deliveryId?: string;
  deliveryName?: string;
  password?: string;
  email?: string;
  profile?: string;
  phNo?: string;
  townId?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  deviceToken?: string | null;
  isOnline?: boolean;
}

export interface GetDeliveryDTO {
  deliveryId?: string;
  deliveryName?: string;
  email?: string;
  profile?: string;
  phNo?: string;
  townId?: string;
  townName?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  deviceToken?: string | null;
  isOnline?: boolean;
}

export interface GetAllDeliveriesDTO {
  page?: number;
  pageSize?: number;
  query?: string;
  townId?: string;
  isOnline?: boolean;
}

export interface PaginatedDeliveryResult {
  data?: GetDeliveryDTO[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface DeliveryTrackingDTO {
  trackingId?: string;
  orderId?: string;
  deliveryId?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  timestamp?: string;
  status?: string;
}

export interface RealTimeOrderTrackingDTO {
  orderId?: string;
  status?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  orderDate?: string;
  orderingPlace?: string;
  orderingLatitude?: number;
  orderingLongitude?: number;
  delivery?: DeliveryDTO;
  tracking?: DeliveryTrackingDTO;
}

// Dashboard Statistics DTOs
export interface DashboardStatsDTO {
  totalOrders?: number;
  totalRevenue?: number;
  totalUsers?: number;
  activeUsers?: number;
  avgOrderValue?: number;
  todayOrders?: number;
  todayRevenue?: number;
  pendingOrders?: number;
  completedOrders?: number;
  cancelledOrders?: number;
  totalDeliveryPersons?: number;
  activeDeliveryPersons?: number;
  totalStores?: number;
  activeStores?: number;
  totalCategories?: number;
  totalProducts?: number;
}

// Revenue Chart Data
export interface RevenueDataDTO {
  date?: string;
  revenue?: number;
  orders?: number;
}

// Orders Chart Data
export interface OrdersDataDTO {
  date?: string;
  orders?: number;
  completed?: number;
  pending?: number;
  cancelled?: number;
}

// Category Sales Data
export interface CategorySalesDTO {
  categoryId?: string;
  categoryName?: string;
  totalSales?: number;
  totalOrders?: number;
  percentage?: number;
}

// Top Products Data
export interface TopProductDTO {
  foodId?: string;
  foodName?: string;
  foodImage?: string;
  totalOrders?: number;
  totalRevenue?: number;
  category?: string;
  rating?: number;
}

// Recent Activity Data
export interface RecentActivityDTO {
  id?: string;
  type?: "order" | "user" | "delivery" | "product";
  title?: string;
  description?: string;
  timestamp?: string;
  status?: string;
  icon?: string;
}

// Latest Orders Data
export interface LatestOrderDTO {
  orderId?: string;
  orderDate?: string;
  customerName?: string;
  customerEmail?: string;
  items?: number;
  totalAmount?: number;
  status?: "pending" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled";
  deliveryPerson?: string;
}

// Delivery Performance Data
export interface DeliveryPerformanceDTO {
  deliveryId?: string;
  deliveryName?: string;
  deliveryImage?: string;
  completedOrders?: number;
  avgDeliveryTime?: number;
  rating?: number;
  earnings?: number;
  status?: "active" | "inactive" | "busy";
}

// Sales Overview Data
export interface SalesOverviewDTO {
  period?: string; // "today" | "week" | "month" | "year"
  totalSales?: number;
  totalOrders?: number;
  avgOrderValue?: number;
  growth?: number; // percentage
}

// User Growth Data
export interface UserGrowthDTO {
  date?: string;
  newUsers?: number;
  activeUsers?: number;
  totalUsers?: number;
}

// Store Performance Data
export interface StorePerformanceDTO {
  storeId?: string;
  storeName?: string;
  storeImage?: string;
  totalOrders?: number;
  totalRevenue?: number;
  rating?: number;
  status?: "active" | "inactive";
}

// Dashboard Summary Response
export interface DashboardSummaryDTO {
  stats?: DashboardStatsDTO;
  revenueData?: RevenueDataDTO[];
  ordersData?: OrdersDataDTO[];
  categorySales?: CategorySalesDTO[];
  topProducts?: TopProductDTO[];
  recentActivity?: RecentActivityDTO[];
  latestOrders?: LatestOrderDTO[];
  deliveryPerformance?: DeliveryPerformanceDTO[];
  salesOverview?: SalesOverviewDTO;
  userGrowth?: UserGrowthDTO[];
  storePerformance?: StorePerformanceDTO[];
}

// Request DTOs
export interface GetDashboardStatsRequest {
  startDate?: string;
  endDate?: string;
  period?: "today" | "week" | "month" | "year";
}

export interface GetRevenueChartRequest {
  range?: "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}

export interface GetOrdersChartRequest {
  range?: "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}

export interface GetTopProductsRequest {
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface GetLatestOrdersRequest {
  limit?: number;
  status?: string;
}

export interface GetDeliveryPerformanceRequest {
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface GetStorePerformanceRequest {
  limit?: number;
  startDate?: string;
  endDate?: string;
}

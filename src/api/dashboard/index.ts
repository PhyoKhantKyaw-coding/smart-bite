import axios from "@/configs/axios";
import type {
  DashboardStatsDTO,
  DashboardSummaryDTO,
  RevenueDataDTO,
  OrdersDataDTO,
  CategorySalesDTO,
  TopProductDTO,
  RecentActivityDTO,
  LatestOrderDTO,
  DeliveryPerformanceDTO,
  SalesOverviewDTO,
  UserGrowthDTO,
  StorePerformanceDTO,
  GetDashboardStatsRequest,
  GetRevenueChartRequest,
  GetOrdersChartRequest,
  GetTopProductsRequest,
  GetLatestOrdersRequest,
  GetDeliveryPerformanceRequest,
  GetStorePerformanceRequest,
} from "./types.d";

interface ResponseDTO<T> {
  status: number;
  message?: string;
  data?: T;
}

// ============ Dashboard Statistics ============

export async function getDashboardStats(params?: GetDashboardStatsRequest): Promise<ResponseDTO<DashboardStatsDTO>> {
  const response = await axios.get("/api/Dashboard/stats", { params });
  return response.data;
}

export async function getDashboardSummary(params?: GetDashboardStatsRequest): Promise<ResponseDTO<DashboardSummaryDTO>> {
  const response = await axios.get("/api/Dashboard/summary", { params });
  return response.data;
}

// ============ Revenue & Orders Charts ============

export async function getRevenueChart(params?: GetRevenueChartRequest): Promise<ResponseDTO<RevenueDataDTO[]>> {
  const response = await axios.get("/api/Dashboard/revenue-chart", { params });
  return response.data;
}

export async function getOrdersChart(params?: GetOrdersChartRequest): Promise<ResponseDTO<OrdersDataDTO[]>> {
  const response = await axios.get("/api/Dashboard/orders-chart", { params });
  return response.data;
}

// ============ Category & Products Analytics ============

export async function getCategorySales(startDate?: string, endDate?: string): Promise<ResponseDTO<CategorySalesDTO[]>> {
  const response = await axios.get("/api/Dashboard/category-sales", {
    params: { startDate, endDate },
  });
  return response.data;
}

export async function getTopProducts(params?: GetTopProductsRequest): Promise<ResponseDTO<TopProductDTO[]>> {
  const response = await axios.get("/api/Dashboard/top-products", { params });
  return response.data;
}

// ============ Recent Activity & Latest Orders ============

export async function getRecentActivity(limit: number = 20): Promise<ResponseDTO<RecentActivityDTO[]>> {
  const response = await axios.get("/api/Dashboard/recent-activity", {
    params: { limit },
  });
  return response.data;
}

export async function getLatestOrders(params?: GetLatestOrdersRequest): Promise<ResponseDTO<LatestOrderDTO[]>> {
  const response = await axios.get("/api/Dashboard/latest-orders", { params });
  return response.data;
}

// ============ Delivery & Store Performance ============

export async function getDeliveryPerformance(params?: GetDeliveryPerformanceRequest): Promise<ResponseDTO<DeliveryPerformanceDTO[]>> {
  const response = await axios.get("/api/Dashboard/delivery-performance", { params });
  return response.data;
}

export async function getStorePerformance(params?: GetStorePerformanceRequest): Promise<ResponseDTO<StorePerformanceDTO[]>> {
  const response = await axios.get("/api/Dashboard/store-performance", { params });
  return response.data;
}

// ============ Sales Overview & User Growth ============

export async function getSalesOverview(period: string = 'today'): Promise<ResponseDTO<SalesOverviewDTO>> {
  const response = await axios.get("/api/Dashboard/sales-overview", {
    params: { period },
  });
  return response.data;
}

export async function getUserGrowth(range: string = 'month'): Promise<ResponseDTO<UserGrowthDTO[]>> {
  const response = await axios.get("/api/Dashboard/user-growth", {
    params: { range },
  });
  return response.data;
}

// Export all types for convenience
export * from "./types.d";

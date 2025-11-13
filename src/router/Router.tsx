import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";
import DeliveryLayout from "@/layouts/DeliveryLayout";
import HomeView from "@/modules/home/HomeView";
import LoginView from "@/modules/auth/LoginView";
import DashboardView from "@/modules/admin/dashboard/DashboardView";
import DashboardV2View from "@/modules/admin/dashboard-v2/DashboardV2View";
import FoodManagementView from "@/modules/admin/food-management/FoodManagementView";
import UserManagementView from "@/modules/admin/user-management/UserView";
import StoreManagementView from "@/modules/admin/store-management/StoreManagementView";
import DeliveryManagementView from "@/modules/admin/delivery-management/DeliveryManagementView";

import { useAuth } from "@/hooks/UseAuth";
import React, { ReactNode } from "react";

// ✅ Define prop types properly
interface ProtectedRouteProps {
  role: "user" | "admin" | "delivery";
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const Router = () => {
// RedirectIfUserExists component
function RedirectIfUserExists() {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "delivery") return <Navigate to="/delivery" replace />;
  if (user?.role === "user") return <Navigate to="/user" replace />;
  return <UserLayoutOutlet />;
}

// Wrapper to ensure children render in UserLayout's Outlet
function UserLayoutOutlet() {
  return <UserLayout />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectIfUserExists />,
    children: [
      { path: "", element: <HomeView /> },
      { path: "auth", element: <LoginView /> },
    ],
  },
    {
      path: "/user",
      element: (
        <ProtectedRoute role="user">
          <UserLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <HomeView /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <DashboardV2View /> },
        { path: "dashboard", element: <DashboardView /> },
        { path: "dashboard-v2", element: <DashboardV2View /> },
        { path: "foods", element: <FoodManagementView /> },
        { path: "stores", element: <StoreManagementView /> },
        { path: "deliveries", element: <DeliveryManagementView /> },
        { path: "users", element: <UserManagementView /> }
      ],
    },
    {
      path: "/delivery",
      element: (
        <ProtectedRoute role="delivery">
          <DeliveryLayout />
        </ProtectedRoute>
      ),
      children: [{ path: "", element: <HomeView /> }],
    },
  ]);

  return <RouterProvider router={router} />;
};


export default Router;

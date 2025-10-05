import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/UseAuth";
import SidebarNav from "@/hooks/Sidebar";
import Header from "@/hooks/Header";
import Footer from "@/components/Footer";

const DeliveryLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return document.body.classList.contains('dark');
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!user || user.role !== "delivery") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "delivery") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {/* Header at the top */}
        <Header isCollapsed={isCollapsed} darkMode={darkMode} setDarkMode={setDarkMode} />
        {/* Sidebar and Outlet side by side */}
        <div className="flex flex-1 w-full">
          <aside className="hidden md:block h-full" style={{ minWidth: isCollapsed ? '5rem' : '16rem', maxWidth: isCollapsed ? '5rem' : '16rem' }}>
            <SidebarNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} autoSelectDashboard />
          </aside>
          <main className="flex-1 flex flex-col px-2 py-4 md:px-8 md:py-8 max-w-7xl mx-auto w-full bg-white dark:bg-zinc-900 text-black dark:text-white">
            <div className="flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default DeliveryLayout;

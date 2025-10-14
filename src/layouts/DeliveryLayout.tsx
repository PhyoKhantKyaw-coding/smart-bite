import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/UseAuth";
import SidebarNav from "@/hooks/Sidebar";
import Header from "@/hooks/Header";

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
      <div
        className="min-h-screen w-full"
        style={{
          background: darkMode ? '#18181b' : '#fff',
          color: darkMode ? '#fff' : '#000',
          display: 'grid',
          gridTemplateColumns: `${isCollapsed ? '5rem' : '16rem'} 1fr`,
          gridTemplateRows: '4rem 1fr auto',
          gridTemplateAreas: `
            'sidebar header'
            'sidebar main'
            'sidebar footer'
          `,
          minHeight: '100vh',
        }}
      >
        {/* Sidebar (area 1) */}
        <div style={{ gridArea: 'sidebar', height: '100%', minHeight: 0 }}>
          <SidebarNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} autoSelectDashboard />
        </div>
        {/* Header (area 2) */}
        <div style={{ gridArea: 'header', minWidth: 0 }}>
          <Header isCollapsed={isCollapsed} darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
        {/* Main/body (area 3) */}
        <main style={{ gridArea: 'main', minWidth: 0, display: 'flex', flexDirection: 'column', background: darkMode ? '#18181b' : '#fff', color: darkMode ? '#fff' : '#000' }}>
          <div className="flex-1 overflow-y-auto px-2 py-4 md:px-8 md:py-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </SidebarProvider>
  );
};

export default DeliveryLayout;

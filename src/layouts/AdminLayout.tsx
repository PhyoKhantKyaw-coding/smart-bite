import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/UseAuth";
import SidebarNav from "@/hooks/Sidebar";
import Footer from "@/components/Footer";
import Header from "@/hooks/Header";

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

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

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
  <div className="min-h-screen flex flex-col w-full" style={{ background: darkMode ? '#18181b' : '#fff', color: darkMode ? '#fff' : '#000' }}>
        {/* Header at the top */}
  <Header isCollapsed={isCollapsed} darkMode={darkMode} setDarkMode={setDarkMode} />
        {/* Sidebar and Outlet side by side */}
        <div className="flex flex-1 w-full">
          <div className="h-full" style={{ minWidth: isCollapsed ? '5rem' : '16rem', maxWidth: isCollapsed ? '5rem' : '16rem' }}>
            <SidebarNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} autoSelectDashboard />
          </div>
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

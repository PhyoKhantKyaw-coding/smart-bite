import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/UseAuth";
import Header from "@/hooks/Header";

const DeliveryLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed] = React.useState(false);
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
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header isCollapsed={isCollapsed} darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full" style={{ background: darkMode ? '#18181b' : '#fff', color: darkMode ? '#fff' : '#000' }}>
        <div className="container mx-auto px-4 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeliveryLayout;

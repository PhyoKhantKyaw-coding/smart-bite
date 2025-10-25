import React from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  Truck,
  Users,
  LogOut,
  PackageCheck,
  ClipboardList,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./UseAuth";
import { useIsMobile } from "./mobile";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface SidebarNavProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  autoSelectDashboard?: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isDark, setIsDark] = React.useState(() => document.body.classList.contains('dark'));

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const adminItems: SidebarItem[] = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Food Management", url: "/admin/foods", icon: UtensilsCrossed },
    { title: "Order Management", url: "/admin/orders", icon: ShoppingBag },
    { title: "Store Management", url: "/admin/stores", icon: Store },
    { title: "Delivery Management", url: "/admin/deliveries", icon: Truck },
    { title: "User Management", url: "/admin/users", icon: Users },
  ];

  const deliveryItems: SidebarItem[] = [
    { title: "Delivery Dashboard", url: "/delivery/dashboard", icon: LayoutDashboard },
    { title: "Ordered Orders", url: "/delivery/ordered", icon: ClipboardList },
    { title: "Delivered Orders", url: "/delivery/delivered", icon: PackageCheck },
  ];

  const items = user?.role === "admin" ? adminItems : deliveryItems;

  // Check if a menu item is active based on current location
  const isActive = (path: string) => {
    // Exact match for the current path
    if (location.pathname === path) return true;
    
    // Special handling for dashboard routes - only activate if exact match or root
    if (path.includes('dashboard') || path === '/admin' || path === '/delivery') {
      return location.pathname === path;
    }
    
    // Don't show dashboard as active when on other pages
    if (location.pathname !== '/admin' && location.pathname !== '/admin/dashboard' && path === '/admin/dashboard') {
      return false;
    }
    if (location.pathname !== '/delivery' && location.pathname !== '/delivery/dashboard' && path === '/delivery/dashboard') {
      return false;
    }
    
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <Sidebar className={`border-r transition-all duration-300 hidden md:flex ${isCollapsed ? 'w-20' : 'w-60'} h-screen`} style={{ background: isDark ? '#18181b' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
      {/* Sidebar Header */}
  <div className="flex items-center justify-between px-6 py-5 border-b" style={{ background: isDark ? '#18181b' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#3f3f46' : '#e5e7eb' }}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' , display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UtensilsCrossed className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            <h2 className="text-lg md:text-xl font-bold" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              SmartBite
            </h2>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg mx-auto" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed className="w-5 h-5" style={{ color: '#fff' }} />
          </div>
        )}

        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg transition-colors absolute top-1/2 -translate-y-1/2 -right-4 border shadow-sm z-20"
            style={{ 
              boxSizing: 'content-box',
              background: isDark ? '#27272a' : '#fff',
              borderColor: isDark ? '#3f3f46' : '#e5e7eb'
            }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" style={{ color: isDark ? '#a1a1aa' : '#4b5563' }} />
            ) : (
              <ChevronLeft className="w-5 h-5" style={{ color: isDark ? '#a1a1aa' : '#4b5563' }} />
            )}
          </button>
        )}

        {/* Mobile Toggle */}
        {isMobile && (
          <SidebarTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </SidebarTrigger>
        )}
      </div>

      {/* Sidebar Content */}
      <SidebarContent className="px-3 py-4 flex flex-col h-full justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => {
                  const isItemActive = isActive(item.url);
                  return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all duration-200 group`}
                      style={
                        isItemActive
                          ? {
                              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                              color: '#000',
                              boxShadow: '0 4px 6px -1px rgba(251, 191, 36, 0.3)',
                              fontWeight: '500'
                            }
                          : {
                              color: isDark ? '#d4d4d8' : '#374151',
                            }
                      }
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-3 w-full" 
                        title={isCollapsed ? item.title : ''}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} style={{ color: 'inherit' }} />
                        {!isCollapsed && <span className="text-sm" style={{ color: 'inherit' }}>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        {/* Sidebar Footer with Logout */}
        <div className="px-3 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group`}
                title={isCollapsed ? 'Logout' : ''}
              >
                <LogOut className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} group-hover:scale-110 transition-transform`} />
                {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNav;
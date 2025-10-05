import React from "react";
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
  MapPin,
  Users,
  Tag,
  User,
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

const SidebarNav: React.FC<SidebarNavProps> = ({ isCollapsed, setIsCollapsed, autoSelectDashboard }) => {
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
    { title: "Town Management", url: "/admin/towns", icon: MapPin },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Category Management", url: "/admin/categories", icon: Tag },
    { title: "Profile", url: "/admin/profile", icon: User },
  ];

  const deliveryItems: SidebarItem[] = [
    { title: "Delivery Dashboard", url: "/delivery/dashboard", icon: LayoutDashboard },
    { title: "Ordered Orders", url: "/delivery/ordered", icon: ClipboardList },
    { title: "Delivered Orders", url: "/delivery/delivered", icon: PackageCheck },
    { title: "Profile", url: "/delivery/profile", icon: User },
  ];

  const items = user?.role === "admin" ? adminItems : deliveryItems;

  // If autoSelectDashboard is true, force dashboard item active for admin/delivery
  const isActive = (path: string) => {
    if (autoSelectDashboard) {
      if (user?.role === "admin" && path === "/admin/dashboard") return true;
      if (user?.role === "delivery" && path === "/delivery/dashboard") return true;
    }
    return location.pathname === path;
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
                              background: isDark ? '#3b82f6' : '#3b82f6',
                              color: '#fff',
                              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
                              fontWeight: '500'
                            }
                          : {
                              color: isDark ? '#d4d4d8' : '#374151',
                            }
                      }
                      onMouseEnter={(e) => {
                        if (!isItemActive) {
                          e.currentTarget.style.background = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)';
                          e.currentTarget.style.color = isDark ? '#60a5fa' : '#3b82f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isItemActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = isDark ? '#d4d4d8' : '#374151';
                        }
                      }}
                    >
                      <a 
                        href={item.url} 
                        className="flex items-center gap-3 w-full" 
                        title={isCollapsed ? item.title : ''}
                        style={{ color: 'inherit' }}
                      >
                        <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isItemActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      </a>
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
import { Link, useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  LogOut,
  User,
  ShoppingCart,
  Heart,
  History,
  Sun,
  Moon,
  Bell,
  ShoppingBag,
  Store,
  Truck,
  MapPin,
  Users,
  Tag,
  ClipboardList,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "./UseAuth";
import React, { useState } from "react";
import { useIsMobile } from "./mobile";

interface HeaderProps {
  isCollapsed?: boolean;
  isSidebarOpen?: boolean;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode = false, setDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // User layout: show all icons and navigation
  const isUser = user?.role === "user" || !user;
  // Admin/Delivery: show sidebar, theme toggle, noti, profile
  const isAdminOrDelivery = user?.role === "admin" || user?.role === "delivery";

  // Title for admin/delivery
  const dashboardTitle = isAdminOrDelivery ? "Dashboard" : "SmartBite";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 w-full`}
      style={{
        background: darkMode ? '#18181b' : '#fff',
        color: darkMode ? '#fff' : '#000',
        borderColor: darkMode ? '#3f3f46' : '#e5e7eb'
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex h-18 items-center justify-between px-2 md:px-8">
        {/* === Left: Logo & Title === */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: darkMode ? '#fff' : '#000' }}>
              <UtensilsCrossed className="w-6 h-6" style={{ color: darkMode ? '#000' : '#fff' }} />
            </div>
            <span className="text-xl font-bold" style={{ color: darkMode ? '#fff' : '#000' }}>SmartBite</span>
            {isAdminOrDelivery && (
              <span className="ml-4 text-lg font-semibold opacity-80" style={{ color: darkMode ? '#fff' : '#000' }}>{dashboardTitle}</span>
            )}
          </Link>
        </div>

        {/* === Hamburger for mobile === */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
          </Button>
        </div>

        {/* === Middle: Navigation (desktop only) === */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {isUser && (
            <>
              <Link to="/" className="transition-colors hover:text-primary flex items-center gap-1"><User className="w-4 h-4" />Home</Link>
              <Link to="/menu" className="transition-colors hover:text-primary flex items-center gap-1"><ShoppingCart className="w-4 h-4" />Menu</Link>
              <Link to="/contact" className="transition-colors hover:text-primary flex items-center gap-1"><Heart className="w-4 h-4" />Contact</Link>
              <Link to="/about" className="transition-colors hover:text-primary flex items-center gap-1"><History className="w-4 h-4" />About</Link>
            </>
          )}
          {isUser && user && (
            <>
              <Link to="/cart" className="transition-colors hover:text-primary flex items-center gap-1"><ShoppingCart className="w-4 h-4" />Cart</Link>
              <Link to="/favorite" className="transition-colors hover:text-primary flex items-center gap-1"><Heart className="w-4 h-4" />Favorite</Link>
              <Link to="/orders" className="transition-colors hover:text-primary flex items-center gap-1"><History className="w-4 h-4" />Order History</Link>
            </>
          )}
        </nav>

        {/* === Right: Auth/Profile/Actions (desktop only) === */}
        <div className="hidden md:flex items-center space-x-4 pr-10">
          {isAdminOrDelivery && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setDarkMode && setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
            </>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage/>
                    <AvatarFallback style={{ background: '#3b82f6', color: '#fff' }}>
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount style={{ background: darkMode ? '#27272a' : '#fff', color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#3f3f46' : '#e5e7eb' }}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none" style={{ color: darkMode ? '#fff' : '#000' }}>{user.email}</p>
                    <p className="text-xs" style={{ color: darkMode ? '#a1a1aa' : '#6b7280' }}>{user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ background: darkMode ? '#3f3f46' : '#e5e7eb' }} />
                <DropdownMenuItem onClick={handleLogout} style={{ color: darkMode ? '#fff' : '#000' }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>Login</Button>
              <Button className="gradient-primary" onClick={() => navigate("/auth?mode=register")}>Sign up</Button>
            </>
          )}
        </div>
      </div>

      {/* === Mobile Dropdown === */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50">
          <nav className="flex flex-col gap-2 p-4 text-sm font-medium">
            {isUser && (
              <>
                <Link to="/" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><User className="w-4 h-4" />Home</Link>
                <Link to="/menu" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><ShoppingCart className="w-4 h-4" />Menu</Link>
                <Link to="/contact" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><Heart className="w-4 h-4" />Contact</Link>
                <Link to="/about" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><History className="w-4 h-4" />About</Link>
              </>
            )}
            {isUser && user && (
              <>
                <Link to="/cart" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><ShoppingCart className="w-4 h-4" />Cart</Link>
                <Link to="/favorite" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><Heart className="w-4 h-4" />Favorite</Link>
                <Link to="/orders" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><History className="w-4 h-4" />Order History</Link>
              </>
            )}
            {/* Sidebar tabs for admin/delivery in mobile dropdown */}
            {isMobile && isAdminOrDelivery && (
              <>
                <div className="border-t pt-2 mt-2">
                  {user?.role === "admin" && (
                    <>
                      <Link to="/admin/dashboard" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><User className="w-4 h-4" />Dashboard</Link>
                      <Link to="/admin/foods" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><UtensilsCrossed className="w-4 h-4" />Food Management</Link>
                      <Link to="/admin/orders" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><ShoppingBag className="w-4 h-4" />Order Management</Link>
                      <Link to="/admin/stores" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><Store className="w-4 h-4" />Store Management</Link>
                      <Link to="/admin/deliveries" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><Truck className="w-4 h-4" />Delivery Management</Link>
                      <Link to="/admin/towns" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><MapPin className="w-4 h-4" />Town Management</Link>
                      <Link to="/admin/users" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><Users className="w-4 h-4" />User Management</Link>
                      <Link to="/admin/categories" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><Tag className="w-4 h-4" />Category Management</Link>
                      <Link to="/admin/profile" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><User className="w-4 h-4" />Profile</Link>
                    </>
                  )}
                  {user?.role === "delivery" && (
                    <>
                      <Link to="/delivery/dashboard" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><User className="w-4 h-4" />Delivery Dashboard</Link>
                      <Link to="/delivery/ordered" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><ClipboardList className="w-4 h-4" />Ordered Orders</Link>
                      <Link to="/delivery/delivered" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><PackageCheck className="w-4 h-4" />Delivered Orders</Link>
                      <Link to="/delivery/profile" className="transition-colors hover:text-primary flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}><User className="w-4 h-4" />Profile</Link>
                    </>
                  )}
                </div>
              </>
            )}
            <div className="flex items-center gap-2 mt-2">
              {isAdminOrDelivery && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => setDarkMode && setDarkMode(!darkMode)}>
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>
                </>
              )}
              {user ? (
                <Button variant="ghost" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Logout</Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}>Login</Button>
                  <Button className="gradient-primary" onClick={() => { navigate("/auth?mode=register"); setMobileMenuOpen(false); }}>Sign up</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

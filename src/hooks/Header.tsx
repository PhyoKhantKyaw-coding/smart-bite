import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Sun, Moon, Bell, LogOut, ChevronDown, ShoppingCart, Heart, Package, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "./UseAuth";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isCollapsed?: boolean;
  isSidebarOpen?: boolean;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  onCartClick?: () => void;
  onFavoriteClick?: () => void;
  onOrderHistoryClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  darkMode = false,
  setDarkMode,
  onCartClick,
  onFavoriteClick,
  onOrderHistoryClick,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Determine current dark state: prefer parent prop, otherwise read body class/localStorage
  const isDark = typeof window !== 'undefined'
    ? (typeof setDarkMode === 'function' ? darkMode : (document.body.classList.contains('dark') || localStorage.getItem('theme') === 'dark'))
    : false;

  const handleToggleDark = () => {
    if (typeof setDarkMode === 'function') {
      // If parent manages dark mode, delegate
      setDarkMode(!darkMode);
      return;
    }

    // Otherwise manage body class and persist preference
    if (typeof window === 'undefined') return;
    const currentlyDark = document.body.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    if (currentlyDark) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isGuest = !user;
  const isUser = user?.role === "user";
  const isAdmin = user?.role === "admin";
  const isDelivery = user?.role === "delivery";
  const isAdminOrDelivery = isAdmin || isDelivery;

  // Admin/Delivery header
  if (isAdminOrDelivery) {
    return (
      <header className={"sticky top-0 z-50 border-b w-full flex items-center justify-between px-6 h-16 " + (isDark ? 'bg-[#18181b] text-white border-gray-700' : 'bg-white text-black border-gray-200')}>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">{isAdmin ? "Admin Dashboard" : "Delivery Dashboard"}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleToggleDark} aria-label="Toggle dark mode">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback style={{ background: "#3b82f6", color: "#fff" }}>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email}</p>
                  <p className="text-xs">{user.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    );
  }

  // Guest/User header
  return (
    <header className={"sticky top-0 z-50 border-b bg-white text-black"}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-black">SmartBite</span>
        </Link>

        {/* Right actions: mobile hamburger, desktop nav */}
        <div className="flex items-center gap-4">
          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            </Button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {(isGuest || isUser) && (
            <>
              <Link to="/" className="hover:text-primary">Home</Link>

              <button onMouseEnter={() => setActiveDropdown("about")} onMouseLeave={() => setActiveDropdown(null)}
                className="flex items-center hover:text-primary relative">
                About <ChevronDown className="ml-1 w-4 h-4" />
                {activeDropdown === "about" && (
                  <div className="absolute top-full left-0 w-[300px] h-[20vh] bg-white border rounded shadow-lg p-4 z-50">
                    <p className="text-gray-700 text-sm">
                      SmartBite is an innovative food ordering and delivery system that connects
                      customers with their favorite restaurants. Fast, reliable, and convenient!
                    </p>
                  </div>
                )}
              </button>

              <button onMouseEnter={() => setActiveDropdown("menu")} onMouseLeave={() => setActiveDropdown(null)}
                className="flex items-center hover:text-primary relative">
                Menu <ChevronDown className="ml-1 w-4 h-4" />
                {activeDropdown === "menu" && (
                  <div className="absolute top-full left-0 w-[300px] h-[20vh] bg-white border rounded shadow-lg p-4 z-50">
                    <p className="text-gray-700 text-sm">
                      Explore our menu: Local favorites and global cuisines. Order with ease from SmartBite!
                    </p>
                  </div>
                )}
              </button>

              <button onMouseEnter={() => setActiveDropdown("contact")} onMouseLeave={() => setActiveDropdown(null)}
                className="flex items-center hover:text-primary relative">
                Contact <ChevronDown className="ml-1 w-4 h-4" />
                {activeDropdown === "contact" && (
                  <div className="absolute top-full left-0 w-[300px] h-[20vh] bg-white border rounded shadow-lg p-4 z-50">
                    <p className="text-gray-700 text-sm">
                      Contact SmartBite support at support@smartbite.com or +95 9 123 456 789.
                    </p>
                  </div>
                )}
              </button>

              {isGuest ? (
                <>
                  <Button variant="ghost" onClick={() => navigate("/auth")}>Login</Button>
                  <Button className="gradient-primary" onClick={() => navigate("/auth?mode=register")}>Sign up</Button>
                </>
              ) : (
                <>
                  <button type="button" className="hover:text-primary" onClick={onCartClick}>
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <button type="button" className="hover:text-primary" onClick={onFavoriteClick}>
                    <Heart className="w-5 h-5" />
                  </button>
                  <button type="button" className="hover:text-primary" onClick={onOrderHistoryClick}>
                    <Package className="w-5 h-5" />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                          <AvatarImage />
                          <AvatarFallback style={{ background: "#f97316", color: "#fff" }}>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onOrderHistoryClick}>
                        <Package className="mr-2 h-4 w-4" />
                        Order History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onFavoriteClick}>
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onCartClick}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Cart
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg z-50">
          <nav className="flex flex-col p-4 text-sm font-medium max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
            >
              Home
            </Link>
            
            <button 
              onClick={() => toggleDropdown("about")} 
              className="py-3 px-4 text-left hover:bg-gray-100 rounded-md transition-colors flex items-center justify-between"
            >
              About
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "about" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "about" && (
              <div className="px-4 py-3 bg-gray-50 rounded-md mb-2 mx-2">
                <p className="text-gray-700 text-xs">
                  SmartBite is an innovative food ordering and delivery system connecting customers with favorite restaurants.
                </p>
              </div>
            )}
            
            <button 
              onClick={() => toggleDropdown("menu")} 
              className="py-3 px-4 text-left hover:bg-gray-100 rounded-md transition-colors flex items-center justify-between"
            >
              Menu
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "menu" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "menu" && (
              <div className="px-4 py-3 bg-gray-50 rounded-md mb-2 mx-2">
                <p className="text-gray-700 text-xs">
                  Discover our menu: local favorites and international dishes, easily order from SmartBite!
                </p>
              </div>
            )}
            
            <button 
              onClick={() => toggleDropdown("contact")} 
              className="py-3 px-4 text-left hover:bg-gray-100 rounded-md transition-colors flex items-center justify-between"
            >
              Contact
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "contact" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "contact" && (
              <div className="px-4 py-3 bg-gray-50 rounded-md mb-2 mx-2">
                <p className="text-gray-700 text-xs">
                  Contact support at support@smartbite.com or call +95 9 123 456 789.
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 my-2"></div>

            {isGuest ? (
              <div className="space-y-2 mt-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
                >
                  Login
                </Button>
                <Button 
                  className="w-full gradient-primary" 
                  onClick={() => { navigate("/auth?mode=register"); setMobileMenuOpen(false); }}
                >
                  Sign up
                </Button>
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                {/* Profile Section */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg mb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage />
                    <AvatarFallback style={{ background: "#f97316", color: "#fff" }}>
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <button 
                  type="button" 
                  onClick={() => { navigate("/user/profile"); setMobileMenuOpen(false); }}
                  className="w-full py-3 px-4 text-left hover:bg-gray-100 rounded-md transition-colors flex items-center gap-3"
                >
                  <User className="w-5 h-5 text-orange-500" />
                  <span>Profile</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => { setMobileMenuOpen(false); onCartClick?.(); }}
                  className="w-full py-3 px-4 text-left hover:bg-gray-100 rounded-md transition-colors flex items-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  <span>Cart</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => { setMobileMenuOpen(false); onFavoriteClick?.(); }}
                  className="w-full py-3 px-4 text-left hover:bg-gray-100 rounded-md transition-colors flex items-center gap-3"
                >
                  <Heart className="w-5 h-5 text-orange-500" />
                  <span>Favorites</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => { setMobileMenuOpen(false); onOrderHistoryClick?.(); }}
                  className="w-full py-3 px-4 text-left hover:bg-gray-100 rounded-md transition-colors flex items-center gap-3"
                >
                  <Package className="w-5 h-5 text-orange-500" />
                  <span>Order History</span>
                </button>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

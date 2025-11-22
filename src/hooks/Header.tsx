import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Sun, Moon, Bell, LogOut, ShoppingCart, Heart, Package, Menu, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "./UseAuth";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileDialog from "@/components/ProfileDialog";
import { getProfileImageUrl } from "@/lib/imageUtils";

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
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const sessionData = sessionStorage.getItem("userProfile");
  const userProfileData = sessionData ? JSON.parse(sessionData) : null;

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileDialogOpen(false);
  };

  // Determine current dark state: prefer parent prop, otherwise read body class/localStorage
  const isDark = typeof window !== 'undefined'
    ? (typeof setDarkMode === 'function' ? darkMode : (document.body.classList.contains('dark') || localStorage.getItem('theme') === 'dark'))
    : false;

  const handleToggleDark = () => {
    if (typeof setDarkMode === 'function') {
      setDarkMode(!darkMode);
      return;
    }
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

  const isGuest = !user;
  const isUser = user?.role === "user";
  const isAdmin = user?.role === "admin";
  const isDelivery = user?.role === "delivery";
  const isAdminOrDelivery = isAdmin || isDelivery;

  // Admin/Delivery header
  if (isAdminOrDelivery) {
    return (
      <>
        <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-sm ${isDark ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-gray-200'}`}>
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)' }}>
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline-block text-lg font-bold" style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {isAdmin ? "Admin Panel" : "Delivery Panel"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleDark}
                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-zinc-800 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-full p-0 hover:opacity-80"
                onClick={() => setProfileDialogOpen(true)}
              >
                <Avatar className="h-9 w-9 ring-2 ring-amber-400">
                  <AvatarImage 
                    src={getProfileImageUrl(userProfileData?.userProfile || user.userProfile)}
                    alt={userProfileData?.userName || user.userName || user.email}
                  />
                  <AvatarFallback className="bg-linear-to-br from-amber-400 to-orange-500 text-white font-semibold">
                    {(userProfileData?.userName || user.userName || user.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </header>
        
        {user && (
          <ProfileDialog
            open={profileDialogOpen}
            onOpenChange={setProfileDialogOpen}
            user={userProfileData || user}
            onLogout={handleLogout}
          />
        )}
      </>
    );
  }

  // Guest/User header
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md shadow-sm" style={{ background: 'linear-gradient(120deg, #fffbe6 0%, #fbbf24 100%)' }}>
        <div className="w-full">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform" style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)' }}>
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:block" style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SmartBite
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to={isGuest ? "/" : "/user"} className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                Home
              </Link>
              <Link to={isGuest ? "/about" : "/user/about"} className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                About
              </Link>
              <Link to={isGuest ? "/menu" : "/user/menu"} className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                Menu
              </Link>
              <Link to={isGuest ? "/contact" : "/user/contact"} className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isGuest ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/auth")}
                    className="hidden sm:flex text-gray-700 hover:text-orange-500"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate("/auth?mode=register")}
                    className="text-white shadow-md"
                    style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(120deg, #f59e0b 0%, #d97706 100%)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)'}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onCartClick}
                    className="hidden sm:flex relative hover:bg-orange-50 hover:text-orange-500"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onFavoriteClick}
                    className="hidden md:flex hover:bg-orange-50 hover:text-orange-500"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onOrderHistoryClick}
                    className="hidden md:flex hover:bg-orange-50 hover:text-orange-500"
                  >
                    <Package className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 rounded-full p-0 hover:opacity-80"
                    onClick={() => setProfileDialogOpen(true)}
                  >
                    <Avatar className="h-9 w-9 ring-2" style={{ borderColor: '#fbbf24' }}>
                      <AvatarImage 
                        src={getProfileImageUrl(userProfileData?.userProfile || user.userProfile)}
                        alt={userProfileData?.userName || user.userName || user.email}
                      />
                      <AvatarFallback className="text-white font-semibold" style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)' }}>
                        {(userProfileData?.userName || user.userName || user.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="flex flex-col px-4 py-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <Link 
                to={isGuest ? "/" : "/user"} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link 
                to={isGuest ? "/about" : "/user/about"} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              >
                About
              </Link>
              <Link 
                to={isGuest ? "/menu" : "/user/menu"} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              >
                Menu
              </Link>
              <Link 
                to={isGuest ? "/contact" : "/user/contact"} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
              >
                Contact
              </Link>

              {isUser && (
                <>
                  <div className="border-t border-gray-200 my-3"></div>
                  
                  <div className="px-4 py-3 rounded-lg mb-3" style={{ background: 'linear-gradient(120deg, #fef3c7 0%, #fde68a 100%)' }}>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setProfileDialogOpen(true);
                      }}
                      className="flex items-center gap-3 w-full"
                    >
                      <Avatar className="h-12 w-12 ring-2" style={{ borderColor: '#fbbf24' }}>
                        <AvatarImage 
                          src={getProfileImageUrl(userProfileData?.userProfile || user.userProfile)}
                          alt={userProfileData?.userName || user.userName || user.email}
                        />
                        <AvatarFallback className="text-white font-semibold" style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)' }}>
                          {(userProfileData?.userName || user.userName || user.email || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userProfileData?.userName || user.userName || user.email}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </button>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); onCartClick?.(); }}
                    className="w-full py-3 px-4 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); onFavoriteClick?.(); }}
                    className="w-full py-3 px-4 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Favorites</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setMobileMenuOpen(false); onOrderHistoryClick?.(); }}
                    className="w-full py-3 px-4 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <Package className="w-5 h-5" />
                    <span>Order History</span>
                  </button>
                  
                  <div className="border-t border-gray-200 my-3"></div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}

              {isGuest && (
                <>
                  <div className="border-t border-gray-200 my-3"></div>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="w-full text-white"
                      style={{ background: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%)' }}
                      onClick={() => { navigate("/auth?mode=register"); setMobileMenuOpen(false); }}
                    >
                      Sign up
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
      
      {user && (
        <ProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          user={userProfileData || user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Header;

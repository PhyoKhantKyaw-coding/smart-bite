import Header from "@/hooks/Header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import { DialogProvider, useDialogContext } from "@/contexts/DialogContext";

const UserLayoutContent = () => {
  const { setShowCartDialog, setShowFavoriteDialog, setShowOrderHistoryDialog } = useDialogContext();

  const handleCartClick = () => {
    setShowCartDialog(true);
    setShowFavoriteDialog(false);
    setShowOrderHistoryDialog(false);
  };

  const handleFavoriteClick = () => {
    setShowCartDialog(false);
    setShowFavoriteDialog(true);
    setShowOrderHistoryDialog(false);
  };

  const handleOrderHistoryClick = () => {
    setShowCartDialog(false);
    setShowFavoriteDialog(false);
    setShowOrderHistoryDialog(true);
  };

  const handleHomeClick = () => {
    setShowCartDialog(false);
    setShowFavoriteDialog(false);
    setShowOrderHistoryDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onCartClick={handleCartClick}
        onFavoriteClick={handleFavoriteClick}
        onOrderHistoryClick={handleOrderHistoryClick}
        onHomeClick={handleHomeClick}
      />
      <main className="flex-1 w-full">
        <div className="">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const UserLayout = () => {
  return (
    <DialogProvider>
      <UserLayoutContent />
    </DialogProvider>
  );
};

export default UserLayout;

import Header from "@/hooks/Header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import { DialogProvider, useDialogContext } from "@/contexts/DialogContext";

const UserLayoutContent = () => {
  const { setShowCartDialog, setShowFavoriteDialog, setShowOrderHistoryDialog } = useDialogContext();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500">
      <Header 
        onCartClick={() => setShowCartDialog(true)}
        onFavoriteClick={() => setShowFavoriteDialog(true)}
        onOrderHistoryClick={() => setShowOrderHistoryDialog(true)}
      />
      <main className="flex-1 px-2 py-4 md:px-8 md:py-8 max-w-7xl mx-auto w-full">
        <Outlet />
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

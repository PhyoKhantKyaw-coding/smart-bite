import Header from "@/hooks/Header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import { DialogProvider, useDialogContext } from "@/contexts/DialogContext";

const UserLayoutContent = () => {
  const { setShowCartDialog, setShowFavoriteDialog, setShowOrderHistoryDialog } = useDialogContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onCartClick={() => setShowCartDialog(true)}
        onFavoriteClick={() => setShowFavoriteDialog(true)}
        onOrderHistoryClick={() => setShowOrderHistoryDialog(true)}
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

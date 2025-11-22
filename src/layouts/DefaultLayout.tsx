import { Outlet } from 'react-router-dom'
import Header from "@/hooks/Header";
import Footer from "@/components/Footer";
import { DialogProvider, useDialogContext } from "@/contexts/DialogContext";

const DefaultLayoutContent = () => {
  const { setShowCartDialog, setShowFavoriteDialog, setShowOrderHistoryDialog } = useDialogContext();

  return (
    <div className=" h-full flex flex-col">
      <Header 
        onCartClick={() => setShowCartDialog(true)}
        onFavoriteClick={() => setShowFavoriteDialog(true)}
        onOrderHistoryClick={() => setShowOrderHistoryDialog(true)}
      />
      <main className="">
        <div className="">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const DefaultLayout = () => {
  return (
    <DialogProvider>
      <DefaultLayoutContent />
    </DialogProvider>
  );
};

export default DefaultLayout;
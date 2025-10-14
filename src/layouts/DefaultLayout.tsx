import { Outlet } from 'react-router-dom'
import Header from "@/hooks/Header";
import Footer from "@/components/Footer";
import { DialogProvider, useDialogContext } from "@/contexts/DialogContext";

const DefaultLayoutContent = () => {
  const { setShowCartDialog, setShowFavoriteDialog, setShowOrderHistoryDialog } = useDialogContext();

  return (
    <>
      <Header 
        onCartClick={() => setShowCartDialog(true)}
        onFavoriteClick={() => setShowFavoriteDialog(true)}
        onOrderHistoryClick={() => setShowOrderHistoryDialog(true)}
      />
      <main className='font-display px-2 py-4 md:px-8 md:py-8 max-w-7xl mx-auto w-full'>
        <Outlet />
      </main>
      <Footer />
    </>
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
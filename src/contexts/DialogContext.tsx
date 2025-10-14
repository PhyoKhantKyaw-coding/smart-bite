import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DialogContextType {
  showCartDialog: boolean;
  setShowCartDialog: (show: boolean) => void;
  showFavoriteDialog: boolean;
  setShowFavoriteDialog: (show: boolean) => void;
  showOrderHistoryDialog: boolean;
  setShowOrderHistoryDialog: (show: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [showFavoriteDialog, setShowFavoriteDialog] = useState(false);
  const [showOrderHistoryDialog, setShowOrderHistoryDialog] = useState(false);

  return (
    <DialogContext.Provider
      value={{
        showCartDialog,
        setShowCartDialog,
        showFavoriteDialog,
        setShowFavoriteDialog,
        showOrderHistoryDialog,
        setShowOrderHistoryDialog,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
};

import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import ToastMessage from "../components/ToastModal";

interface ToastOptions {
  durationMs?: number;
}

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [durationMs, setDurationMs] = useState(1000);

  const showToast = useCallback(
    (nextMessage: string, options?: ToastOptions) => {
      setMessage(nextMessage);
      setDurationMs(options?.durationMs ?? 1000);
      setVisible(true);
    },
    []
  );

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastMessage
        visible={visible}
        message={message}
        setVisible={setVisible}
        durationMs={durationMs}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

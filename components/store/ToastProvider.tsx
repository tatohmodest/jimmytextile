"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastContextValue = {
  show: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((next: string) => {
    setMessage(next);
    window.setTimeout(() => setMessage(null), 2400);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-xs tracking-[0.18em] text-ivory uppercase shadow-lg">
          {message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type DashboardHeaderCenterContextValue = {
  center: ReactNode | null;
  setCenter: (node: ReactNode | null) => void;
  endAccessory: ReactNode | null;
  setEndAccessory: (node: ReactNode | null) => void;
};

const DashboardHeaderCenterContext = createContext<DashboardHeaderCenterContextValue | null>(
  null,
);

export function DashboardHeaderCenterProvider({ children }: { children: ReactNode }) {
  const [center, setCenterState] = useState<ReactNode | null>(null);
  const [endAccessory, setEndAccessoryState] = useState<ReactNode | null>(null);
  const setCenter = useCallback((node: ReactNode | null) => {
    setCenterState(node);
  }, []);
  const setEndAccessory = useCallback((node: ReactNode | null) => {
    setEndAccessoryState(node);
  }, []);

  const value = useMemo(
    () => ({ center, setCenter, endAccessory, setEndAccessory }),
    [center, setCenter, endAccessory, setEndAccessory],
  );

  return (
    <DashboardHeaderCenterContext.Provider value={value}>
      {children}
    </DashboardHeaderCenterContext.Provider>
  );
}

export function useDashboardHeaderCenterSetter() {
  const ctx = useContext(DashboardHeaderCenterContext);
  return ctx?.setCenter ?? null;
}

export function useDashboardHeaderCenterContent() {
  return useContext(DashboardHeaderCenterContext)?.center ?? null;
}

export function useDashboardHeaderEndAccessorySetter() {
  return useContext(DashboardHeaderCenterContext)?.setEndAccessory ?? null;
}

export function useDashboardHeaderEndAccessoryContent() {
  return useContext(DashboardHeaderCenterContext)?.endAccessory ?? null;
}

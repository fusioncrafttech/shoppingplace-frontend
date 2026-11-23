"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultSettings } from "@/data/records";
import type { StoreSettings } from "@/types/store";

type SettingsContextValue = {
  settings: StoreSettings;
  save: (next: StoreSettings) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);
const key = "shoppingplace-settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setSettings({ ...defaultSettings, ...(JSON.parse(stored) as StoreSettings) });
    } catch {
      setSettings(defaultSettings);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(settings));
  }, [ready, settings]);

  const value = useMemo(
    () => ({
      settings,
      save: (next: StoreSettings) => setSettings(next),
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}

"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

type Theme = "dark" | "light" | "system";
type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);
const themeChangeEvent = "convertfast-theme-change";
const unavailableStorageThemes = new Map<string, Theme>();

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(themeChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(themeChangeEvent, onChange);
  };
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "convertfast-theme",
}: ThemeProviderProps) {
  const getSnapshot = useCallback((): Theme => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored === "light" || stored === "dark" || stored === "system" ? stored : defaultTheme;
    } catch {
      return unavailableStorageThemes.get(storageKey) ?? defaultTheme;
    }
  }, [storageKey, defaultTheme]);
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      root.classList.remove("light", "dark");
      root.classList.add(theme === "system" ? (preference.matches ? "dark" : "light") : theme);
    };
    applyTheme();
    preference.addEventListener("change", applyTheme);
    return () => preference.removeEventListener("change", applyTheme);
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // Keep theme controls working when browser storage is unavailable.
      unavailableStorageThemes.set(storageKey, nextTheme);
    }
    window.dispatchEvent(new Event(themeChangeEvent));
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}

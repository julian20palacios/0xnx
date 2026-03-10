import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const PrivateThemeContext = createContext(null);
const PRIVATE_THEME_STORAGE_KEY = "private_theme_mode";

export const PrivateThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem(PRIVATE_THEME_STORAGE_KEY);
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PRIVATE_THEME_STORAGE_KEY, mode);
  }, [mode]);

  const setTheme = (nextMode) => {
    setMode(nextMode === "dark" ? "dark" : "light");
  };

  const toggleTheme = () => {
    setMode((currentMode) => (currentMode === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === "dark",
      setTheme,
      toggleTheme,
    }),
    [mode]
  );

  return <PrivateThemeContext.Provider value={value}>{children}</PrivateThemeContext.Provider>;
};

export const usePrivateTheme = () => {
  const context = useContext(PrivateThemeContext);
  if (!context) {
    throw new Error("usePrivateTheme debe usarse dentro de PrivateThemeProvider");
  }
  return context;
};


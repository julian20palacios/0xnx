import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const PrivateThemeContext = createContext(null);
const PRIVATE_THEME_STORAGE_KEY = "private_theme_palette";
const PRIVATE_THEME_OPTIONS = ["white", "gray", "black"];

export const PrivateThemeProvider = ({ children }) => {
  const [palette, setPalette] = useState("white");

  useEffect(() => {
    const savedPalette = localStorage.getItem(PRIVATE_THEME_STORAGE_KEY);
    if (PRIVATE_THEME_OPTIONS.includes(savedPalette)) {
      setPalette(savedPalette);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PRIVATE_THEME_STORAGE_KEY, palette);
  }, [palette]);

  const setTheme = (nextPalette) => {
    setPalette(PRIVATE_THEME_OPTIONS.includes(nextPalette) ? nextPalette : "white");
  };

  const value = useMemo(
    () => ({
      palette,
      setPalette: setTheme,
    }),
    [palette]
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

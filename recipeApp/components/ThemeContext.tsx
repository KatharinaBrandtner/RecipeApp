// components/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { lightTheme, darkTheme } from '../theme/theme';




const ThemeContext = createContext<any>(null); //erstellt Kontext mit startwert null (wird durch themeprovider geändert)

export const ThemeProvider = ({ children }: { children: ReactNode }) => { //themprovider gibt kontext bzw verwaltete die aktuelle state von light/dark
  const [isDarkMode, setIsDarkMode] = useState(false); //app startet im hell modus

  const toggleDarkMode = () => setIsDarkMode(prev => !prev); //zustan umdrehen auf false bzw true

  const theme = isDarkMode ? darkTheme : lightTheme; //theme wenn drak dann dark sonst light

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); //useTheme-Hook andere Komponenten auf aktuellen Modus und Design zugreifen

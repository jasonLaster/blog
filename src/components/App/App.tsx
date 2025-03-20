"use client";

import type { ReactNode } from "react";
import { Reshaped, Theme } from "reshaped";
import "../../themes/blog/theme.css";
import { useEffect, useState, createContext } from "react";
import { ColorMode } from "reshaped/components/Theme/Theme.types";

// Define the type for our global feature flag
declare global {
  interface Window {
    __ENABLE_THEME_TOGGLE__?: boolean;
  }
}

interface ThemeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  colorMode: 'light',
  setColorMode: () => {},
});

interface Props {
  children: ReactNode;
  initialColorMode: ColorMode;
}

const App = ({ children, initialColorMode }: Props) => {
  const [colorMode, setColorMode] = useState<ColorMode>(initialColorMode);
  // Check if theme toggle is enabled (default to false if not defined)
  const isThemeToggleEnabled = typeof window !== 'undefined' ? !!window.__ENABLE_THEME_TOGGLE__ : false;

  useEffect(() => {
    // Only remove storage if theme toggle is disabled
    if (!isThemeToggleEnabled) {
      localStorage.removeItem("__rs-color-mode");
    } else {
      // If theme toggle is enabled, check for stored preference first
      const storedMode = localStorage.getItem("__rs-color-mode");
      if (storedMode) {
        setColorMode(storedMode as ColorMode);
        console.debug('[Theme] Using stored preference:', storedMode);
        return; // Skip system preference check if we have a stored preference
      }
    }
    
    // Use system preference if no stored preference or if theme toggle is disabled
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setColorMode("dark");
    } else {
      setColorMode("light");
    }

    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Only follow system changes if theme toggle is disabled or
      // there's no stored preference when it's enabled
      if (!isThemeToggleEnabled || !localStorage.getItem("__rs-color-mode")) {
        setColorMode(e.matches ? "dark" : "light");
        console.debug('[Theme] System theme changed to:', e.matches ? "dark" : "light");
      }
    };

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemChange);
    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleSystemChange);
    };
  }, [isThemeToggleEnabled]);

  useEffect(() => {
    document.documentElement.dataset.rsColorMode = colorMode;
    console.debug('[Theme] Applied theme:', colorMode);
  }, [colorMode]);

  // Create a setColorMode function that respects the feature flag
  const handleSetColorMode = (mode: ColorMode) => {
    if (isThemeToggleEnabled) {
      // Only store and update if toggle is enabled
      localStorage.setItem("__rs-color-mode", mode);
      setColorMode(mode);
      console.debug('[Theme] Manual theme change to:', mode);
    } else {
      console.debug('[Theme] Manual theme change attempted but ignored (feature disabled)');
    }
  };

  return (
    <Reshaped theme="blog">
      <ThemeContext.Provider value={{ 
        colorMode,
        setColorMode: handleSetColorMode
      }}>
        <Theme colorMode={colorMode}>
          {children}
        </Theme>
      </ThemeContext.Provider>
    </Reshaped>
  );
};

export default App;

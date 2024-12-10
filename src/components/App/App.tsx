"use client";

import type { ReactNode } from "react";
import { Reshaped, Theme } from "reshaped";
import "../../themes/blog/theme.css";
import { useEffect, useState, createContext } from "react";
import { ColorMode } from "reshaped/components/Theme/Theme.types";

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

  useEffect(() => {
    const storedMode = localStorage.getItem("__rs-color-mode");
    if (storedMode) {
      setColorMode(storedMode as ColorMode);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setColorMode("dark");
    }

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("__rs-color-mode")) {
        setColorMode(e.matches ? "dark" : "light");
      }
    };

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemChange);
    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleSystemChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.rsColorMode = colorMode;
  }, [colorMode]);

  return (
    <Reshaped theme="blog">
      <ThemeContext.Provider value={{ colorMode, setColorMode }}>
        <Theme colorMode={colorMode}>
          {children}
        </Theme>
      </ThemeContext.Provider>
    </Reshaped>
  );
};

export default App;

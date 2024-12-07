"use client";

import { createContext, useState, ReactNode } from "react";

interface MenuVisibilityContextProps {
  isMenuVisible: boolean;
  toggleMenuVisibility: () => void;
}

export const MenuVisibilityContext = createContext<MenuVisibilityContextProps>({
  isMenuVisible: true,
  toggleMenuVisibility: () => {},
});

export const MenuVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const toggleMenuVisibility = () => {
    setIsMenuVisible((prev) => !prev);
  };

  return (
    <MenuVisibilityContext.Provider value={{ isMenuVisible, toggleMenuVisibility }}>
      {children}
    </MenuVisibilityContext.Provider>
  );
}; 
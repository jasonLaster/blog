"use client";

import { ReactNode, useContext, useState, useEffect } from "react";
import { MenuVisibilityProvider, MenuVisibilityContext } from "../../context/MenuVisibilityContext";
import MenuToggleButton from "../MenuToggleButton/MenuToggleButton";
import { View, Button, useIsomorphicLayoutEffect } from "reshaped";
import useArticleNavigation from "../../hooks/useArticleNavigation";
import type { SubmenuItemsMap } from "../../types";
import { Sun, Moon } from "react-feather";
import { ThemeContext } from "../App/App";

interface Props {
  children: ReactNode;
  availableRoutes: SubmenuItemsMap;
}

const ThemeToggleButton = () => {
  const { colorMode, setColorMode } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  const handleModeClick = () => {
    const nextColorMode = colorMode === "dark" ? "light" : "dark";
    setColorMode(nextColorMode);
    document.documentElement.setAttribute("data-rs-color-mode", nextColorMode);
  };

  if (!mounted) return null;

  return (
    <Button
      icon={colorMode === "dark" ? Sun : Moon}
      variant="ghost"
      color="neutral"
      onClick={handleModeClick}
    />
  );
};

const ButtonGroup = ({ availableRoutes }: Props) => {
  const { isArticle } = useArticleNavigation(availableRoutes);
  const [mounted, setMounted] = useState(false);
  const [isThemeToggleEnabled, setIsThemeToggleEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsThemeToggleEnabled(!!window.__ENABLE_THEME_TOGGLE__);
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!isArticle || !mounted) return null;

  return (
    <View
      position="fixed"
      attributes={{ style: { top: 16, right: 16 } }}
      zIndex={10}
      direction="column"
      gap={2}
    >
      <MenuToggleButton />
      {isThemeToggleEnabled && <ThemeToggleButton />}
    </View>
  );
};

const LayoutWrapper = (props: Props) => {
  return (
    <MenuVisibilityProvider>
      {props.children}
      <ButtonGroup {...props} />
    </MenuVisibilityProvider>
  );
};

export default LayoutWrapper; 
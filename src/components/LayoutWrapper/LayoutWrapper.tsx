"use client";

import { ReactNode } from "react";
import { MenuVisibilityProvider } from "../../context/MenuVisibilityContext";
import MenuToggleButton from "../MenuToggleButton/MenuToggleButton";
import { View } from "reshaped";
import useArticleNavigation from "../../hooks/useArticleNavigation";
import type { SubmenuItemsMap } from "../../types";

interface Props {
  children: ReactNode;
  availableRoutes: SubmenuItemsMap;
}

const LayoutWrapper = ({ children, availableRoutes }: Props) => {
  const { isArticle } = useArticleNavigation(availableRoutes);

  return (
    <MenuVisibilityProvider>
      {children}
      {isArticle && (
        <View
          position="fixed"
          attributes={{ style: { top: 16, right: 16 } }}
          zIndex={10}
        >
          <MenuToggleButton />
        </View>
      )}
    </MenuVisibilityProvider>
  );
};

export default LayoutWrapper; 
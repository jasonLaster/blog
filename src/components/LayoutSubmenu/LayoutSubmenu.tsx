"use client";

import { useContext, useEffect } from "react";
import { MenuVisibilityContext } from "../../context/MenuVisibilityContext";
import { View, Text, ScrollArea, Hidden } from "reshaped";
import LayoutMenuModal from "../../components/LayoutMenuModal";
import ArticleItem from "../../components/ArticleItem";
import useArticleNavigation from "../../hooks/useArticleNavigation";
import type { SubmenuItemsMap } from "../../types";

interface Props {
  availableRoutes: SubmenuItemsMap;
}

const LayoutSubmenu = ({ availableRoutes }: Props) => {
  console.debug('[LayoutSubmenu] Rendering with routes:', availableRoutes);
  
  useEffect(() => {
    console.debug('[LayoutSubmenu] Component mounted');
    return () => {
      console.debug('[LayoutSubmenu] Component unmounted');
    };
  }, []);

  const { title, isArticle, routeItems } = useArticleNavigation(availableRoutes);
  const { isMenuVisible } = useContext(MenuVisibilityContext);

  if (!routeItems || routeItems.length <= 1) {
    console.debug('[LayoutSubmenu] No route items to display');
    return null;
  }

  return (
    <>
      <Hidden hide={{ s: isArticle || !isMenuVisible, l: !isMenuVisible }}>
        {(className) => (
          <View
            width={{ s: "100%", l: "240px", xl: "280px" }}
            height="100vh"
            backgroundColor="elevation-base"
            className={className}
            position="sticky"
            attributes={{ style: { top: 0 } }}
          >
            <ScrollArea
              scrollbarDisplay="hover"
              attributes={{ style: { height: "100%" } }}
            >
              <View padding={{ s: 4, l: 6 }} paddingBlock={3} gap={6}>
                <View direction="row" gap={4} align="center">
                  <Hidden hide={{ s: false, l: true }}>
                    <LayoutMenuModal />
                  </Hidden>
                </View>

                <View gap={1}>
                  {routeItems.map((item) => (
                    <ArticleItem
                      key={item.href}
                      title={item.title}
                      date={item.created}
                      href={item.href}
                    />
                  ))}
                </View>
              </View>
            </ScrollArea>
          </View>
        )}
      </Hidden>
    </>
  );
};

export default LayoutSubmenu;

"use client";

import { useContext } from "react";
import { MenuVisibilityContext } from "../../context/MenuVisibilityContext";
import { View, Text, ScrollArea, Hidden, } from "reshaped";
import LayoutMenuModal from "../../components/LayoutMenuModal";
import ArticleItem from "../../components/ArticleItem";
import useArticleNavigation from "../../hooks/useArticleNavigation";
import type { Props } from "./LayoutSubmenu.types";

const LayoutSubmenu = ({ availableRoutes }: Props) => {
  const { title, isArticle, routeItems } =
    useArticleNavigation(availableRoutes);
  const { isMenuVisible } = useContext(MenuVisibilityContext);

  if (!routeItems || routeItems.length <= 1) return null;

  const hideProps = {
    s: isArticle || !isMenuVisible,
    l: !isMenuVisible,
  };

  return (
    <>
      <Hidden hide={hideProps}>
        {(className) => (
          <View
            width={{ s: "100%", l: "320px", xl: "384px" }}
            height="100%"
            backgroundColor="elevation-base"
            className={className}
          >
            <ScrollArea scrollbarDisplay="hover">
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

"use client";

import { ReactNode, useContext } from "react";
import { MenuVisibilityContext } from "../../context/MenuVisibilityContext";
import { View, Hidden } from "reshaped";
import LayoutMenu from "../LayoutMenu";
import LayoutSubmenu from "../LayoutSubmenu";
import LayoutContent from "../LayoutContent";
import { getArticlesList } from "../../utilities/articles.server";

interface Props {
  children: ReactNode;
  availableRoutes: ReturnType<typeof getArticlesList>;
}

const LayoutContentWrapper = ({ children, availableRoutes }: Props) => {
  const { isMenuVisible } = useContext(MenuVisibilityContext);

  return (
    <View
      direction="row"
      divided
      height="100dvh"
      align="stretch"
      overflow="hidden"
    >
      <Hidden hide={{ s: true, l: !isMenuVisible }}>
        {(className) => (
          <View
            width={{ s: "240px", xl: "287px" }}
            height="100%"
            backgroundColor="elevation-base"
            className={className}
          >
            <LayoutMenu />
          </View>
        )}
      </Hidden>

      <Hidden hide={{ s: true, l: !isMenuVisible }}>
        <LayoutSubmenu availableRoutes={availableRoutes} />
      </Hidden>

      <LayoutContent availableRoutes={availableRoutes}>
        {children}
      </LayoutContent>
    </View>
  );
};

export default LayoutContentWrapper; 
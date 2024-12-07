"use client";

import { ReactNode } from "react";
import { View, ScrollArea } from "reshaped";
import type { SubmenuItemsMap } from "../../types";
import useArticleNavigation from "../../hooks/useArticleNavigation";

type Props = {
  children: ReactNode;
  availableRoutes: SubmenuItemsMap;
};

const LayoutContent = (props: Props) => {
  const { children, availableRoutes } = props;
  const { pathname } = useArticleNavigation(availableRoutes);

  return (
    <View grow height="100dvh" direction="column">
      <ScrollArea scrollbarDisplay="hover" key={pathname}>
        {children}
      </ScrollArea>
    </View>
  );
};

export default LayoutContent;

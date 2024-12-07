"use client";

import { useContext } from "react";
import { MenuVisibilityContext } from "../../context/MenuVisibilityContext";
import { Button } from "reshaped";
import { Book } from "react-feather";

const MenuToggleButton = () => {
  const { isMenuVisible, toggleMenuVisibility } = useContext(MenuVisibilityContext);

  return (
    <Button
      icon={Book}
      variant="ghost"
      color={!isMenuVisible ? "primary" : "neutral"}
      onClick={toggleMenuVisibility}
    />
  );
};

export default MenuToggleButton; 
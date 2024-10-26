import React, { createContext, useContext, useState } from "react";

const SidebarMenuContext = createContext();

export const useSidebarMenu = () => useContext(SidebarMenuContext);

export const SidebarMenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);

  return (
    <SidebarMenuContext.Provider value={{ menuItems, setMenuItems }}>
      {children}
    </SidebarMenuContext.Provider>
  );
};

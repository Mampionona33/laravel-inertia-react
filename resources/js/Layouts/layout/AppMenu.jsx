import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model = [
    {
      label: "Home",
      items: [
        // {
        //   label: "Dashboard",
        //   icon: "pi pi-fw pi-th-large",
        //   to: route("dashboard"),
        // },
        // { label: "Button", icon: "pi pi-fw pi-id-card", to: route("button") },
        {
          label: "Utilisateurs",
          icon: "pi pi-fw pi-users",
          to: route("users.index"),
        },
        {
          label: "Salles",
          icon: "pi pi-fw pi-home",
          to: route("salles.index"),
        },
        {
          label: "Reservations",
          icon: "pi pi-fw pi-calendar",
          to: route("reservations.index"),
        },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;

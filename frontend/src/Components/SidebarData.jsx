import React from "react";
import { useTranslation } from "react-i18next";
import "bootstrap-icons/font/bootstrap-icons.css";

export const SidebarData = () => {
  const { t } = useTranslation();

  return [
    {
      title: t("Home"),
      icon: <i className="bi bi-house-door"></i>,
      component: "Home",
    },
    {
      title: t("employees"),
      icon: <i className="bi bi-people"></i>,
      component: "Employees",
    },
    {
      title: t("mission_order"),
      icon: <i className="bi bi-ticket-detailed"></i>,
      component: "MissionOrder",
    },
    {
      title: t("Settings"),
      icon: <i className="bi bi-gear"></i>,
      component: "Settings",
    },
    {
      title: t("Printing"),
      icon: <i className="bi bi-printer"></i>,
      component: "Printing",
    },
    {
      title: t("About"),
      icon: <i className="bi bi-info-circle"></i>,
      component: "About",
    },
  ];
};

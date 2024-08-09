import React from "react";
import { useTranslation } from "react-i18next";
import "bootstrap-icons/font/bootstrap-icons.css";

export const SidebarData = () => {
  const { t } = useTranslation();

  return [
    {
      title: t("Home"),
      icon: <i className="bi bi-house-door"></i>,
      link: "/",
    },
    {
      title: t("employees"),
      icon: <i class="bi bi-people"></i>,
      link: "/employees",
    },
    {
      title: t("mission_order"),
      icon: <i class="bi bi-ticket-detailed"></i>,
      link: "/missionorder",
    },
    {
      title: t("Settings"),
      icon: <i className="bi bi-gear"></i>,
      link: "/settings",
    },
    {
      title: t("Printing"),
      icon: <i className="bi bi-printer"></i>,
      link: "/printing",
    },
    {
      title: t("About"),
      icon: <i class="bi bi-info-circle"></i>,
      link: "/about",
    },
  ];
};

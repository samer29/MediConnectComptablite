import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { SidebarData } from "./SidebarData";

function Sidebar({ setActiveComponent }) {
  const sidebarItems = SidebarData();

  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {sidebarItems.map((val, key) => {
          return (
            <li
              key={key}
              className="row"
              id={window.location.pathname === val.link ? "active" : ""}
              onClick={() => {
                setActiveComponent(val.component); // Change content without navigation
              }}
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;

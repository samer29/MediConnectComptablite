import { useNavigate } from "react-router-dom";
import "../App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Style/Sidebar.css";
import { SidebarData } from "./SidebarData"; // Assuming SidebarData is a function

function Sidebar() {
  const navigate = useNavigate();

  // SidebarData() is called to get the array
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
                navigate(val.link);
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

import React from "react";
import "../Style/Homepage.css";
import "../Style/Sidebar.css";
import Sidebar from "./Sidebar";
import NavigationBar from "./NavigationBar";

const Homepage = ({ setAuth }) => {
  return (
    <div className="main-div">
      <Sidebar />
      <NavigationBar setAuth={setAuth} />
    </div>
  );
};

export default Homepage;

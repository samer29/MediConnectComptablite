import React, { useState, Suspense } from "react";
import "../Style/Homepage.css";
import "../Style/Sidebar.css";
import Sidebar from "./Sidebar";
import NavigationBar from "./NavigationBar";
import CircleLoader from "../Tools/CircleLoader";

// Lazy load components
const HomeComponent = React.lazy(() => import("./HomeComponent"));
const EmployeesComponent = React.lazy(() => import("./EmployeesComponent"));
const MissionOrderComponent = React.lazy(() =>
  import("./MissionOrderComponent")
);
const SettingsComponent = React.lazy(() => import("./SettingsComponent"));
const PrintingComponent = React.lazy(() => import("./PrintingComponent"));
const AboutComponent = React.lazy(() => import("./AboutComponent"));

const Homepage = ({ setAuth }) => {
  const [activeComponent, setActiveComponent] = useState("Home"); // Default component
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Function to render the correct component based on state
  const renderContent = () => {
    switch (activeComponent) {
      case "Home":
        return <HomeComponent searchQuery={searchQuery} />;
      case "Employees":
        return <EmployeesComponent searchQuery={searchQuery} />;
      case "MissionOrder":
        return <MissionOrderComponent searchQuery={searchQuery} />;
      case "Settings":
        return <SettingsComponent searchQuery={searchQuery} />;
      case "Printing":
        return <PrintingComponent />;
      case "About":
        return <AboutComponent />;
      default:
        return <HomeComponent searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="main-div">
      <Sidebar setActiveComponent={setActiveComponent} />

      <div className="content-div">
        <NavigationBar setAuth={setAuth} setSearchQuery={setSearchQuery} />
        <div className="content">
          {/* Suspense will display a fallback UI while the component is loading */}
          <Suspense
            fallback={
              <div>
                <CircleLoader />
              </div>
            }
          >
            {renderContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

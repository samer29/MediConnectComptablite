import React from "react";
import "../Style/About.css";
import devimg from "../assets/MediConnect.png";
const AboutComponent = () => {
  return (
    <div className="main-div-about">
      <div class="big-circle"></div>
      <div className="top-container">
        <div className="welcome-container">
          <div className="writing-container">
            <text className="text-write">Hello,Welcome</text>
            <h1 className="text-h1">I m Samer Elouissi</h1>
            <h4>This is the creator and main dev for this application </h4>
          </div>
          <div className="rectangle-container">
            <img src={devimg} alt="devlogo"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;

import React from "react";
import "../Style/About.css";
import devimg from "../assets/MediConnect.png";
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

const AboutComponent = () => {
  function openLink(url) {
    window.open(url, "_blank");
  }
  return (
    <div className="main-div-about">
      <div class="big-circle"></div>
      <div className="top-container">
        <div className="welcome-container">
          <div className="writing-container">
            <text className="text-write">Hello,Welcome</text>
            <h1 className="text-h1">I m Samer Elouissi</h1>
            <h4>This is the creator and main dev for this application </h4>
            <div className="social-icons">
              <div
                className="iconrec"
                onClick={() => openLink("https://github.com/samer29")}
              >
                <a
                  href="https://dadixcod.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </a>
              </div>
              <div
                className="iconrec"
                onClick={() =>
                  openLink("https://www.linkedin.com/in/samerelouissi/")
                }
              >
                <a href="https://dadixcod.com" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
              </div>
              <div
                className="iconrec"
                onClick={() => openLink("https://x.com/Samer_Elouissi")}
              >
                <a href="https://dadixcod.com" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
              </div>
              <div
                className="iconrec"
                onClick={() =>
                  openLink("https://www.facebook.com/samer.elouissi/")
                }
              >
                <a href="https://dadixcod.com" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
              </div>
            </div>
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

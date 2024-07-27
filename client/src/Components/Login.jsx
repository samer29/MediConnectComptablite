import React from "react";
import "../Style/Login.css";
import man from "../assets/man.png";

const Login = () => {
  return (
    <div className="login">
      <div className="left-side">
        <div className="image-container">
          <img src={man} alt="man"></img>
        </div>
      </div>
      <div className="right-side">
        <p className="welcome">Welcome to MediConnect Accounter</p>
        <p className="sign-in-text">
          Please sign-in to your account and start the adventure
        </p>
        <div className="input-label">
          <label>Username</label>
          <input></input>
        </div>
        <div className="input-label">
          <label>Password</label>
          <input type="password"></input>
        </div>
        <button>Login</button>
      </div>
    </div>
  );
};

export default Login;

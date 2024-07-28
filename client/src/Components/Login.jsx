import React, { useState } from "react";
import "../Style/Login.css";
import man from "../assets/man.png";
import { loginUser } from "../Services/api.js";

function Login({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await loginUser(username, password);
      console.log("Login Successful", data);
      localStorage.setItem("token", data.token);
      setAuth(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login Failed, Please check your username and password";
      setError(errorMessage);
      console.log("Login Failed", err);
    }
  };

  return (
    <div className="login">
      <div className="left-side">
        <div className="image-container">
          <img src={man} alt="man" />
        </div>
      </div>
      <div className="right-side">
        <p className="welcome">Welcome to MediConnect Accounter</p>
        <p className="sign-in-text">
          Please sign-in to your account and start the adventure
        </p>
        <form onSubmit={handleSubmit} className="input-label">
          <div className="input-label">
            <label>Username</label>
            <input
              type="text"
              id="username"
              placeholder="UserName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-label">
            <label>Password</label>
            <input
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;

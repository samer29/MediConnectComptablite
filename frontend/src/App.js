import { Fragment, useState, useEffect } from "react";
import "./App.css";
import "./Services/i18n.js";
import "primereact/tabview";
import "./Services/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-datepicker/dist/react-datepicker.css";

import {
  Routes,
  BrowserRouter as Router,
  Route,
  Navigate,
} from "react-router-dom";
import Homepage from "./Components/Homepage";
import api from "./Services/api";
import Login from "./Components/Login.jsx";
import EtatDetails from "./Components/EtatMissions.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };
  async function isAuth() {
    try {
      const response = await api.get("/users/isverify", {
        headers: {
          token: localStorage.token,
        },
      });
      const parsRes = response.data;
      setIsAuthenticated(parsRes === true);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    isAuth();
  }, []);
  return (
    <div>
      <Fragment>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                isAuthenticated ? (
                  <Homepage setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
          <Routes>
            <Route
              path="/etat/:etatId"
              element={
                isAuthenticated ? <EtatDetails /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </Router>
      </Fragment>
    </div>
  );
}

export default App;

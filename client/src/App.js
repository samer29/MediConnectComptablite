import { Fragment, useState, useEffect } from "react";
import "./App.css";
import {
  Routes,
  BrowserRouter as Router,
  Route,
  Navigate,
} from "react-router-dom";
import Homepage from "./Components/Homepage";
import api from "./Services/api";
import Login from "./Components/Login.jsx";

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
        </Router>
      </Fragment>
    </div>
  );
}

export default App;

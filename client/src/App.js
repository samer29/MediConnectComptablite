import { Fragment } from "react";
import "./App.css";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./Components/Login";

function App() {
  return (
    <div>
      <Fragment>
        <Router>
          <Routes>
            <Route exact path="/login" element={<Login />} />
          </Routes>
        </Router>
      </Fragment>
    </div>
  );
}

export default App;

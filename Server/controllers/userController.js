const con = require("../db");
const jwtgenerator = require("../utils/jwtgenerator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./root.env" });

exports.getUsers = (req, res) => {
  try {
    const response = con.query("SELECT * FROM users", function (err, result) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
exports.editUser = (req, res) => {
  const id = req.params.id;
  const { username, password, grade } = req.body;
  try {
    const response = con.query(
      "UPDATE users SET username=?,password=?,grade=? WHERE ID=?",
      [username, password, grade, id],
      (err, result) => {
        if (err) {
          console.log("Error updating user:", err.message);
          res.status(500).send("edit error: " + err.message);
        } else {
          console.log(
            "User updated successfully. Rows affected:",
            result.affectedRows
          );
          res.status(200).json({
            message: "User updated successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {}
};
exports.insertUser = (req, res) => {
  const { username, password, grade } = req.body;

  try {
    const response = con.query(
      "INSERT INTO users (username,password,grade)values (?,?,?)",
      [username, password, grade],
      (err, result) => {
        if (err) {
          console.log("Error Inserting user:", err.message);
          res.status(500).send("Insert error: " + err.message);
        } else {
          res.status(200).json({
            message: "inserted user successfully",
          });
        }
      }
    );
  } catch (error) {}
};
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  try {
    const response = con.query(
      "DELETE FROM users WHERE ID=?",
      [id],
      (err, result) => {
        if (err) {
          console.log("Error deleting user:", err.message);
          res.status(500).send("Delete error: " + err.message);
        } else {
          console.log(
            "User deleted successfully. Rows affected:",
            result.affectedRows
          );
          res.status(200).json({
            message: "User deleted successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error in deleteUser:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};
// In SERVER/controllers/usercontroller.js
exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  try {
    con.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (err, result) => {
        if (err) {
          console.log("Error logging in:", err.message);
          res.status(500).send("Server Error");
        } else if (result.length > 0) {
          const token = jwtgenerator(result[0].ID);
          res.status(200).json({
            message: "Login successful",
            user: result[0],
            token,
          });
        } else {
          res.status(401).send("Invalid credentials");
        }
      }
    );
  } catch (error) {
    console.log("Error in loginUser:", error.message);
    res.status(500).send("Server Error");
  }
};
exports.authorizationfunc = async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    res.status(500).json("SERVER ERROR ");
  }
};
// In SERVER/controllers/userController.js

// Change the function name and update its implementation
exports.getUserById = async (req, res) => {
  const token = req.header("token");

  if (!token) {
    return res.status(400).send("Token not provided");
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const id = payload.user_id;

    if (!id) {
      return res.status(400).send("Invalid token payload: User ID not found");
    }

    con.query("SELECT * FROM users WHERE ID = ?", [id], (err, result) => {
      if (err) {
        console.log("Error retrieving user data:", err.message);
        return res.status(500).send("Server Error");
      } else if (result.length > 0) {
        return res.status(200).json({
          message: "User data retrieved successfully",
          user: result[0],
        });
      } else {
        return res.status(404).send("User not found");
      }
    });
  } catch (error) {
    console.log("Error in getUserById:", error.message);
    return res.status(500).send("Server Error");
  }
};

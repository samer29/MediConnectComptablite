const con = require("../db");

exports.getEmployee = (req, res) => {
  try {
    con.query("SELECT * FROM employee ORDER BY ID ASC", (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      } else {
        res.status(200).json({
          results: result.length,
          result,
        });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

exports.insertEmployee = (req, res) => {
  const { NomPrenom, Grade, Categorie, Compte, NCompte } = req.body;
  try {
    con.query(
      "INSERT INTO employee (NomPrenom, Grade, Categorie, Compte, NCompte) VALUES (?,?,?,?,?)",
      [NomPrenom, Grade, Categorie, Compte, NCompte],
      (err, result) => {
        if (err) {
          console.log("Error inserting employee:", err.message);
          res.status(500).send("Insert error: " + err.message);
        } else {
          res.status(200).json({
            message: "Employee inserted successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error inserting employee:", error.message);
    res.status(500).send("Insert error: " + error.message);
  }
};

exports.editEmployee = (req, res) => {
  const id = req.params.id;
  const { NomPrenom, Grade, Categorie, Compte, NCompte } = req.body;
  try {
    con.query(
      "UPDATE employee SET NomPrenom=?, Grade=?, Categorie=?, Compte=?, NCompte=? WHERE ID=?",
      [NomPrenom, Grade, Categorie, Compte, NCompte, id],
      (err, result) => {
        if (err) {
          console.log("Error updating employee:", err.message);
          res.status(500).send("Edit error: " + err.message);
        } else {
          res.status(200).json({
            message: "Employee updated successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error updating employee:", error.message);
    res.status(500).send("Edit error: " + error.message);
  }
};

exports.deleteEmployee = (req, res) => {
  const id = req.params.id;
  try {
    con.query("DELETE FROM employee WHERE ID=?", [id], (err, result) => {
      if (err) {
        console.log("Error deleting employee:", err.message);
        res.status(500).send("Delete error: " + err.message);
      } else {
        res.status(200).json({
          message: "Employee deleted successfully",
          affectedRows: result.affectedRows,
        });
      }
    });
  } catch (error) {
    console.log("Error in delete employee:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

const con = require("../db");

exports.getMandat = (req, res) => {
  try {
    con.query("SELECT * FROM mandat ORDER BY ID ASC", (err, result) => {
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

exports.insertMandat = (req, res) => {
  const { ID, Date, Montant } = req.body;
  try {
    con.query(
      "INSERT INTO mandat (ID, Date, Montant) VALUES (?,?,?)",
      [ID, Date, Montant],
      (err, result) => {
        if (err) {
          console.log("Error inserting mandat:", err.message);
          res.status(500).send("Insert error: " + err.message);
        } else {
          res.status(200).json({
            message: "Mandat inserted successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error inserting mandat:", error.message);
    res.status(500).send("Insert error: " + error.message);
  }
};

exports.editMandat = (req, res) => {
  const id = req.params.id;
  const { Date, Montant } = req.body;
  try {
    con.query(
      "UPDATE mandat SET Date=?, Montant=? WHERE ID=?",
      [Date, Montant, id],
      (err, result) => {
        if (err) {
          console.log("Error updating mandat:", err.message);
          res.status(500).send("Edit error: " + err.message);
        } else {
          res.status(200).json({
            message: "Mandat updated successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error updating mandat:", error.message);
    res.status(500).send("Edit error: " + error.message);
  }
};

exports.deleteMandat = (req, res) => {
  const id = req.params.id;
  try {
    con.query("DELETE FROM mandat WHERE ID=?", [id], (err, result) => {
      if (err) {
        console.log("Error deleting mandat:", err.message);
        res.status(500).send("Delete error: " + err.message);
      } else {
        res.status(200).json({
          message: "Mandat deleted successfully",
          affectedRows: result.affectedRows,
        });
      }
    });
  } catch (error) {
    console.log("Error in delete mandat:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

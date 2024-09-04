  const con = require("../db");

  exports.getGrades = (req, res) => {
    try {
      con.query("SELECT * FROM grades ORDER BY ID ASC", (err, result) => {
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

exports.insertGrades = (req, res) => {
  const { Grade } = req.body;
  try {
    con.query(
      "INSERT INTO grades (Grade) VALUES (?)",
      [Grade],
      (err, result) => {
        if (err) {
          console.log("Error inserting grade:", err.message);
          res.status(500).send("Insert error: " + err.message);
        } else {
          res.status(200).json({
            message: "Grade inserted successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error inserting grade:", error.message);
    res.status(500).send("Insert error: " + error.message);
  }
};

exports.editGrades = (req, res) => {
  const id = req.params.id;
  const { Grade } = req.body;
  try {
    con.query(
      "UPDATE grades SET Grade=? WHERE ID=?",
      [Grade, id],
      (err, result) => {
        if (err) {
          console.log("Error updating grade:", err.message);
          res.status(500).send("Edit error: " + err.message);
        } else {
          res.status(200).json({
            message: "Grade updated successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error updating grade:", error.message);
    res.status(500).send("Edit error: " + error.message);
  }
};

exports.deleteGrades = (req, res) => {
  const id = req.params.id;
  try {
    con.query("DELETE FROM grades WHERE ID=?", [id], (err, result) => {
      if (err) {
        console.log("Error deleting grade:", err.message);
        res.status(500).send("Delete error: " + err.message);
      } else {
        res.status(200).json({
          message: "Grade deleted successfully",
          affectedRows: result.affectedRows,
        });
      }
    });
  } catch (error) {
    console.log("Error in delete grade:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

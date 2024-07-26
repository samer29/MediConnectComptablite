const con = require("../db");

exports.getBudgetdetail = (req, res) => {
  try {
    con.query("SELECT * FROM budgetdetail ORDER BY ID ASC", (err, result) => {
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

exports.insertBudgetdetail = (req, res) => {
  const { NouveauSolde, MontantOperation, AncienSolde, Type, Date } = req.body;
  try {
    con.query(
      "INSERT INTO budgetdetail (NouveauSolde, MontantOperation, AncienSolde, Type, Date) VALUES (?,?,?,?,?)",
      [NouveauSolde, MontantOperation, AncienSolde, Type, Date],
      (err, result) => {
        if (err) {
          console.log("Error inserting budgetdetail:", err.message);
          res.status(500).send("Insert error: " + err.message);
        } else {
          res.status(200).json({
            message: "Budgetdetail inserted successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error inserting budgetdetail:", error.message);
    res.status(500).send("Insert error: " + error.message);
  }
};

exports.editBudgetdetail = (req, res) => {
  const id = req.params.id;
  const { IDBudget, NouveauSolde, MontantOperation, AncienSolde, Type, Date } =
    req.body;
  try {
    con.query(
      "UPDATE budgetdetail SET IDBudget=?, NouveauSolde=?, MontantOperation=?, AncienSolde=?, Type=?, Date=? WHERE ID=?",
      [IDBudget, NouveauSolde, MontantOperation, AncienSolde, Type, Date, id],
      (err, result) => {
        if (err) {
          console.log("Error updating budgetdetail:", err.message);
          res.status(500).send("Edit error: " + err.message);
        } else {
          res.status(200).json({
            message: "Budgetdetail updated successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error updating budgetdetail:", error.message);
    res.status(500).send("Edit error: " + error.message);
  }
};

exports.deleteBudgetdetail = (req, res) => {
  const id = req.params.id;
  try {
    con.query("DELETE FROM budgetdetail WHERE ID=?", [id], (err, result) => {
      if (err) {
        console.log("Error deleting budgetdetail:", err.message);
        res.status(500).send("Delete error: " + err.message);
      } else {
        res.status(200).json({
          message: "Budgetdetail deleted successfully",
          affectedRows: result.affectedRows,
        });
      }
    });
  } catch (error) {
    console.log("Error in delete budgetdetail:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

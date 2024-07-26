const con = require("../db");

exports.getBudget = (req, res) => {
  try {
    con.query("SELECT * FROM budget ORDER BY ID ASC", (err, result) => {
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

exports.insertBudget = (req, res) => {
  const { Nature, Titre, Chapitre, Article, Montant } = req.body;
  try {
    con.query(
      "INSERT INTO budget (Nature, Titre, Chapitre, Article, Montant) VALUES (?,?,?,?,?)",
      [Nature, Titre, Chapitre, Article, Montant],
      (err, result) => {
        if (err) {
          console.log("Error inserting budget:", err.message);
          res.status(500).send("Insert error: " + err.message);
        } else {
          res.status(200).json({
            message: "Budget inserted successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error inserting budget:", error.message);
    res.status(500).send("Insert error: " + error.message);
  }
};

exports.editBudget = (req, res) => {
  const id = req.params.id;
  const { Nature, Titre, Chapitre, Article, Montant } = req.body;
  try {
    con.query(
      "UPDATE budget SET Nature=?, Titre=?, Chapitre=?, Article=?, Montant=? WHERE ID=?",
      [Nature, Titre, Chapitre, Article, Montant, id],
      (err, result) => {
        if (err) {
          console.log("Error updating budget:", err.message);
          res.status(500).send("Edit error: " + err.message);
        } else {
          res.status(200).json({
            message: "Budget updated successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error updating budget:", error.message);
    res.status(500).send("Edit error: " + error.message);
  }
};

exports.deleteBudget = (req, res) => {
  const id = req.params.id;
  try {
    con.query("DELETE FROM budget WHERE ID=?", [id], (err, result) => {
      if (err) {
        console.log("Error deleting budget:", err.message);
        res.status(500).send("Delete error: " + err.message);
      } else {
        res.status(200).json({
          message: "Budget deleted successfully",
          affectedRows: result.affectedRows,
        });
      }
    });
  } catch (error) {
    console.log("Error in delete budget:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

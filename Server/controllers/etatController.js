const con = require("../db");

exports.getEtat = (req, res) => {
  try {
    con.query("SELECT * FROM etat ORDER BY ID ASC", (err, result) => {
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
exports.insertEtat = (req, res) => {
  const { NomPrenom, MontantTotal } = req.body;
  console.log("Received data:", { NomPrenom, MontantTotal });
  try {
    con.query(
      "INSERT INTO etat (NomPrenom, MontantTotal) VALUES (?,?)",
      [NomPrenom, MontantTotal],
      (err, result) => {
        if (err) {
          console.log("Error inserting etat:", err.message);
          res.status(500).send("Insert error: " + err.message);
        } else {
          res.status(200).json({
            message: "Etat inserted successfully",
            id: result.insertId,
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error inserting etat:", error.message);
    res.status(500).send("Insert error: " + error.message);
  }
};

exports.editEtat = (req, res) => {
  const id = req.params.id;
  const { NomPrenom, MontantTotal } = req.body;

  // Fetch the current data for the etat
  try {
    con.query("SELECT * FROM etat WHERE ID=?", [id], (err, result) => {
      if (err) {
        console.log("Error fetching etat:", err.message);
        res.status(500).send("Fetch error: " + err.message);
      } else if (result.length === 0) {
        res.status(404).send("Etat not found");
      } else {
        // Fill missing fields with current values from the database
        const currentData = result[0];
        const updatedData = {
          NomPrenom: NomPrenom || currentData.NomPrenom,
          MontantTotal: MontantTotal || currentData.MontantTotal,
        };

        // Update the etat with the provided values or keep the existing ones
        con.query(
          "UPDATE etat SET NomPrenom=?, MontantTotal=? WHERE ID=?",
          [updatedData.NomPrenom, updatedData.MontantTotal, id],
          (err, result) => {
            if (err) {
              console.log("Error updating etat:", err.message);
              res.status(500).send("Edit error: " + err.message);
            } else {
              res.status(200).json({
                message: "Etat updated successfully",
                affectedRows: result.affectedRows,
              });
            }
          }
        );
      }
    });
  } catch (error) {
    console.log("Error updating etat:", error.message);
    res.status(500).send("Edit error: " + error.message);
  }
};

exports.deleteEtat = (req, res) => {
  const id = req.params.id;
  try {
    con.query("DELETE FROM etat WHERE ID=?", [id], (err, result) => {
      if (err) {
        console.log("Error deleting etat:", err.message);
        res.status(500).send("Delete error: " + err.message);
      } else if (result.affectedRows === 0) {
        // Handle case where no rows were deleted
        console.log("No etat found with ID:", id);
        res.status(404).send("Etat not found");
      } else {
        res.status(200).json({
          message: "Etat deleted successfully",
          affectedRows: result.affectedRows,
        });
      }
    });
  } catch (error) {
    console.log("Error in delete etat:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

exports.getEtatById = (req, res) => {
  const id = req.params.id;
  try {
    con.query("SELECT * FROM etat WHERE ID=?", [id], (err, result) => {
      if (err) {
        console.log("Error fetching etat by ID:", err.message);
        res.status(500).send("Fetch error: " + err.message);
      } else if (result.length === 0) {
        res.status(404).send("Etat not found");
      } else {
        res.status(200).json(result[0]); // Return the single etat object
      }
    });
  } catch (error) {
    console.log("Error fetching etat by ID:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};

exports.getEtatByNomPrenom = (req, res) => {
  const nomPrenom = req.params.nomPrenom;
  try {
    con.query(
      "SELECT * FROM etat WHERE NomPrenom = ?",
      [nomPrenom],
      (err, result) => {
        if (err) {
          console.log("Error fetching etat:", err.message);
          res.status(500).send("Server Error");
        } else if (result.length === 0) {
          res.status(404).send("Etat not found");
        } else {
          res.status(200).json(result[0]);
        }
      }
    );
  } catch (error) {
    console.log("Error fetching etat:", error.message);
    res.status(500).send("Server Error");
  }
};

// New function to get missions by employee name
exports.getEmployeeEtats = (req, res) => {
  const { id } = req.params;
  try {
    con.query(
      "SELECT Num,EmployeeId,ordremission.NomPrenom,NomPrenomArabic,NumMandat,DateDepart,HeureDepart,DateRetour,HeureRetour,Destination,PriseEnCharge,NbrDejeuner,DecompteDejuner,NbrDiner,DecompteDiner,NbrDecoucher,DecompteDecoucher,Total,NetAPayer,etat.MontantTotal,etat.ID,employee.Grade,employee.Categorie,employee.Compte,employee.NCompte  FROM ordremission  JOIN etat ON ordremission.NumMandat = etat.ID JOIN employee ON ordremission.EmployeeId = employee.ID WHERE etat.ID = ?",

      [id],
      (err, result) => {
        if (err) {
          console.log("Error fetching employee etats:", err.message);
          return res.status(500).json({ error: "Failed to retrieve data" });
        }
        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

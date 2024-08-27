const con = require("../db");

// Get all ordremissions
exports.getOrdremission = (req, res) => {
  try {
    con.query(
      "SELECT * FROM ordremission ORDER BY Num ASC",
      function (err, result) {
        if (err) {
          console.log(err.message);
          res.status(500).send("Server Error");
        } else {
          res.status(200).json({
            results: result.length,
            result,
          });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

// Edit ordremission
exports.editOrdremission = (req, res) => {
  const id = req.params.id;
  const {
    EmployeeId,
    NomPrenom,
    NumMandat,
    DateDepart,
    HeureDepart,
    DateRetour,
    HeureRetour,
    Destination,
    PriseEnCharge,
    Motif,
    VehiculePersonnel,
    NbrDejeuner,
    DecompteDejuner,
    NbrDiner,
    DecompteDiner,
    NbrDecoucher,
    DecompteDecoucher,
    DecompteTransport,
    Kilometrage,
    Total,
    NetAPayer,
  } = req.body;
  try {
    con.query(
      "UPDATE ordremission SET EmployeeId = ? ,  NomPrenom=?, NumMandat=?, DateDepart=?, HeureDepart=?, DateRetour=?, HeureRetour=?, Destination=?, PriseEnCharge=?, Motif=?, VehiculePersonnel=?, NbrDejeuner=?, DecompteDejuner=?, NbrDiner=?, DecompteDiner=?, NbrDecoucher=?, DecompteDecoucher=?, DecompteTransport=?, Kilometrage=?, Total=?, NetAPayer=? WHERE Num=?",
      [
        EmployeeId,
        NomPrenom,
        NumMandat,
        DateDepart,
        HeureDepart,
        DateRetour,
        HeureRetour,
        Destination,
        PriseEnCharge,
        Motif,
        VehiculePersonnel,
        NbrDejeuner,
        DecompteDejuner,
        NbrDiner,
        DecompteDiner,
        NbrDecoucher,
        DecompteDecoucher,
        DecompteTransport,
        Kilometrage,
        Total,
        NetAPayer,
        id,
      ],
      (err, result) => {
        if (err) {
          console.log("Error updating Ordremission:", err.message);
          res.status(500).send("Edit error: " + err.message);
        } else {
          res.status(200).json({
            message: "Ordremission updated successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error updating Ordremission:", error.message);
    res.status(500).send("Edit error: " + error.message);
  }
};
exports.selectNomfromOrder = (req, res) => {
  try {
    const query =
      "SELECT DISTINCT NomPrenom FROM ordremission ORDER BY NomPrenom ASC";
    con.query(query, [], (err, result) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({ error: "Failed to retrieve data" });
      }
      res.json(result);
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Insert ordremission
exports.insertOrdremission = (req, res) => {
  const {
    Num,
    EmployeeId,
    NomPrenom,
    NumMandat,
    DateDepart,
    HeureDepart,
    DateRetour,
    HeureRetour,
    Destination,
    PriseEnCharge,
    Motif,
    VehiculePersonnel,
    NbrDejeuner,
    DecompteDejuner,
    NbrDiner,
    DecompteDiner,
    NbrDecoucher,
    DecompteDecoucher,
    DecompteTransport,
    Kilometrage,
    Total,
    NetAPayer,
  } = req.body;
  try {
    con.query(
      "INSERT INTO ordremission (Num, EmployeeId ,  NomPrenom, NumMandat, DateDepart, HeureDepart, DateRetour, HeureRetour, Destination, PriseEnCharge, Motif, VehiculePersonnel, NbrDejeuner, DecompteDejuner, NbrDiner, DecompteDiner, NbrDecoucher, DecompteDecoucher, DecompteTransport, Kilometrage, Total, NetAPayer) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        Num,
        EmployeeId,
        NomPrenom,
        NumMandat,
        DateDepart,
        HeureDepart,
        DateRetour,
        HeureRetour,
        Destination,
        PriseEnCharge,
        Motif,
        VehiculePersonnel,
        NbrDejeuner,
        DecompteDejuner,
        NbrDiner,
        DecompteDiner,
        NbrDecoucher,
        DecompteDecoucher,
        DecompteTransport,
        Kilometrage,
        Total,
        NetAPayer,
      ],
      (err, result) => {
        if (err) {
          console.log("Error inserting ordremission:", err.message);
          res.status(500).send("Insert error: " + err.message);
        } else {
          res.status(200).json({
            message: "Ordremission inserted successfully",
            affectedRows: result.affectedRows,
          });
        }
      }
    );
  } catch (error) {
    console.log("Error inserting Ordremission:", error.message);
    res.status(500).send("Insert error: " + error.message);
  }
};

// Delete ordremission
exports.deleteOrdremission = (req, res) => {
  const id = req.params.id;
  try {
    con.query("DELETE FROM ordremission WHERE Num=?", [id], (err, result) => {
      if (err) {
        console.log("Error deleting Ordremission:", err.message);
        res.status(500).send("Delete error: " + err.message);
      } else {
        res.status(200).json({
          message: "Ordremission deleted successfully",
          affectedRows: result.affectedRows,
        });
      }
    });
  } catch (error) {
    console.log("Error in delete Ordremission:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
};
// In your controller file (e.g., controllers/ordremissionController.js)

// New function to get missions by employee name
exports.getEmployeeMissions = (req, res) => {
  const { NomPrenom } = req.query;
  if (!NomPrenom) {
    return res.status(400).json({ error: "NomPrenom is required" });
  }

  try {
    con.query(
      "SELECT * FROM ordremission WHERE NomPrenom = ?",
      [NomPrenom],
      (err, result) => {
        if (err) {
          console.log("Error fetching employee missions:", err.message);
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
// In your controller file (e.g., ordremissionController.js)
exports.updateNumMandat = (req, res) => {
  const { num } = req.params;
  const { NumMandat } = req.body;

  if (!NumMandat) {
    return res.status(400).json({ error: "NumMandat is required" });
  }

  try {
    con.query(
      "UPDATE ordremission SET NumMandat = ? WHERE Num = ?",
      [NumMandat, num],
      (err, result) => {
        if (err) {
          console.error("Error updating NumMandat:", err.message);
          return res.status(500).json({ error: "Failed to update NumMandat" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Mission not found" });
        }
        res.status(200).json({ message: "NumMandat updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
exports.updateDeleteNumMandat = (req, res) => {
  const { num } = req.params;
  try {
    con.query(
      "UPDATE ordremission SET NumMandat = 0 WHERE Num = ?",
      [num],
      (err, result) => {
        if (err) {
          console.error("Error updating NumMandat:", err.message);
          return res.status(500).json({ error: "Failed to update NumMandat" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Mission not found" });
        }
        res.status(200).json({ message: "NumMandat updated successfully" });
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getMissionAndNumMandat = (req, res) => {
  const { NomPrenom } = req.query;
  const { NumMandat } = req.params;

  // Input validation
  if (!NomPrenom || !NumMandat) {
    return res.status(400).json({ error: "Missing NomPrenom or NumMandat" });
  }

  try {
    con.query(
      "SELECT * FROM ordremission WHERE NomPrenom = ? AND NumMandat=?",
      [NomPrenom, NumMandat],
      (err, result) => {
        if (err) {
          console.log("Error fetching employee missions:", err.message);
          return res.status(500).json({ error: "Failed to retrieve data" });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ error: "No missions found for the given criteria" });
        }

        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getNomPrenomFromOM = (req, res) => {
  const { num } = req.params;

  // Input validation
  if (!num) {
    return res.status(400).json({ error: "Missing Num parameter" });
  }

  try {
    con.query(
      "SELECT NomPrenom FROM ordremission WHERE Num = ?",
      [num],
      (err, result) => {
        if (err) {
          console.log("Error fetching NomPrenom:", err.message);
          return res.status(500).json({ error: "Failed to retrieve data" });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ error: "No NomPrenom found for the given Num" });
        }

        res.status(200).json(result[0]); // Assuming we want to return a single object with the NomPrenom
      }
    );
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

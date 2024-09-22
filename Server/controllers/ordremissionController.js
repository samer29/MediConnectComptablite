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

// Edit a specific ordremission
exports.editOrdremission = (req, res) => {
  const id = req.params.id;
  const {
    NomPrenom,
    DateDepart,
    HeureDepart,
    DateRetour,
    HeureRetour,
    NbrDejeuner,
    DecompteDejuner,
    NbrDiner,
    DecompteDiner,
    NbrDecoucher,
    DecompteDecoucher,
    NetAPayer,
  } = req.body;

  // Step 1: Fetch the existing record
  con.query("SELECT * FROM ordremission WHERE Num = ?", [id], (err, result) => {
    if (err) {
      console.log("Error fetching Ordremission:", err.message);
      return res.status(500).send("Fetch error: " + err.message);
    }

    if (result.length === 0) {
      return res.status(404).send("Record not found");
    }

    const existingRecord = result[0];

    // Step 2: Create the updated fields object
    const updatedFields = {
      NomPrenom: NomPrenom || existingRecord.NomPrenom,
      DateDepart: DateDepart || existingRecord.DateDepart,
      HeureDepart: HeureDepart || existingRecord.HeureDepart,
      DateRetour: DateRetour || existingRecord.DateRetour,
      HeureRetour: HeureRetour || existingRecord.HeureRetour,
      NbrDejeuner: NbrDejeuner || existingRecord.NbrDejeuner,
      DecompteDejuner: DecompteDejuner || existingRecord.DecompteDejuner,
      NbrDiner: NbrDiner || existingRecord.NbrDiner,
      DecompteDiner: DecompteDiner || existingRecord.DecompteDiner,
      NbrDecoucher: NbrDecoucher || existingRecord.NbrDecoucher,
      DecompteDecoucher: DecompteDecoucher || existingRecord.DecompteDecoucher,
      NetAPayer: NetAPayer || existingRecord.NetAPayer,
    };

    // Step 3: Update the record
    con.query(
      "UPDATE ordremission SET ? WHERE Num = ?",
      [updatedFields, id],
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
  });
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
// controllers/ordremissionController.js

// New function to get missions by etatId
exports.getMissionsByEtatId = (req, res) => {
  const { etatId } = req.query;

  if (!etatId) {
    return res.status(400).json({ error: "etatId is required" });
  }

  try {
    // Fetch missions based on etatId
    con.query(
      "SELECT * FROM ordremission WHERE EtatId = ?",
      [etatId],
      (err, result) => {
        if (err) {
          console.error("Error fetching missions:", err.message);
          return res.status(500).json({ error: "Failed to retrieve data" });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ error: "No missions found for the given etatId" });
        }

        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMissionOrderByNum = (req, res) => {
  const { id } = req.params; // Get the id from the URL parameters

  if (!id) {
    return res.status(400).json({ error: "Num is required" });
  }

  try {
    con.query(
      "SELECT * FROM ordremission WHERE Num = ?",
      [id], // Use the id here
      (err, result) => {
        if (err) {
          console.log("Error fetching mission order:", err.message);
          return res.status(500).json({ error: "Failed to retrieve data" });
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "Mission not found" });
        }

        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
const calculateMealsFunction = (
  dateDepart,
  heureDepart,
  dateRetour,
  heureRetour
) => {
  const start = new Date(`${dateDepart}T${heureDepart}`);
  const end = new Date(`${dateRetour}T${heureRetour}`);

  let dejeuner = 0;
  let diner = 0;
  let decoucher = 0;

  // First day logic
  if (start.getHours() <= 12) {
    dejeuner += 1;
  }
  if (start.getHours() <= 18) {
    diner += 1;
  }

  // Full days in between
  let totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  if (totalDays === 0 && start.getDate() !== end.getDate()) {
    totalDays += 1;
  }

  if (totalDays > 0) {
    dejeuner += totalDays;
    diner += totalDays;
    decoucher += totalDays;

    if (start.getHours() > 12) {
      dejeuner -= 1;
    }
    if (start.getHours() > 18) {
      diner -= 1;
    }
    if (end.getHours() < 12) {
      dejeuner -= 1;
    }
    if (end.getHours() < 18) {
      diner -= 1;
    }
  } else {
    if (end.getHours() < 18) {
      diner -= 1;
    }
  }

  if (totalDays > 0 || end.getDate() !== start.getDate()) {
    decoucher = totalDays;
  }

  return { dejeuner, diner, decoucher };
};
exports.calculateMeals = (req, res) => {
  const { dateDepart, heureDepart, dateRetour, heureRetour } = req.body;

  if (!dateDepart || !heureDepart || !dateRetour || !heureRetour) {
    return res
      .status(400)
      .json({ error: "All date and time fields are required" });
  }

  const result = calculateMealsFunction(
    dateDepart,
    heureDepart,
    dateRetour,
    heureRetour
  );

  res.json(result);
};

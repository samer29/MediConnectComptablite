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
    NomPrenom,
    NumMandat,
    DateDepart,
    HeureDepart,
    DateRetour,
    HeureRetour,
    Destination,
    PriseEnCharge,
    Motif,
    Accompagnateur,
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
      "UPDATE ordremission SET NomPrenom=?, NumMandat=?, DateDepart=?, HeureDepart=?, DateRetour=?, HeureRetour=?, Destination=?, PriseEnCharge=?, Motif=?, Accompagnateur=?, VehiculePersonnel=?, NbrDejeuner=?, DecompteDejuner=?, NbrDiner=?, DecompteDiner=?, NbrDecoucher=?, DecompteDecoucher=?, DecompteTransport=?, Kilometrage=?, Total=?, NetAPayer=? WHERE Num=?",
      [
        NomPrenom,
        NumMandat,
        DateDepart,
        HeureDepart,
        DateRetour,
        HeureRetour,
        Destination,
        PriseEnCharge,
        Motif,
        Accompagnateur,
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

// Insert ordremission
exports.insertOrdremission = (req, res) => {
  const {
    Num,
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
      "INSERT INTO ordremission (Num, NomPrenom, NumMandat, DateDepart, HeureDepart, DateRetour, HeureRetour, Destination, PriseEnCharge, Motif, VehiculePersonnel, NbrDejeuner, DecompteDejuner, NbrDiner, DecompteDiner, NbrDecoucher, DecompteDecoucher, DecompteTransport, Kilometrage, Total, NetAPayer) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        Num,
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

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../Services/api";
import { useTranslation } from "react-i18next";
import wilayasAlgeria from "../Wilaya_Of_Algeria.json";
const AddMissionOrderModal = ({
  fetchEmployees,
  setModalShow,
  modalShow,
  currentMissionOrder,
}) => {
  const { t } = useTranslation();
  const [num, setNum] = useState("");
  const [nomPrenom, setNomPrenom] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [heureDepart, setHeureDepart] = useState("");
  const [dateRetour, setDateRetour] = useState("");
  const [heureRetour, setHeureRetour] = useState("");
  const [destination, setDestination] = useState("");
  const [priseEnCharge, setPriseEnCharge] = useState("");
  const [motif, setMotif] = useState("");
  const [vehiculePersonnel, setVehiculePersonnel] = useState("");
  const [nbrDejeuner, setNbrDejeuner] = useState(0);
  const [decompteDejeuner, setDecompteDejeuner] = useState(0);
  const [nbrDiner, setNbrDiner] = useState(0);
  const [decompteDiner, setDecompteDiner] = useState(0);
  const [nbrDecoucher, setNbrDecoucher] = useState(0);
  const [decompteDecoucher, setDecompteDecoucher] = useState(0);
  const [decompteTransport, setDecompteTransport] = useState(0);
  const [kilometrage, setKilometrage] = useState(0);
  const [total, setTotal] = useState(0.0);
  const [netAPayer, setNetAPayer] = useState(0.0);
  const [categorie, setCategorie] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState(""); // New state for selected ID
  const [selectedWilaya, setselectedWilaya] = useState("");

  useEffect(() => {
    if (currentMissionOrder) {
      setNum(currentMissionOrder.Num);
      setNomPrenom(currentMissionOrder.NomPrenom);
      setDateDepart(currentMissionOrder.DateDepart);
      setHeureDepart(currentMissionOrder.HeureDepart);
      setDateRetour(currentMissionOrder.DateRetour);
      setHeureRetour(currentMissionOrder.HeureRetour);
      setDestination(currentMissionOrder.Destination);
      setPriseEnCharge(currentMissionOrder.PriseEnCharge);
      setMotif(currentMissionOrder.Motif);
      setVehiculePersonnel(currentMissionOrder.VehiculePersonnel);
      setNbrDejeuner(currentMissionOrder.NbrDejeuner);
      setDecompteDejeuner(currentMissionOrder.DecompteDejuner);
      setNbrDiner(currentMissionOrder.NbrDiner);
      setDecompteDiner(currentMissionOrder.DecompteDiner);
      setNbrDecoucher(currentMissionOrder.NbrDecoucher);
      setDecompteDecoucher(currentMissionOrder.DecompteDecoucher);
      setDecompteTransport(currentMissionOrder.DecompteTransport);
      setKilometrage(currentMissionOrder.Kilometrage);
      setTotal(currentMissionOrder.Total);
      setNetAPayer(currentMissionOrder.NetAPayer);
    } else {
      clearForm();
    }
  }, [currentMissionOrder]);

  const clearForm = () => {
    setNum("");
    setNomPrenom("");
    setDateDepart("");
    setHeureDepart("");
    setDateRetour("");
    setHeureRetour("");
    setDestination("");
    setPriseEnCharge("");
    setMotif("");
    setVehiculePersonnel("");
    setNbrDejeuner(0);
    setDecompteDejeuner(0);
    setNbrDiner(0);
    setDecompteDiner(0);
    setNbrDecoucher(0);
    setDecompteDecoucher(0);
    setDecompteTransport(0);
    setKilometrage(0);
    setTotal(0);
    setNetAPayer(0);
  };
  // Function to calculate the number of Dejeuner, Diner, and Decoucher
  const calculateNbrDejeuner = () => {
    const start = new Date(`${dateDepart}T${heureDepart}`);
    console.log("start", start);
    const end = new Date(`${dateRetour}T${heureRetour}`);
    console.log("end ", end);
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
    console.log("total days : ", totalDays);

    if (totalDays === 0) {
      if (end.getHours() < 18) {
        diner -= 1;
      }
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
    }

    // Calculate Decoucher (Ensure only one night is added)
    if (totalDays > 0 || end.getDate() !== start.getDate()) {
      decoucher = totalDays; // Number of full nights in between
    }

    setNbrDejeuner(dejeuner);
    setNbrDiner(diner);
    setNbrDecoucher(decoucher);

    // Log for debugging
    console.log(
      "Dejeuner:",
      dejeuner,
      "Diner:",
      diner,
      "Decoucher:",
      decoucher
    );
  };

  // Function to calculate the NetAPayer
  const calculateNetAPayer = () => {
    calculateNbrDejeuner(); // Ensure the meal counts are updated first

    let newDecompteDejeuner = 0;
    let newDecompteDiner = 0;
    let newDecompteDecoucher = 0;

    // Ensure categorie is properly set before calculations
    if (categorie !== null) {
      if (categorie >= 1 && categorie <= 10) {
        newDecompteDejeuner = 600 * nbrDejeuner;
        newDecompteDiner = 600 * nbrDiner;
        newDecompteDecoucher = 2400 * nbrDecoucher;
      } else if (categorie >= 11 && categorie <= 17) {
        newDecompteDejeuner = 800 * nbrDejeuner;
        newDecompteDiner = 800 * nbrDiner;
        newDecompteDecoucher = 3200 * nbrDecoucher;
      } else if (categorie > 17) {
        newDecompteDejeuner = 1600 * nbrDejeuner;
        newDecompteDiner = 1600 * nbrDiner;
        newDecompteDecoucher = 6400 * nbrDecoucher;
      }

      setDecompteDejeuner(newDecompteDejeuner);
      setDecompteDiner(newDecompteDiner);
      setDecompteDecoucher(newDecompteDecoucher);

      let total =
        newDecompteDejeuner +
        newDecompteDiner +
        newDecompteDecoucher +
        decompteTransport;
      let net = 0;
      if (priseEnCharge === "Yes") {
        net = total * 0.25;
      } else {
        net = total;
      }
      setNetAPayer(net);
      setTotal(total);

      // Log for debugging
      console.log("Net à Payer:", net);
    }
  };



  useEffect(() => {
    const fetchEmployeesData = async () => {
      try {
        const response = await api.get("/employee");
        const employeList = response.data.result; // No need for JSON.parse here
        setEmployees(employeList);
      } catch (error) {
        console.error("Error fetching employees data:", error);
        Swal.fire({
          title: t("Error"),
          text: t("Error_Fetching_Employee"),
          icon: "error",
        });
      }
    };

    fetchEmployeesData();
  }, []);

  const handleEmployeeChange = (e) => {
    const selectedID = parseInt(e.target.value, 10);
    const selectedEmployee = employees.find((emp) => emp.ID === selectedID);

    if (selectedEmployee) {
      setSelectedEmployeeID(selectedID); // Set the selected employee's ID
      setNomPrenom(selectedEmployee.NomPrenom);
      setCategorie(selectedEmployee.Categorie);
    }
  };
  useEffect(() => {
    if (categorie !== null) {
      console.log("Category updated:", categorie);
    }
  }, [categorie]);
  useEffect(() => {
    calculateNetAPayer(); // Run NetAPayer calculation after nbrDejeuner, nbrDiner, nbrDecoucher change
  }, [nbrDejeuner, nbrDiner, nbrDecoucher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateNbrDejeuner();
    calculateNetAPayer();
    setTimeout(async () => {
      const ordremission = {
        Num: num,
        NomPrenom: nomPrenom,
        NumMandat: currentMissionOrder?.NumMandat || "", // Assuming NumMandat is part of currentMissionOrder
        DateDepart: dateDepart,
        HeureDepart: heureDepart,
        DateRetour: dateRetour,
        HeureRetour: heureRetour,
        Destination: destination,
        PriseEnCharge: priseEnCharge,
        Motif: motif,
        VehiculePersonnel: vehiculePersonnel,
        NbrDejeuner: nbrDejeuner,
        DecompteDejuner: decompteDejeuner,
        NbrDiner: nbrDiner,
        DecompteDiner: decompteDiner,
        NbrDecoucher: nbrDecoucher,
        DecompteDecoucher: decompteDecoucher,
        DecompteTransport: decompteTransport,
        Kilometrage: kilometrage,
        Total: total,
        NetAPayer: netAPayer,
      };

      try {
        const start = new Date(`${dateDepart}T${heureDepart}`);
        const end = new Date(`${dateRetour}T${heureRetour}`);
        if (end < start) {
          Swal.fire({
            title: t("Error"),
            text: t("DateRetourAfterDateDepart"),
            icon: "error",
          });
        } else {
          const response = await api.post("/ordremission", ordremission);
          if (response.status === 200) {
            Swal.fire({
              title: t("Success"),
              text: t("OrdreMission_Added_Successfully"),
              icon: "success",
            }).then(() => {
              setModalShow(false); // Close the modal
              fetchEmployees(); // Refresh the list of budgets
            });
          } else {
            throw new Error(response.data.message || "Unknown error occurred");
          }
        }
      } catch (error) {
        console.error("Error inserting ordremission:", error.response.data);
        Swal.fire({
          title: t("Error"),
          text: t("Error_Adding_Or_Updating_OrderMission"),
          icon: "error",
        });
      }
    }, 1000); // Wait for 1 second to ensure calculations are completed
  };

  return (
    <div>
      <Modal
        size="lg"
        show={modalShow}
        onHide={() => setModalShow(false)}
        dialogClassName="custom-modal-width"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Add_New_OrderMission")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="row my-3">
              <div className="col">
                <label htmlFor="NumOrdreMission">{t("NumOrdreMission")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="NumOrdreMission"
                  value={num}
                  onChange={(e) => setNum(e.target.value)} // Update the state on change
                  required
                />
              </div>
            </div>
            <div className="row my-3">
              <div className="col">
                <label htmlFor="employee-select">{t("Select_Employee")}</label>
                <select
                  id="employee-select"
                  className="form-control"
                  value={selectedEmployeeID} // Bind value to selectedEmployeeID
                  onChange={handleEmployeeChange}
                  required
                >
                  <option value="" disabled>
                    {t("Select_Employee")}
                  </option>
                  {Array.isArray(employees) &&
                    employees.map((employee) => (
                      <option key={employee.ID} value={employee.ID}>
                        {employee.NomPrenom}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col">
                <label htmlFor="DateDepart">{t("DateDepart")}</label>
                <input
                  type="date"
                  className="form-control"
                  id="DateDepart"
                  value={dateDepart}
                  onChange={(e) => setDateDepart(e.target.value)} // Ensure dateDepart updates
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="HeureDepart">{t("HeureDepart")}</label>
                <input
                  type="time"
                  className="form-control"
                  id="HeureDepart"
                  value={heureDepart}
                  onChange={(e) => setHeureDepart(e.target.value)} // Ensure heureDepart updates
                  required
                />
              </div>
            </div>
            <div className="row my-3">
              <div className="col">
                <label htmlFor="Destination">{t("Destination")}</label>
                <select
                  value={selectedWilaya}
                  onChange={(e) => setselectedWilaya(e.target.value)}
                  className="form-control"
                  id="Destination"
                  required
                >
                  <option value="" disabled>
                    {t("Select_Destination")}
                  </option>
                  {wilayasAlgeria.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label htmlFor="DateRetour">{t("DateRetour")}</label>
                <input
                  type="date"
                  className="form-control"
                  id="DateRetour"
                  required
                  value={dateRetour}
                  onChange={(e) => setDateRetour(e.target.value)} // Ensure dateRetour updates
                />
              </div>
              <div className="col">
                <label htmlFor="HeureRetour">{t("HeureRetour")}</label>
                <input
                  type="time"
                  className="form-control"
                  id="HeureRetour"
                  value={heureRetour}
                  onChange={(e) => setHeureRetour(e.target.value)} // Ensure heureRetour updates
                />
              </div>
            </div>
            <div className="row my-3">
              <div className="col">
                <label htmlFor="PriseEnCharge">{t("Prise_En_Charge")}</label>
                <select
                  required
                  value={priseEnCharge}
                  onChange={(e) => setPriseEnCharge(e.target.value)}
                  className="form-control"
                  id="PriseEnCharge"
                >
                  <option value="" disabled>
                    {t("Prise_En_Charge")}
                  </option>
                  <option value="No">{t("No")}</option>
                  <option value="Yes">{t("Yes")}</option>
                </select>
              </div>
              <div className="col d-flex justify-content-end align-items-end">
                <button className="btn btn-primary form-control">
                  {t("Submit")}
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddMissionOrderModal;

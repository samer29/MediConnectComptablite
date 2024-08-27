import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "../Services/api";
import AddMissionOrderModal from "./AddMissionOrderModal";
import AddNewEtat from "./AddNewEtat";
import "../Style/MissionOrder.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToWords } from "to-words";

const MissionOrderComponent = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [etatModalShow, setEtatModalShow] = useState(false); // State for the new Etat modal
  const [currentMissionOrder, setCurrentMissionOrder] = useState(null);
  const [etats, setEtats] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);
  const navigate = useNavigate();

  const handleEtatClick = (id) => {
    navigate(`/etat/${id}`);
  };

  const fetchEtats = async () => {
    try {
      const response = await api.get("/etat");
      setEtats(response.data.result);
    } catch (error) {
      console.error("Error fetching etats:", error.message);
    }
  };
  useEffect(() => {
    fetchEtats();
  }, []);

  const handleEditClick = (employee) => {
    setCurrentMissionOrder(employee);
    setModalShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("Sure_Deleting_OrdreMission"))) {
      try {
        await api.delete(`/ordremission/${id}`);
        setEmployees((prevEmployees) =>
          prevEmployees.filter((emp) => emp.Num !== id)
        );
      } catch (error) {
        console.error("Error deleting ordremission:", error.message);
      }
    }
  };
  const handleDeleteEtat = async (id) => {
    if (window.confirm(t("Sure_Deleting_Etat"))) {
      try {
        console.log(`Fetching missions for etat id: ${id}`);

        // Fetch missions associated with the Etat
        const response = await api.get(`/etat/ordremissions/${id}`);
        const fetchedMissions = response.data;

        if (fetchedMissions.length === 0) {
          console.log("No missions associated with this Etat.");
          return;
        }

        console.log("Missions fetched:", fetchedMissions);

        // Update NumMandat for all missions in a batch (consider using a batching library)
        await Promise.all(
          fetchedMissions.map(async (mission) => {
            console.log(mission.Num);
            try {
              api.put(`/ordremission/updateDeleteNumMandat/${mission.Num}`);
            } catch (error) {
              console.error(
                `Error updating NumMandat for mission ${mission.Num}:`,
                error.message
              );
            }
          })
        );

        // Now, delete the Etat
        await api.delete(`/etat/${id}`);

        // Update local state (assuming you have a state management library like Redux)
        setEtats((prevEtats) => prevEtats.filter((etat) => etat.ID !== id));

        // Display success message
        console.log("Etat deleted successfully!");
        // Consider using a toast notification library for a user-friendly message
      } catch (error) {
        console.error("Error deleting etats:", error.message);
        // Handle specific errors here (e.g., display error message to user)
      }
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/ordremission");
      setEmployees(response.data.result);
    } catch (error) {
      console.error("Error fetching ordremission:", error.message);
    }
  };

  const handleAddClick = () => {
    setModalShow(true); // Open the modal
  };
  const handleAddEtatClick = () => {
    setEtatModalShow(true); // Open the new Etat modal
  };

  const getButtonColor = (numMandat) => {
    return numMandat === 0 ? "#f50202" : "#21b421";
  };
  const handlePrintEtat = async (etatId) => {
    try {
      const response = await api.get(`/etat/ordremissions/${etatId}`);
      const missions = response.data;

      if (missions.length === 0) {
        console.error("No missions found for the selected Etat.");
        return;
      }

      const employeeData = {
        name: missions[0].NomPrenom,
        grade: missions[0].Grade,
        categorie: missions[0].Categorie,
        compte: missions[0].Compte,
        ncompte: missions[0].NCompte,
      };

      const doc = new jsPDF();

      // Header
      doc.setFont("Times New Roman", "normal");
      doc.setFontSize(14);
      doc.text(
        "République Algérienne Démocratique et Populaire",
        doc.internal.pageSize.width / 2,
        10,
        null,
        null,
        "center"
      );
      doc.text("Wilaya de  MASCARA", 10, 20);
      doc.setFont("Times New Roman", "bold");
      doc.setFontSize(12);
      doc.text("Etablissement Public Hospitalier", 10, 25);
      doc.text("MESLEM TAYEB - MASCARA", 10, 30);
      doc.text(
        "Etat des Frais de Déplacement Engagés par :",
        doc.internal.pageSize.width / 2,
        40,
        null,
        null,
        "center"
      );

      // Set font to Helvetica
      doc.setFont("Helvetica", "normal"); // Set font to Helvetica with normal style

      // Employee Information with mixed font styles
      doc.text("M. : ", 10, 60); // Regular font for label

      doc.setFont("Helvetica", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.name}`, 35, 60); // Bold value

      doc.setFont("Helvetica", "normal"); // Reset font to normal
      doc.text("Grade : ", 10, 65); // Regular font for label

      doc.setFont("Helvetica", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.grade}`, 35, 65); // Bold value

      doc.setFont("Helvetica", "normal"); // Reset font to normal
      doc.text("Categorie : ", 10, 70); // Regular font for label

      doc.setFont("Helvetica", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.categorie}`, 35, 70); // Bold value

      doc.setFont("Helvetica", "normal"); // Reset font to normal
      doc.text("Compte : ", 10, 75); // Regular font for label

      doc.setFont("Helvetica", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.compte}`, 35, 75); // Bold value

      doc.setFont("Helvetica", "normal"); // Reset font to normal
      doc.text("N°Compte : ", 10, 80); // Regular font for label

      doc.setFont("Helvetica", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.ncompte}`, 35, 80); // Bold value

      // Table Columns
      const tableColumn = [
        { header: "N°OrdreMission", dataKey: "Num" },
        { header: "Départ", dataKey: "Depart" },
        { header: "Retour", dataKey: "Retour" },
        { header: "Destination", dataKey: "Destination" },
        { header: "PriseEnCharge", dataKey: "PriseEnCharge" },
        { header: "Restauration", dataKey: "Restauration" },
        { header: "Découcher", dataKey: "Decoucher" },
        { header: "Net à Payer", dataKey: "NetAPayer" },
      ];

      // Table Rows
      const tableRows = missions.map((mission) => ({
        Num: mission.Num,
        Depart: `${new Date(mission.DateDepart).toLocaleDateString()} ${
          mission.HeureDepart
        }`,
        Retour: `${new Date(mission.DateRetour).toLocaleDateString()} ${
          mission.HeureRetour
        }`,
        Destination: mission.Destination,
        PriseEnCharge: mission.PriseEnCharge,
        Restauration: `${mission.NbrDejeuner + mission.NbrDiner} - ${
          mission.DecompteDejuner + mission.DecompteDiner
        }`,
        Decoucher: `${mission.NbrDecoucher} - ${mission.DecompteDecoucher}`,
        NetAPayer: mission.NetAPayer.toFixed(2),
      }));
      // Calculate totals
      const totalNbrRestauration = missions.reduce(
        (sum, mission) => sum + mission.NbrDejeuner + mission.NbrDiner,
        0
      );
      const totalMontantRestauration = missions.reduce(
        (sum, mission) => sum + mission.DecompteDejuner + mission.DecompteDiner,
        0
      );
      const totalNbrDecoucher = missions.reduce(
        (sum, mission) => sum + mission.NbrDecoucher,
        0
      );
      const totalMontantDecoucher = missions.reduce(
        (sum, mission) => sum + mission.DecompteDecoucher,
        0
      );
      const totalNetAPayer = missions.reduce(
        (sum, mission) => sum + mission.NetAPayer,
        0
      );

      tableRows.push({
        Num: "Total",
        Depart: "",
        Retour: "",
        Destination: "",
        PriseEnCharge: "",
        Restauration: `${totalNbrRestauration} - ${totalMontantRestauration}`,
        Decoucher: `${totalNbrDecoucher} - ${totalMontantDecoucher}`,
        NetAPayer: totalNetAPayer,
      });

      doc.autoTable({
        columns: tableColumn,
        body: tableRows,
        startY: 100,
        styles: {
          font: "helvetica",
          fontSize: 8,
        },
        showFoot: "lastPage",
        footStyles: { fontStyle: "bold" },
      }); // Position the text just below the table
      const finalY = doc.autoTable.previous.finalY + 10; // Add a small margin after the table

      // Footer with certification and signatures
      doc.setFont("Times New Roman", "normal");
      doc.text(
        "Je soussigné, auteur du présent état, en certifie l'exactitude à tous égards et demande le règlement à mon profit",
        10,
        finalY
      );
      doc.text(`de la somme de : `, 10, finalY + 10);
      doc.setFont("Times New Roman", "bold");
      doc.text(`${convertToWords(totalNetAPayer)}`, 40, finalY + 10);
      doc.setFont("Times New Roman", "normal");
      doc.text(
        "Le Directeur de l'Etablissement Public Hospitalier -MESLEM TAYEB - MASCARA",
        10,
        finalY + 20
      );
      doc.text(
        "Soussigné,certifie que les déplacements faisant l'objet du présent ",
        10,
        finalY + 25
      );
      doc.text(
        "Fait à ....................,Le.................",
        150,
        finalY + 25
      );
      doc.text(
        "ont été réellement éffectués dans l'intérêt du service et qu'il y a lieu",
        10,
        finalY + 30
      );
      doc.text("Signature de l'Interessé", 150, finalY + 30);
      const textWidthSignature = doc.getTextWidth("Signature de l'Interessé");
      doc.line(150, finalY + 31, 150 + textWidthSignature, finalY + 31);
      doc.text(
        "régler au créancier la somme arrêtée en lettres par celui-ci ",
        10,
        finalY + 35
      );
      doc.setFont("Times New Roman", "bold");
      doc.text("Mascara ,", 40, finalY + 50);
      doc.setFont("Times New Roman", "normal");
      doc.text("Le..................................", 60, finalY + 50);
      doc.text("Le Directeur", 40, finalY + 55);
      const textWidth = doc.getTextWidth("Le Directeur");
      doc.line(40, finalY + 56, 40 + textWidth, finalY + 56); // 1 unit below the text
      doc.text("Vérifié et reconnu exact", 140, finalY + 50);
      doc.text("par le .................................", 140, finalY + 55);

      // Open PDF in new tab
      window.open(doc.output("bloburl"), "_blank");
      window.open(doc.output("bloburl"), "_blank");
    } catch (error) {
      console.error("Error fetching missions for print:", error.message);
    }
  };
  const toWords = new ToWords({
    localeCode: "fr-FR", // Change locale to French
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Dinar",
        plural: "Dinars",
        symbol: "د.ج", // Algerian Dinar symbol
        fractionalUnit: {
          name: "Santeem",
          plural: "Santeems",
          symbol: "", // If there's a symbol for the fractional unit, you can add it here
        },
      },
    },
  });

  const convertToWords = (number) => {
    let words = toWords.convert(number);
    return words;
  };

  return (
    <div className="rootDiv">
      <TabView
        activeIndex={activeTabIndex}
        onTabChange={(e) => setActiveTabIndex(e.index)}
      >
        <TabPanel
          className="tabpanel"
          header={<span className="custom-tab-header">{t("ListOrdre")}</span>}
          style={{ width: "100%" }}
        >
          <table>
            <thead>
              <tr>
                <th>{t("Num")}</th>
                <th>{t("NomPrenom")}</th>
                <th>{t("DateDepart")}</th>
                <th>{t("NetAPayer")}</th>
                <th>{t("Status")}</th>
                <th>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.Num}>
                  <td>{employee.Num}</td>
                  <td>{employee.NomPrenom}</td>
                  <td>{new Date(employee.DateDepart).toLocaleDateString()}</td>
                  <td>{employee.NetAPayer}</td>
                  <td>
                    <Button
                      style={{
                        backgroundColor: getButtonColor(employee.NumMandat),
                        border: "none",
                        color: "#fff",
                      }}
                    >
                      {employee.NumMandat === 0 ? t("Not_Paid") : t("Paid")}
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="btn btn-primary"
                      onClick={() => handleEditClick(employee)}
                      style={{ marginRight: "10px" }}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      className="btn btn-danger"
                      onClick={() => handleDelete(employee.Num)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>
        <TabPanel header={t("List_Etat")} style={{ width: "100%" }}>
          <table>
            <thead>
              <tr>
                <th>{t("Num")}</th>
                <th>{t("NomPrenom")}</th>
                <th>{t("NetAPayer")}</th>
                <th>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {etats.map((etat) => (
                <tr key={etat.ID} onClick={() => handleEtatClick(etat.ID)}>
                  <td>{etat.ID}</td>
                  <td>{etat.NomPrenom}</td>
                  <td>{etat.MontantTotal}</td>
                  <td>
                    {" "}
                    <Button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handleDeleteEtat(etat.ID);
                      }}
                      style={{ marginRight: "10px" }}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                    <Button
                      className="btn btn-info"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handlePrintEtat(etat.ID);
                      }}
                    >
                      <i className="bi bi-printer"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>
      </TabView>
      <div
        className="AddNewMissionPlus"
        onClick={handleAddClick}
        title={t("AddNewMissionOrder")}
      >
        <span>+</span>
      </div>
      <div
        className="AddNewEtatPlus"
        onClick={handleAddEtatClick}
        title={t("AddNewEtat")}
        style={{ marginLeft: "10px" }} // Adjust spacing between the buttons
      >
        <span>{t("AddNewEtat")}</span>
      </div>
      {modalShow && (
        <AddMissionOrderModal
          fetchEmployees={fetchEmployees}
          setModalShow={setModalShow}
          modalShow={modalShow}
          currentMissionOrder={currentMissionOrder}
        />
      )}
      {etatModalShow && (
        <AddNewEtat
          fetchEmployees={fetchEmployees}
          fetchEtats={fetchEtats}
          show={etatModalShow}
          handleClose={() => setEtatModalShow(false)}
          handleSave={() => {
            setEtatModalShow(false);
            // Implement any additional save logic if needed
          }}
        />
      )}
    </div>
  );
};

export default MissionOrderComponent;

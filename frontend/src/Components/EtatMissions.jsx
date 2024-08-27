import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../Services/api";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ToWords } from "to-words";
import "../Style/EtatMissions.css"; // Custom CSS for styling
import NavigationBar from "./NavigationBar"; // Navigation bar

const EtatMissions = () => {
  const { etatId } = useParams(); // Get the etat ID from the URL
  const [missions, setMissions] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchMissions();
  }, [etatId]);

  const fetchMissions = async () => {
    try {
      const response = await api.get(`/etat/ordremissions/${etatId}`);
      setMissions(response.data);

      if (response.data.length > 0) {
        const firstMission = response.data[0];
        setEmployeeData({
          name: firstMission.NomPrenom,
          grade: firstMission.Grade,
          categorie: firstMission.Categorie,
          compte: firstMission.Compte,
          ncompte: firstMission.NCompte,
        });
      }
    } catch (error) {
      console.error("Error fetching missions:", error.message);
    }
  };

  const handlePrintEtat = () => {
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
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  return (
    <div className="etat-missions-page">
      <div className="content-div">
        <NavigationBar /> {/* Include Navigation Bar */}
        <div className="etat-missions-container">
          <div className="centered-text">
            {t("Mission_Etat")} {etatId} - {employeeData.name}
          </div>

          <table className="etat-missions-table">
            <thead>
              <tr>
                <th>{t("Num")}</th>
                <th>{t("DateDepart")}</th>
                <th>{t("DateRetour")}</th>
                <th>{t("NetAPayer")}</th>
                <th>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((mission) => (
                <tr key={mission.Num}>
                  <td>{mission.Num}</td>
                  <td>{new Date(mission.DateDepart).toLocaleDateString()}</td>
                  <td>{new Date(mission.DateRetour).toLocaleDateString()}</td>
                  <td>{mission.NetAPayer.toFixed(2)}</td>
                  <td>
                    <Button className="btn btn-danger">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="centered-button">
            <Button onClick={handlePrintEtat} style={{ marginRight: "10px" }}>
              {t("PrintPDF")}
            </Button>
            <Button onClick={handleBack}>{t("Back")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtatMissions;

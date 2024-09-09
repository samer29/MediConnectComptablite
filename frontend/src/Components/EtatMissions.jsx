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
import filetxt from "../Fonts/AmiriFont.dat";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";

const EtatMissions = () => {
  const [fileContent, setFileContent] = useState("");
  const { etatId } = useParams(); // Get the etat ID from the URL
  const [missions, setMissions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Initialize useNavigate
  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const response = await fetch(filetxt);
        const text = await response.text();
        setFileContent(text);
      } catch (error) {
        console.error("Error fetching the file:", error);
      }
    };

    fetchFileContent();
  }, []);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await api.get("/budget/specific", {
          params: { titre: 2, chapitre: 1, article: 1 },
        });

        if (response.data.result.length > 0) {
          const montant = response.data.result[0].Montant;
          setBudgets([{ Montant: montant }]); // Store the fetched Montant in state
          console.log("Montant:", montant);
          // You can now use the montant as needed
        }
      } catch (error) {
        console.error("Error fetching specific budget:", error.message);
      }
    };

    fetchBudget();
  }, []);

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
          nameArabic: firstMission.NomPrenomArabic,
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
  const reverseArabicText = (text) => {
    return text.split("").reverse().join("");
  };
  const handleDeleteMissionfromEtat = async (Num) => {
    try {
      // Make the API call to update the NumMandat to 0
      const response = await api.put(
        `/ordremission/updateDeleteNumMandat/${Num}`
      );

      if (response.status === 200) {
        console.log(`NumMandat for mission ${Num} updated to 0 successfully`);
        // Fetch the updated missions list after successful deletion
        fetchMissions();
      } else {
        console.error("Failed to update NumMandat:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating NumMandat:", error.message);
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
    doc.setFont("Times New Roman", "normal");
    doc.text("M. : ", 10, 50);
    doc.setFont("Times New Roman", "bold");
    doc.text(`${employeeData.name}`, 35, 50);
    doc.setFont("Times New Roman", "normal");
    doc.text("Grade : ", 10, 55);
    doc.setFont("Times New Roman", "bold");
    doc.text(`${employeeData.grade}`, 35, 55);
    doc.setFont("Times New Roman", "normal");
    doc.text("Categorie : ", 10, 60);
    doc.setFont("Times New Roman", "bold");
    if (employeeData.categorie > 17) {
      if (employeeData.grade === "Administrateur Principale") {
        doc.text("14", 35, 60);
      } else {
        doc.text("16", 35, 60);
      }
    } else {
      doc.text(`${employeeData.categorie}`, 35, 60);
    }
    doc.setFont("Times New Roman", "normal");
    doc.text("Compte : ", 100, 50);
    doc.setFont("Times New Roman", "bold");
    doc.text(`${employeeData.compte}`, 145, 50);
    doc.setFont("Times New Roman", "normal");
    doc.text("N°Compte : ", 100, 55);
    doc.setFont("Times New Roman", "bold");
    doc.text(`${employeeData.ncompte}`, 145, 55);
    doc.setFont("Times New Roman", "normal");
    doc.text("Résidence administrative :", 100, 60);
    doc.setFont("Times New Roman", "bold");
    doc.text("Mascara", 145, 60);
    // Table Columns
    const tableColumn = [
      { header: "N°OrdreMission", dataKey: "Num" },
      { header: "Départ", dataKey: "Depart" },
      { header: "Retour", dataKey: "Retour" },
      { header: "Destination", dataKey: "Destination" },
      { header: "PriseEnCharge", dataKey: "PriseEnCharge" },
      { header: "Restauration", dataKey: "Restauration" },
      { header: "Découcher", dataKey: "Decoucher" },
      {
        header: "Net à Payer",
        dataKey: "NetAPayer",
        minCellWidth: 20, // Ensure the column is wide enough
        halign: "center", // Horizontal alignment (centered)
      },
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
      startY: 65,
      styles: {
        font: "Times News Roman",
        fontSize: 9,
        cellPadding: 2, // Adjust padding for the cells
        lineColor: [0, 0, 0], // Border color (black)
        lineWidth: 0.1, // Border width (thin)
      },
      headStyles: {
        fillColor: [211, 211, 211], // Light grey background for the header
        textColor: [0, 0, 0], // Black text color
        fontSize: 9, // Adjust header font size if needed
        padding: 3, // Adjust padding for header cells
        lineColor: [0, 0, 0], // Border color (black)
        lineWidth: 0.1, // Border width for header (thin)
      },
      bodyStyles: {
        fontSize: 10, // Font size for table body
        cellPadding: 2, // Adjust padding for body cells
        lineColor: [0, 0, 0], // Border color for body cells (black)
        lineWidth: 0.1, // Border width for body cells (thin)
      },
      footStyles: {
        lineColor: [0, 0, 0], // Border color for footer (black)
        lineWidth: 0.1, // Border width for footer (thin)
        fontStyle: "bold", // Bold font for footer
      },
      columnStyles: {
        NetAPayer: {
          minCellWidth: 20, // Ensure the column is wide enough
          halign: "center", // Center-align the text in this column
        },
      },
      showFoot: "lastPage",
    });

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
      "Soussigné,certifie que les déplacements faisant l'objet du présent état ",
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
  const handleMandatEtat = () => {
    const doc = new jsPDF();

    // Add the custom Arabic font
    doc.addFileToVFS("Amiri-Regular.ttf", fileContent);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri"); // Use the Arabic font

    // Example Arabic text
    const arabicText = " ﺮﻜﺴﻌﻣ - ﺐﻴﻄﻟﺍ ﻢﻠﺴﻣ - ﺔﻴﺋﺎﻔﺸﺘﺳﻻﺍ ﺔﻴﻣﻮﻤﻌﻟﺍ ﺔﺴﺳﺆﻤﻟﺍ";
    const formattedArabicText = reverseArabicText(arabicText);
    doc.setFontSize(14);
    doc.text(
      formattedArabicText,
      doc.internal.pageSize.width / 2,
      10,
      null,
      null,
      "center"
    );

    const wilayaMascara = reverseArabicText(" ﺔﻳﺮﺋﺍﺰﺠﻟﺍ ﺔﻳﺭﻮﻬﻤﺠﻟﺍ");
    doc.text(wilayaMascara, 160, 20);
    const Democratie = reverseArabicText(" ﺔﻴﺒﻌﺸﻟﺍ ﺔﻴﻃﺍﺮﻘﻤﻳﺪﻟﺍ");
    doc.text(Democratie, 160, 25);
    const hawala = reverseArabicText("ﻢﻗﺭ ﺔﻟﺍﻮﺣ:");
    doc.text(hawala, 180, 10);
    const num = reverseArabicText(" ﺏﺎﺴﺤﻟﺍ 82/29.1603 ﻢﻗﺭ");
    doc.text(num, 100, 25);
    const serial = reverseArabicText("ﻖﺋﺎﺛﻮﻠﻟ ﻲﻠﺴﻠﺴﺘﻟﺍ ............... ﻢﻗﺭ");
    doc.text(serial, 20, 25);
    const paimen = reverseArabicText("ﻊﻓﺪﻟﺍ ﺔﻟﺍﻮﺣ");
    doc.setFontSize(30);
    doc.text(paimen, doc.internal.pageSize.width / 2, 40, null, null, "center");
    doc.setFontSize(14);
    const year = reverseArabicText(" ﺔﻨﺳ ");
    doc.text(year, 190, 50);
    const currentYear = new Date().getFullYear().toString();
    doc.text(currentYear, 180, 50);

    const yearfinance = reverseArabicText("  ﺔﻴﻟﺎﻤﻟﺍ ﺔﻨﺴﻟﺍ ");
    doc.text(yearfinance, 150, 55);
    const currentYearfinance = new Date().getFullYear().toString();
    doc.text(currentYearfinance, 140, 55);
    const special = reverseArabicText("ـﻟ ﺺﺼﺨﻣ ﺩﺎﻤﺘﻋﺍ");
    doc.text(special, 140, 65);
    const specialOrdre = reverseArabicText(
      " ﻲﻨﻃﻮﻟﺍ ﺏﺍﺮﺘﻟﺍ ﻞﺧﺍﺩ ﻞﻘﻨﺘﻟﺍ ﻭ ﺕﺎﻤﻬﻤﻟﺍ ﻒﻳﺭﺎﺼﻣ"
    );
    doc.text(specialOrdre, 20, 65);
    const article = reverseArabicText(
      " ﺔﻴﻟﻭﻷﺍ ﺔﻴﻧﺍﺰﻴﻤﻟﺍ ﻦﻣ  1 ﺓﺩﺎﻣ 1 ﺏﺎﺑ 2 ﻥﺍﻮﻨﻋ"
    );
    doc.text(
      article,
      doc.internal.pageSize.width / 2,
      75,
      null,
      null,
      "center"
    );

    const total = reverseArabicText("ﻉﻮﻤﺠﻤﻟﺍ");
    doc.text(total, 80, 85);
    const budgetAmount = budgets[0]?.Montant || 0;
    doc.text(budgetAmount.toFixed(2), 20, 75);
    doc.text(budgetAmount.toFixed(2), 20, 85);

    const tableRows = missions.map((mission) => ({
      NetAPayer: mission.NetAPayer.toFixed(2),
    }));
    const totalNetAPayer = tableRows.reduce(
      (total, row) => total + parseFloat(row.NetAPayer),
      0
    );

    const NetAPayerArabic = reverseArabicText("ﺝ.ﺩ ﺏ ﺔﻟﺍﻮﺣ");
    doc.text(NetAPayerArabic, 50, 95);
    doc.setFont("Amiri", "bold");
    doc.text(totalNetAPayer.toFixed(2), 20, 95);
    doc.setFont("Amiri", "normal");
    const bimoktada = reverseArabicText(
      " ﺔﻴﻟﺎﻤﻟﺍ ﺔﻨﺴﻟﺍ ﺔﻴﻧﺍﺰﻴﻤﻟ ﺔﺣﻮﺘﻔﻤﻟﺍ ﺕﺍﺩﺎﻤﺘﻋﻻﺍ ﻰﻀﺘﻘﻤﺑ"
    );
    doc.text(bimoktada, 110, 110);
    const payinemplye = reverseArabicText(
      " ﻲﻨﻌﻤﻟﺍ ﻑﺮﻄﻠﻟ ﺔﺴﺳﺆﻤﻠﻟ ﺹﺎﺨﻟﺍ ﺾﺑﺎﻘﻟﺍ ﻊﻓﺪﻳ"
    );
    doc.text(payinemplye, 20, 110);
    const dinaralgerian = reverseArabicText("ﻱﺮﺋﺍﺰﺟ ﺭﺎﻨﻳﺩ");
    doc.text(`${toArabicWord(totalNetAPayer)} ${dinaralgerian}`, 120, 120);
    const sujet = reverseArabicText(
      " ﻪﻠﻔﺳﺍ ﺓﺭﻮﻛﺬﻤﻟﺍ ﺕﺍﺪﻨﺘﺴﻤﻟﺍ ﻢﻴﻠﺴﺘﺑ ﻭ ﻊﻓﺪﻟﺍ ﻉﻮﺿﻮﻤﻟ"
    );
    doc.text(sujet, 110, 130);

    console.log(employeeData.nameArabic);
    // Use the existing employeeData from state
    const tableData = [
      [
        `${missions.length} ordres de mission`, // Number of mission orders
        `${totalNetAPayer.toFixed(2)}`, // NetAPayer (in numbers)
        "frais de mission", // Subject of payment
        "", // Blank column for the payment period
        `${employeeData.nameArabic}\n\n${employeeData.compte}\n\n${employeeData.ncompte}`, // Employee name in Arabic and account details
      ],
      [
        "", // Blank column
        `${totalNetAPayer.toFixed(2)}`, // NetAPayer in bold
        { content: "مبلغ الدفع", colSpan: 3, styles: { halign: "center" } }, // Merged columns with text
      ],
    ];

    const tableHeaders = [
      reverseArabicText("ﺔﻘﺤﺘﺴﻤﻟﺍ ﺕﺍﺪﻨﺘﺴﻤﻟﺍ"),
      reverseArabicText("ﻎﻟﺎﺒﻤﻟﺍ"),
      reverseArabicText("ﻊﻓﺪﻟﺍ ﻉﻮﺿﻮﻣ"),
      reverseArabicText("ﻊﻓﺪﻟﺍ ﺓﺮﺘﻓ"),
      reverseArabicText("ﻲﻨﻌﻤﻟﺍ ﻑﺮﻄﻟﺍ"),
    ];

    // Render the table using autoTable
    doc.autoTable({
      head: [tableHeaders], // Header row
      body: tableData,
      headStyles: {
        fillColor: [211, 211, 211], // Light grey background for the header
        textColor: [0, 0, 0], // Black text color
        padding: 3, // Adjust padding for header cells
        lineColor: [0, 0, 0], // Border color (black)
        lineWidth: 0.1, // Border width for header (thin)
      },
      bodyStyles: {
        cellPadding: 2, // Adjust padding for body cells
        lineColor: [0, 0, 0], // Border color for body cells (black)
        lineWidth: 0.1, // Border width for body cells (thin)
      },
      styles: {
        font: "Amiri", // Use the Arabic font
        fontSize: 12,
        halign: "right", // Align text to the right (RTL)
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: "auto" }, // Adjust column widths as needed
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
      },
      startY: 140, // Adjust the starting Y position for the table
    });
    const finalY = doc.autoTable.previous.finalY + 10;

    doc.text(" الحوالة الحالية المقدر مبلغه بـ", 149, finalY);
    doc.text(`${toArabicWord(totalNetAPayer)} ${dinaralgerian}`, 80, finalY);
    doc.text(
      "المسلمة من طرفنا نحن مدير المؤسسة العمومية الاستشفائية مسلم الطيب معسكر ",
      70,
      finalY + 10
    );
    doc.text(
      "الدفع بواسطة التحويل البريدي تبعا لصك تحويل الحوالة المشار إليه اعلاه",
      81,
      finalY + 20
    );
    doc.text(" ..................... معسكر في ", 144, finalY + 30);
    doc.text("المدير", 155, finalY + 40);
    const textWidth = doc.getTextWidth("المدير");
    doc.line(155, finalY + 41, 155 + textWidth, finalY + 41);
    doc.text("أمين الخزينة", 55, finalY + 40);
    const textWidthTr = doc.getTextWidth("أمين الخزينة");
    doc.line(55, finalY + 41, 55 + textWidthTr, finalY + 41);

    // Open the PDF in a new tab
    window.open(doc.output("bloburl"), "_blank");
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
                <th>{t("Delete")}</th>
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
                    <Button
                      className="btn btn-danger"
                      onClick={() => handleDeleteMissionfromEtat(mission.Num)}
                    >
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
            <Button onClick={handleMandatEtat} style={{ marginRight: "10px" }}>
              {t("PrintMandat")}
            </Button>
            <Button onClick={handleBack}>{t("Back")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtatMissions;

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
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";
import filetxt from "../Fonts/AmiriFont.dat";

const MissionOrderComponent = ({ searchQuery }) => {
  const [fileContent, setFileContent] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [etatModalShow, setEtatModalShow] = useState(false); // State for the new Etat modal
  const [currentMissionOrder, setCurrentMissionOrder] = useState(null);
  const [etats, setEtats] = useState([]);
  const [filteredEtats, setFilteredEtats] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const employeeResults = employees.filter((employee) =>
        employee.NomPrenom.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(employeeResults);

      const etatResults = etats.filter((etat) =>
        etat.NomPrenom.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEtats(etatResults);
    } else {
      setFilteredEmployees(employees);
      setFilteredEtats(etats);
    }
  }, [searchQuery, employees, etats]);
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
    fetchEmployees();
  }, []);
  const navigate = useNavigate();

  const handleEtatClick = (id) => {
    navigate(`/etat/${id}`);
  };
  const hadndleOMdetail = (id) => {
    navigate(`/OMDetail/${id}`);
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
        postedetail: missions[0].PosteDetail, // Ensure this is the correct field name
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
      doc.setFont("Times New Roman", "normal"); // Set font to Helvetica with normal style

      // Employee Information with mixed font styles
      doc.text("M. : ", 10, 50); // Regular font for label
      doc.setFont("Times New Roman", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.name}`, 35, 50); // Bold value
      doc.setFont("Times New Roman", "normal"); // Reset font to normal
      doc.text("Grade : ", 10, 55); // Regular font for label
      doc.setFont("Times New Roman", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.grade}`, 35, 55); // Bold value
      doc.setFont("Times New Roman", "normal"); // Reset font to normal
      doc.text("Categorie : ", 10, 60); // Regular font for label
      doc.setFont("Times New Roman", "bold");
      doc.text(`${employeeData.categorie}`, 35, 60);
      doc.setFont("Times New Roman", "normal"); // Reset font to normal
      doc.text("Compte : ", 100, 50); // Regular font for label
      doc.setFont("Times New Roman", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.compte}`, 145, 50); // Bold value
      doc.setFont("Times New Roman", "normal"); // Reset font to normal
      doc.text("N°Compte : ", 100, 55); // Regular font for label
      doc.setFont("Times New Roman", "bold"); // Set font to Helvetica with bold style
      doc.text(`${employeeData.ncompte}`, 145, 55); // Bold value
      doc.setFont("Times New Roman", "normal"); // Reset font to normal
      doc.text("Résidence administrative :", 100, 60); // Regular font for label
      doc.setFont("Times New Roman", "bold"); // Set font to Helvetica with bold style
      doc.text("Mascara", 145, 60); // Regular font for label
      doc.setFont("Times New Roman", "normal"); // Reset font to normal
      if (employeeData.postedetail != null) {
        doc.text("Poste Supérieur : ", 10, 65); // Label for Poste Superieur
        doc.setFont("Times New Roman", "bold"); // Bold font for the PosteDetail
        doc.text(`${employeeData.postedetail}`, 40, 65); // Value for PosteDetail
      }
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
        startY: 70,
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
  const handlePrintMandat = async (etatId) => {
    try {
      const response = await api.get(`/etat/ordremissions/${etatId}`);
      const missions = response.data;

      if (missions.length === 0) {
        console.error("No missions found for the selected Etat.");
        return;
      }

      const employeeData = {
        name: missions[0].NomPrenom,
        nameArabic: missions[0].NomPrenomArabic,
        grade: missions[0].Grade,
        categorie: missions[0].Categorie,
        compte: missions[0].Compte,
        ncompte: missions[0].NCompte,
      };
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
      doc.text(
        paimen,
        doc.internal.pageSize.width / 2,
        40,
        null,
        null,
        "center"
      );
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
      doc.text(" ......................معسكر في ", 144, finalY + 30);
      doc.text("المدير", 155, finalY + 40);
      const textWidth = doc.getTextWidth("المدير");
      doc.line(155, finalY + 41, 155 + textWidth, finalY + 41);
      doc.text("أمين الخزينة", 55, finalY + 40);
      const textWidthTr = doc.getTextWidth("أمين الخزينة");
      doc.line(55, finalY + 41, 55 + textWidthTr, finalY + 41);

      // Open the PDF in a new tab
      window.open(doc.output("bloburl"), "_blank");
    } catch (error) {}
  };
  const reverseArabicText = (text) => {
    return text.split("").reverse().join("");
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
          <table className="table table-hover">
            <thead>
              <tr>
                <th>{t("Num")}</th>
                <th>{t("NomPrenom")}</th>
                <th>{t("DateDepart")}</th>
                <th>{t("NetAPayer")}</th>
                <th>{t("Status")}</th>
                <th>{t("Delete")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.Num}
                  onClick={() => hadndleOMdetail(employee.Num)}
                >
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
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(employee.Num);
                      }}
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
              {filteredEtats.map((etat) => (
                <tr key={etat.ID} onClick={() => handleEtatClick(etat.ID)}>
                  <td>{etat.ID}</td>
                  <td>{etat.NomPrenom}</td>
                  <td>{etat.MontantTotal}</td>
                  <td>
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
                      style={{ marginRight: "10px" }}
                    >
                      <i
                        className="bi bi-printer"
                        style={{ marginRight: "5px" }}
                      ></i>
                      {t("State")}
                    </Button>
                    <Button
                      className="btn btn-success"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handlePrintMandat(etat.ID);
                      }}
                    >
                      <i
                        className="bi bi-printer"
                        style={{ marginRight: "5px" }}
                      ></i>
                      <i> {t("Mandat")}</i>
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

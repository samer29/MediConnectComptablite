import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import api from "../Services/api";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import "../Style/PrintingComponent.css";

const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const PrintMissionOrdersModal = () => {
  const { t } = useTranslation();
  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePrintMissions = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get("/ordremission", {
        params: { startDate, endDate },
      });
      const missions = response.data.result;

      const doc = new jsPDF({ orientation: "portrait" });
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
        "Liste des ordres de mission :",
        doc.internal.pageSize.width / 2,
        40,
        null,
        null,
        "center"
      );

      const today = new Date().toLocaleDateString();

      const text1 = "Etat arrêté le :";
      const text2 = ` ${today}`;

      doc.setFont(undefined, "normal");
      doc.text(text1, 10, 50);
      doc.setFont(undefined, "bold");
      doc.text(text2, doc.getTextWidth(text1) + 10, 50);

      doc.setFont(undefined, "normal");

      const tableHeader = ["Num", "Date Depart", "Nom Prenom", "Net A Payer"];
      const tableData = missions.map((mission, index) => [
        mission.Num,
        formatDate(mission.DateDepart),
        mission.NomPrenom,
        mission.NetAPayer.toFixed(2), // Show 2 decimal places
      ]);

      // Add table with mission data
      doc.autoTable({
        head: [tableHeader],
        body: tableData,
        startY: 60,
        margin: { top: 20 },
        styles: {
          font: "Times News Roman",
          fontSize: 12,
          cellPadding: 2, // Adjust padding for the cells
          lineColor: [0, 0, 0], // Border color (black)
          lineWidth: 0.1, // Border width (thin)
        },
        headStyles: {
          fillColor: [211, 211, 211], // Light grey background for the header
          textColor: [0, 0, 0], // Black text color
          fontSize: 12, // Adjust header font size if needed
          padding: 3, // Adjust padding for header cells
          lineColor: [0, 0, 0], // Border color (black)
          lineWidth: 0.1, // Border width for header (thin)
        },
        bodyStyles: {
          fontSize: 12, // Font size for table body
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
          0: { fontStyle: "bold" },
        },
      });

      // Calculate and show the total of NetAPayer
      const totalNetAPayer = missions.reduce(
        (total, mission) => total + parseFloat(mission.NetAPayer),
        0
      );
      doc.setFont("Times New Roman", "bold");
      doc.text(
        `Total Frais des mission : ${totalNetAPayer.toFixed(2)} DA`,
        14,
        doc.autoTable.previous.finalY + 10
      );

      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);

      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error fetching mission orders for printing:", error);
    }
  };

  return (
    <div className="card shadow-sm bg-light p-4 rounded w-100 h-75 mb-4">
      <div className="mb-4">
        <span className="fs-2 fw-medium">{t("mission_order")}</span>
      </div>

      {/* Date Range Selection */}
      <div className="d-flex justify-content-between align-items-center  mb-4">
        <div className="col-auto">
          <label className="form-label me-2">{t("From")}</label>
          <input
            type="date"
            className="form-control d-inline-block"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="col-auto">
          <label className="form-label me-2">{t("To")}</label>
          <input
            type="date"
            className="form-control d-inline-block"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Print Button */}
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePrintMissions}
          disabled={!startDate || !endDate}
        >
          {t("Print")}
        </button>
      </div>
    </div>
  );
};

const PrintMissionOrdersByEmployeeModal = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Assuming `/ordremission` returns the mission data
        const response = await api.get("/ordremission");

        // Filter unique employees by EmployeeId or NomPrenom
        const uniqueEmployees = Array.from(
          new Set(response.data.result.map((mission) => mission.EmployeeId))
        ).map((id) => {
          const employee = response.data.result.find(
            (mission) => mission.EmployeeId === id
          );
          return {
            label: employee.NomPrenom, // Employee name
            value: employee.EmployeeId, // Employee ID
          };
        });

        setEmployees(uniqueEmployees); // Set unique employees for the Select component
      } catch (error) {
        console.error("Error fetching mission employees:", error.message);
      }
    };

    fetchEmployees();
  }, []);

  const handlePrintMissionsByEmployee = async (e) => {
    e.preventDefault();
    try {
      // Fetch all missions
      const response = await api.get("/ordremission", {
        params: { startDate, endDate },
      });
      const allMissions = response.data.result;

      // Filter missions for the selected employee
      const employeeMissions = allMissions.filter(
        (mission) => mission.EmployeeId === selectedEmployee.value
      );

      // Create PDF if there are missions for the employee
      if (employeeMissions.length > 0) {
        const doc = new jsPDF({ orientation: "portrait" });
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
          `Liste des ordres de mission pour : ${selectedEmployee.label}`,
          doc.internal.pageSize.width / 2,
          40,
          null,
          null,
          "center"
        );

        const tableHeader = ["Num", "Date Depart", "Net A Payer"];
        const tableData = employeeMissions.map((mission) => [
          mission.Num,
          formatDate(mission.DateDepart),
          mission.NetAPayer.toFixed(2),
        ]);

        doc.autoTable({
          head: [tableHeader],
          body: tableData,
          startY: 60,
          margin: { top: 20 },
        });

        const totalNetAPayer = employeeMissions.reduce(
          (total, mission) => total + parseFloat(mission.NetAPayer),
          0
        );
        doc.text(
          `Total Frais des mission : ${totalNetAPayer.toFixed(2)} DA`,
          14,
          doc.autoTable.previous.finalY + 10
        );

        const pdfBlob = doc.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, "_blank");
      } else {
        console.log(
          "No missions found for the selected employee in the given date range."
        );
      }
    } catch (error) {
      console.error("Error fetching employee mission orders:", error);
    }
  };

  return (
    <div className="card shadow-sm bg-light p-4 rounded  w-100 h-75 mb-4">
      <div className="mb-4">
        <span className="fs-2 fw-medium">
          {t("Missions_for")}: {selectedEmployee ? selectedEmployee.label : ""}
        </span>
      </div>

      <div className="mb-4">
        <label className="form-label">{t("Select_Employee")}</label>
        <Select
          options={employees}
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e)}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="col-auto">
          <label className="form-label me-2">{t("From")}</label>
          <input
            type="date"
            className="form-control d-inline-block"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="col-auto">
          <label className="form-label me-2">{t("To")}</label>
          <input
            type="date"
            className="form-control d-inline-block"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePrintMissionsByEmployee}
          disabled={!startDate || !endDate || !selectedEmployee}
        >
          {t("Print")}
        </button>
      </div>
    </div>
  );
};

const PrintingComponent = () => {
  return (
    <div className="printing-container">
      <PrintMissionOrdersModal />
      <PrintMissionOrdersByEmployeeModal />
    </div>
  );
};

export default PrintingComponent;

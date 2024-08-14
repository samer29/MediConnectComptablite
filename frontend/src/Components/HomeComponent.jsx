import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useTranslation } from "react-i18next";
import "bootstrap-icons/font/bootstrap-icons.css";

import "../Style/HomeComponent.css";
import api from "../Services/api";
import AddBudgetModal from "./AddBudgetModal";

const HomeComponent = ({ searchQuery }) => {
  const { t } = useTranslation();
  const [budgetData, setBudgetData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const fetchBudgets = async () => {
    try {
      const response = await api.get("/budget"); // Adjust the URL as needed
      setBudgetData(response.data.result);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    // Filter budgets based on the search query
    const results = budgetData.filter((item) =>
      item.Nature.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(results);
  }, [searchQuery, budgetData]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budget/${id}`);
      fetchBudgets(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting budget item:", error);
    }
  };

  const handleEdit = (budget) => {
    setCurrentBudget(budget); // Set the selected budget for editing
    setModalShow(true); // Show the modal
  };

  const titleOneItems = filteredData
    .filter((item) => item.Titre === 1)
    .map((item, index) => (
      <div className="grid-item" key={index}>
        <div className="item-container">
          <div className="item-title">
            <strong>{t("Title")}</strong> {item.Titre},{" "}
            <strong>{t("Chapter")}</strong> {item.Chapitre}
          </div>
          <p className="item-description">
            <strong>{t("Article")}</strong> {item.Article}
          </p>
          <p className="item-description">{item.Nature}</p>
          <p className="item-description">
            <strong>{t("Amount")}</strong> {item.Montant} DA
          </p>
          <div className="action-buttons">
            <i
              className="bi bi-pencil btn-icon edit"
              onClick={() => handleEdit(item)}
            ></i>
            <i
              className="bi bi-trash-fill btn-icon delete"
              onClick={() => handleDelete(item.ID)}
            ></i>
          </div>
        </div>
      </div>
    ));

  const titleTwoItems = filteredData
    .filter((item) => item.Titre === 2)
    .map((item, index) => (
      <div className="grid-item" key={index}>
        <div className="item-container">
          <div className="item-title">
            <strong>{t("Title")}</strong> {item.Titre},{" "}
            <strong>{t("Chapter")}</strong> {item.Chapitre}
          </div>
          <p className="item-description">
            <strong>{t("Article")}</strong> {item.Article}
          </p>
          <p className="item-description">{item.Nature}</p>
          <p className="item-description">
            <strong>{t("Amount")}</strong> {item.Montant} DA
          </p>
          <div className="action-buttons">
            <i
              className="bi bi-pencil btn-icon edit"
              onClick={() => handleEdit(item)}
            ></i>
            <i
              className="bi bi-trash-fill btn-icon delete"
              onClick={() => handleDelete(item.ID)}
            ></i>
          </div>
        </div>
      </div>
    ));

  const handleAddGrid = () => {
    setCurrentBudget(null); // Reset the current budget (for adding a new one)
    setModalShow(true);
  };

  return (
    <div>
      <TabView>
        <TabPanel
          className="tabpanel"
          header={<span className="custom-tab-header">{t("Title_I")}</span>}
          style={{ width: "100%" }}
        >
          <div className="grid">
            {titleOneItems}
            <div className="grid-item add-grid" onClick={handleAddGrid}>
              <div className="item-container plus-sign">
                <i className="pi pi-plus" style={{ fontSize: "2rem" }}></i>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header={t("Title_II")} style={{ width: "100%" }}>
          <div className="grid">
            {titleTwoItems}
            <div className="grid-item add-grid" onClick={handleAddGrid}>
              <div className="item-container plus-sign">
                <i className="pi pi-plus" style={{ fontSize: "2rem" }}></i>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
      <AddBudgetModal
        fetchBudgets={fetchBudgets}
        modalShow={modalShow}
        setModalShow={setModalShow}
        currentBudget={currentBudget} // Pass the current budget to the modal
      />
    </div>
  );
};

export default HomeComponent;

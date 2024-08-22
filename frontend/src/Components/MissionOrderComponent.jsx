import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "../Services/api";
import AddMissionOrderModal from "./AddMissionOrderModal";
import "../Style/MissionOrder.css";

const MissionOrderComponent = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [currentMissionOrder, setCurrentMissionOrder] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/ordremission");
        setEmployees(response.data.result);
      } catch (error) {
        console.error("Error fetching ordremission:", error.message);
      }
    };

    fetchEmployees();
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

  return (
    <div className="rootDiv">
      <TabView>
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
                      className="btn btn-primary"
                      onClick={() => handleEditClick(employee)}
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
        <TabPanel header={t("ListMandat")} style={{ width: "100%" }}></TabPanel>
      </TabView>
      <div
        className="AddNewMissionPlus"
        onClick={handleAddClick}
        title={t("AddNewMissionOrder")}
      >
        <span>+</span>
      </div>
      {modalShow && (
        <AddMissionOrderModal
          fetchEmployees={fetchEmployees}
          setModalShow={setModalShow}
          modalShow={modalShow}
          currentMissionOrder={currentMissionOrder}
        />
      )}
    </div>
  );
};

export default MissionOrderComponent;

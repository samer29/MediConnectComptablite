import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import Select from "react-select";
import api from "../Services/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const AddNewEtat = ({
  show,
  handleClose,
  handleSave,
  fetchEmployees,
  fetchEtats,
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [missions, setMissions] = useState([]);
  const [selectedMissions, setSelectedMissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/ordremission/distinctEmployees");
        const data = response.data;
        const formattedOptions = data.map((item) => ({
          value: item.NomPrenom,
          label: item.NomPrenom,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const fetchMissions = async () => {
        try {
          const response = await api.get(
            `/ordremission/0?NomPrenom=${selectedEmployee.value}`
          );
          setMissions(response.data);
        } catch (error) {
          console.error("Error fetching missions:", error);
        }
      };

      fetchMissions();
    }
  }, [selectedEmployee]);

  const handleMissionSelect = (mission) => {
    setSelectedMissions((prevSelected) =>
      prevSelected.includes(mission)
        ? prevSelected.filter((m) => m !== mission)
        : [...prevSelected, mission]
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate the total amount to pay (MontantTotal)
    const MontantTotal = selectedMissions.reduce(
      (sum, mission) => sum + mission.NetAPayer,
      0
    );

    try {
      // Create new Etat with the sum of NetAPayer as MontantTotal
      const newEtatResponse = await api.post("/etat", {
        NomPrenom: selectedEmployee.value,
        MontantTotal,
      });
      const newEtatId = newEtatResponse.data.id;

      // Update selected missions with the new Etat ID
      await Promise.all(
        selectedMissions.map((mission) =>
          api.put(`/ordremission/updateNumMandat/${mission.Num}`, {
            NumMandat: newEtatId,
          })
        )
      );

      // Show success message
      Swal.fire({
        title: "Success",
        text: "Ordre Mission Added Successfully",
        icon: "success",
      }).then(() => {
        fetchEmployees();
        fetchEtats();
        handleSave(); // Call the handleSave callback
        handleClose(); // Close the modal
      });
    } catch (error) {
      console.error(
        "Error saving Etat:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("AddNewEtat")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="employeeSelect">
            <Form.Label>{t("SelectEmployee")}</Form.Label>
            <Select
              options={options}
              placeholder={t("SelectEmployee")}
              isClearable
              onChange={(option) => setSelectedEmployee(option)}
            />
          </Form.Group>

          {missions.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t("Select")}</th>
                  <th>{t("Num")}</th>
                  <th>{t("DateDepart")}</th>
                  <th>{t("NetAPayer")}</th>
                </tr>
              </thead>
              <tbody>
                {missions.map((mission) => (
                  <tr key={mission.Num}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        onChange={() => handleMissionSelect(mission)}
                      />
                    </td>
                    <td>{mission.Num}</td>
                    <td>{new Date(mission.DateDepart).toLocaleDateString()}</td>
                    <td>{mission.NetAPayer}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Button variant="primary" type="submit">
            {t("Save")}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewEtat;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import api from "../Services/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const AddMissionsToEtat = ({ show, handleClose, etatId, fetchMissions }) => {
  const { t } = useTranslation();
  const [missions, setMissions] = useState([]);
  const [selectedMissions, setSelectedMissions] = useState([]);
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    if (etatId) {
      fetchAvailableMissions(); // Use the new fetch function here
    }
  }, [etatId]);

  // Define fetchAvailableMissions
  const fetchAvailableMissions = async () => {
    try {
      const response = await api.get(`/ordremission/NewEtat/0?etatId=${etatId}`);
      setMissions(response.data);

      // Assuming all missions belong to the same employee in the etat
      if (response.data.length > 0) {
        setEmployeeName(response.data[0].NomPrenom); // Set the employee's name
      }
    } catch (error) {
      console.error("Error fetching available missions:", error);
    }
  };

  const handleMissionSelect = (mission) => {
    setSelectedMissions((prevSelected) =>
      prevSelected.includes(mission)
        ? prevSelected.filter((m) => m !== mission)
        : [...prevSelected, mission]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update selected missions with the current etat ID
      await Promise.all(
        selectedMissions.map((mission) =>
          api.put(`/ordremission/updateNumMandat/${mission.Num}`, {
            NumMandat: etatId,
          })
        )
      );

      // Show success message
      Swal.fire({
        title: "Success",
        text: "Missions added to Etat successfully",
        icon: "success",
      }).then(() => {
        fetchMissions(); // Refresh the missions list
        handleClose(); // Close the modal
      });
    } catch (error) {
      console.error("Error updating missions:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("AddMissionsToEtat")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="employeeName">
            <Form.Label>{t("EmployeeName")}</Form.Label>
            <Form.Control type="text" readOnly value={employeeName} />
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
                    <td>{mission.NetAPayer.toFixed(2)}</td>
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

export default AddMissionsToEtat;

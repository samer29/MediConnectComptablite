import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../Services/api";
import "../Style/EmployeeComponent.css";
import { Button } from "react-bootstrap";
import AddEmployeeModal from "./AddNewEmployee"; // Updated import

const EmployeesComponent = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employee");
        setEmployees(response.data.result);
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    };

    fetchEmployees();
  }, []);

  const handleDoubleClick = (id, field, currentValue) => {
    setEditingCell({ id, field });
    setEditedValue(currentValue);
  };

  const handleInputChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleBlur = async () => {
    if (editingCell) {
      const { id, field } = editingCell;
      try {
        await api.put(`/employee/${id}`, { [field]: editedValue });
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.ID === id ? { ...emp, [field]: editedValue } : emp
          )
        );
      } catch (error) {
        console.error("Error updating employee:", error.message);
      }
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e) => {
    if (editingCell && e.key === "Enter") {
      handleBlur();
    }
  };

  const handleAddClick = () => {
    setModalShow(true); // Open the modal
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("Sure_Deleting_Employee"))) {
      try {
        await api.delete(`/employee/${id}`);
        setEmployees((prevEmployees) =>
          prevEmployees.filter((emp) => emp.ID !== id)
        );
      } catch (error) {
        console.error("Error deleting employee:", error.message);
      }
    }
  };

  return (
    <div className="employees-container">
      <table>
        <thead>
          <tr>
            <th>{t("ID")}</th>
            <th>{t("NomPrenom")}</th>
            <th>{t("Grade")}</th>
            <th>{t("Categorie")}</th>
            <th>{t("Compte")}</th>
            <th>{t("NCompte")}</th>
            <th>{t("Actions")}</th> {/* Actions column */}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.ID}>
              <td>{employee.ID}</td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick(
                    employee.ID,
                    "NomPrenom",
                    employee.NomPrenom
                  )
                }
              >
                {editingCell?.id === employee.ID &&
                editingCell?.field === "NomPrenom" ? (
                  <input
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  employee.NomPrenom
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick(employee.ID, "Grade", employee.Grade)
                }
              >
                {editingCell?.id === employee.ID &&
                editingCell?.field === "Grade" ? (
                  <input
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  employee.Grade
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick(
                    employee.ID,
                    "Categorie",
                    employee.Categorie
                  )
                }
              >
                {editingCell?.id === employee.ID &&
                editingCell?.field === "Categorie" ? (
                  <input
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  employee.Categorie
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick(employee.ID, "Compte", employee.Compte)
                }
              >
                {editingCell?.id === employee.ID &&
                editingCell?.field === "Compte" ? (
                  <input
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  employee.Compte
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick(employee.ID, "NCompte", employee.NCompte)
                }
              >
                {editingCell?.id === employee.ID &&
                editingCell?.field === "NCompte" ? (
                  <input
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  employee.NCompte
                )}
              </td>
              <td>
                <Button
                  className="btn btn-danger"
                  onClick={() => handleDelete(employee.ID)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating Action Button */}
      <div className="fab" onClick={handleAddClick} title={t("AddNewEmployee")}>
        <span>+</span>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        fetchEmployees={() => {
          api.get("/employee").then((response) => {
            setEmployees(response.data.result);
          });
        }}
        modalShow={modalShow}
        setModalShow={setModalShow}
      />
    </div>
  );
};

export default EmployeesComponent;

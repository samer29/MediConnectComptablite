import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa"; // Import Font Awesome Trash icon
import api from "../Services/api";
import { useTranslation } from "react-i18next";

const SettingsComponent = () => {
  const [grade, setGrade] = useState("");
  const [grades, setGrades] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await api.get("/grades");
      setGrades(response.data.result);
    } catch (error) {
      console.error("Error fetching grades:", error.message);
    }
  };

  const handleAddGrade = async () => {
    if (grade.trim()) {
      try {
        await api.post("/grades", { Grade: grade });
        setGrade(""); // Clear the input field
        fetchGrades(); // Refresh the table after adding
      } catch (error) {
        console.error("Error adding grade:", error.message);
      }
    }
  };

  const handleDeleteGrade = async (id) => {
    try {
      await api.delete(`/grades/${id}`);
      fetchGrades(); // Refresh the table after deleting
    } catch (error) {
      console.error("Error deleting grade:", error.message);
    }
  };

  return (
    <div className="container">
      <div className="mb-3">
        <input
          type="text"
          className="form-control d-inline-block w-auto mr-2"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder={t("Enter_Grade")}
        />
        <button className="btn btn-primary" onClick={handleAddGrade}>
          {t("Add")}  
        </button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>{t("Num")}</th>
            <th>{t("Grade")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
            <tr key={g.ID}>
              <td>{g.ID}</td>
              <td>{g.Grade}</td>
              <td>
                <FaTrash
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteGrade(g.ID)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SettingsComponent;

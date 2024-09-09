import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Services/api";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "../Style/OrderMissionDetail.css"; // Custom CSS for styling

const OrderMissionDetail = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [missionDetail, setMissionDetail] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchMissionDetail();
  }, [orderId]);

  const fetchMissionDetail = async () => {
    try {
      const response = await api.get(`/ordremission/${orderId}`);
      const firstMission = response.data[0];
      setMissionDetail(firstMission);
    } catch (error) {
      console.error("Error fetching mission details:", error.message);
    }
  };

  const handleDoubleClick = (field, currentValue) => {
    setEditingCell(field);
    setEditedValue(currentValue);
  };

  const handleInputChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleBlur = async () => {
    if (editingCell) {
      try {
        const updatedData = { [editingCell]: editedValue };
        await api.put(`/ordremission/${orderId}`, updatedData);
        setMissionDetail((prevDetail) => ({
          ...prevDetail,
          [editingCell]: editedValue,
        }));
      } catch (error) {
        console.error("Error updating mission detail:", error.message);
      }
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e) => {
    if (editingCell && e.key === "Enter") {
      handleBlur();
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (!missionDetail) {
    return <div>{t("Loading")}...</div>; // Render loading message while fetching data
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="order-mission-detail-page">
      <div className="content-div">
        <table className="mission-detail-table">
          <thead>
            <tr>
              <th>{t("Name")}</th>
              <th>{t("DateDepart")}</th>
              <th>{t("HeureDepart")}</th>
              <th>{t("DateRetour")}</th>
              <th>{t("HeureRetour")}</th>
              <th>{t("NbrDejeuner")}</th>
              <th>{t("DecompteDejeuner")}</th>
              <th>{t("NbrDiner")}</th>
              <th>{t("DecompteDiner")}</th>
              <th>{t("NbrDecoucher")}</th>
              <th>{t("DecompteDecoucher")}</th>
              <th>{t("NetAPayer")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("NomPrenom", missionDetail.NomPrenom)
                }
              >
                {editingCell === "NomPrenom" ? (
                  <input
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.NomPrenom
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("DateDepart", missionDetail.DateDepart)
                }
              >
                {editingCell === "DateDepart" ? (
                  <input
                    type="date"
                    value={new Date(editedValue).toISOString().substring(0, 10)}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  formatDate(missionDetail.DateDepart)
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("HeureDepart", missionDetail.HeureDepart)
                }
              >
                {editingCell === "HeureDepart" ? (
                  <input
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.HeureDepart
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("DateRetour", missionDetail.DateRetour)
                }
              >
                {editingCell === "DateRetour" ? (
                  <input
                    type="date"
                    value={new Date(editedValue).toISOString().substring(0, 10)}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  formatDate(missionDetail.DateRetour)
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("HeureRetour", missionDetail.HeureRetour)
                }
              >
                {editingCell === "HeureRetour" ? (
                  <input
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.HeureRetour
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("NbrDejeuner", missionDetail.NbrDejeuner)
                }
              >
                {editingCell === "NbrDejeuner" ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.NbrDejeuner
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick(
                    "DecompteDejuner",
                    missionDetail.DecompteDejuner
                  )
                }
              >
                {editingCell === "DecompteDejuner" ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.DecompteDejuner
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("NbrDiner", missionDetail.NbrDiner)
                }
              >
                {editingCell === "NbrDiner" ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.NbrDiner
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick(
                    "DecompteDiner",
                    missionDetail.DecompteDiner
                  )
                }
              >
                {editingCell === "DecompteDiner" ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.DecompteDiner
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("NbrDecoucher", missionDetail.NbrDecoucher)
                }
              >
                {editingCell === "NbrDecoucher" ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.NbrDecoucher
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick(
                    "DecompteDecoucher",
                    missionDetail.DecompteDecoucher
                  )
                }
              >
                {editingCell === "DecompteDecoucher" ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.DecompteDecoucher
                )}
              </td>
              <td
                onDoubleClick={() =>
                  handleDoubleClick("NetAPayer", missionDetail.NetAPayer)
                }
              >
                {editingCell === "NetAPayer" ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  missionDetail.NetAPayer
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="button-container">
          <Button variant="primary" onClick={handleBack}>
            {t("Back")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderMissionDetail;

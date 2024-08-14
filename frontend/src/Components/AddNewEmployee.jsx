import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../Services/api";
import { useTranslation } from "react-i18next";

const AddEmployeeModal = ({ fetchEmployees, setModalShow, modalShow }) => {
  const { t } = useTranslation();
  const [nomPrenom, setNomPrenom] = useState("");
  const [grade, setGrade] = useState("");
  const [categorie, setCategorie] = useState("");
  const [compte, setCompte] = useState("");
  const [nCompte, setNCompte] = useState("");

  const clearForm = () => {
    setNomPrenom("");
    setGrade("");
    setCategorie("");
    setCompte("");
    setNCompte("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomPrenom || !grade || !categorie || !compte || !nCompte) {
      Swal.fire({
        title: t("Error"),
        text: t("RequiredField"),
        icon: "error",
      });
      return;
    }

    const formData = {
      NomPrenom: nomPrenom,
      Grade: grade,
      Categorie: categorie,
      Compte: compte,
      NCompte: nCompte,
    };

    try {
      // Add new employee
      const response = await api.post("/employee", formData);
      console.log(t("Employee added successfully:"), response.data);
      Swal.fire({
        title: t("Success"),
        text: t("Employee_Added_Successfully"),
        icon: "success",
      }).then(() => {
        setModalShow(false); // Close the modal
        fetchEmployees(); // Refresh the list of employees
        clearForm(); // Clear form fields after submission
      });
    } catch (error) {
      console.error(t("Error_Adding_Employee"), error);
      Swal.fire({
        title: t("Error"),
        text: t("Error_Adding_Employee"),
        icon: "error",
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={modalShow}
      onHide={() => setModalShow(false)}
      dialogClassName="custom-modal-width"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("Add_New_Employee")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="row my-3">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  value={nomPrenom}
                  onChange={(e) => setNomPrenom(e.target.value)}
                  placeholder={t("Name")}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder={t("Grade")}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  placeholder={t("Categorie")}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  value={compte}
                  onChange={(e) => setCompte(e.target.value)}
                  placeholder={t("Compte")}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  value={nCompte}
                  onChange={(e) => setNCompte(e.target.value)}
                  placeholder={t("NCompte")}
                  required
                />
              </div>
            </div>
          </div>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalShow(false)}
            >
              {t("Close")}
            </button>
            <button type="submit" className="btn btn-primary">
              {t("Add")}
            </button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEmployeeModal;

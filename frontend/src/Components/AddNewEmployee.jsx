import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../Services/api";
import { useTranslation } from "react-i18next";
import Select from "react-select";

const AddEmployeeModal = ({ fetchEmployees, setModalShow, modalShow }) => {
  const { t } = useTranslation();
  const [nomPrenomArabic, setNomPrenomArabic] = useState("");
  const [nomPrenom, setNomPrenom] = useState("");
  const [grade, setGrade] = useState("");
  const [categorie, setCategorie] = useState("");
  const [compte, setCompte] = useState("");
  const [nCompte, setNCompte] = useState("");
  const [gradeOptions, setGradeOptions] = useState([]);

  // State for Poste Supérieur
  const [isPosteSuperieur, setIsPosteSuperieur] = useState(false);
  const [posteDetail, setPosteDetail] = useState(null);

  // Poste Supérieur options
  const posteOptions = [
    { value: "Directeur", label: "Directeur" },
    { value: "Sous directeur", label: "Sous directeur" },
    { value: "Chef Service", label: "Chef Service" },
    { value: "Chef Bureau", label: "Chef Bureau" },
  ];

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get("/grades");
        const options = response.data.result.map((grade) => ({
          value: grade.ID,
          label: grade.Grade,
        }));
        setGradeOptions(options);
      } catch (error) {
        console.error(t("Error fetching grades"), error);
      }
    };

    fetchGrades();
  }, [t]);

  const clearForm = () => {
    setNomPrenomArabic("");
    setNomPrenom("");
    setGrade("");
    setCategorie("");
    setCompte("");
    setNCompte("");
    setIsPosteSuperieur(false);
    setPosteDetail(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nomPrenomArabic ||
      !nomPrenom ||
      !grade ||
      !categorie ||
      !compte ||
      !nCompte
    ) {
      Swal.fire({
        title: t("Error"),
        text: t("RequiredField"),
        icon: "error",
      });
      return;
    }

    const formData = {
      NomPrenomArabic: nomPrenomArabic,
      NomPrenom: nomPrenom,
      Grade: grade.label,
      Categorie: categorie,
      Compte: compte,
      NCompte: nCompte,
      PosteSup: isPosteSuperieur ? "OUI" : "NON",
      PosteDetail: isPosteSuperieur ? posteDetail?.value : null,
    };

    try {
      const response = await api.post("/employee", formData);
      console.log(t("Employee added successfully:"), response.data);
      Swal.fire({
        title: t("Success"),
        text: t("Employee_Added_Successfully"),
        icon: "success",
      }).then(() => {
        setModalShow(false);
        fetchEmployees();
        clearForm();
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
                  value={nomPrenomArabic}
                  onChange={(e) => setNomPrenomArabic(e.target.value)}
                  placeholder={t("NameArabic")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row my-3">
            <div className="col-md-6">
              <div className="form-group">
                <Select
                  value={grade}
                  onChange={setGrade}
                  options={gradeOptions}
                  placeholder={t("Select_Grade")}
                  required
                />
              </div>
            </div>
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
          </div>

          {/* Poste Supérieur Checkbox */}
          <div className="row my-3">
            <div className="col-md-12">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="posteSuperieurCheck"
                  checked={isPosteSuperieur}
                  onChange={() => setIsPosteSuperieur(!isPosteSuperieur)}
                />
                <label
                  className="form-check-label"
                  htmlFor="posteSuperieurCheck"
                >
                  {t("Poste_Superieur")}
                </label>
              </div>
            </div>
          </div>

          {/* Poste Detail Dropdown (shows if Poste Supérieur is checked) */}
          {isPosteSuperieur && (
            <div className="row my-3">
              <div className="col-md-12">
                <Select
                  value={posteDetail}
                  onChange={setPosteDetail}
                  options={posteOptions}
                  placeholder={t("Select_Poste_Detail")}
                />
              </div>
            </div>
          )}

          <div className="row my-3">
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

  import React, { useState, useEffect } from "react";
  import { Modal } from "react-bootstrap";
  import Swal from "sweetalert2";
  import api from "../Services/api";
  import { useTranslation } from "react-i18next";

  const AddBudgetModal = ({
    fetchBudgets,
    setModalShow,
    modalShow,
    currentBudget,
  }) => {
    const { t } = useTranslation();
    const [nature, setNature] = useState("");
    const [titre, setTitre] = useState("");
    const [chapitre, setChapitre] = useState("");
    const [article, setArticle] = useState("");
    const [montant, setMontant] = useState("");

    useEffect(() => {
      if (currentBudget) {
        setNature(currentBudget.Nature);
        setTitre(currentBudget.Titre);
        setChapitre(currentBudget.Chapitre);
        setArticle(currentBudget.Article);
        setMontant(currentBudget.Montant);
      } else {
        // Clear fields if no current budget is provided (adding new)
        setNature("");
        setTitre("");
        setChapitre("");
        setArticle("");
        setMontant("");
      }
    }, [currentBudget]);

    const clearForm = () => {
      setNature("");
      setTitre("");
      setChapitre("");
      setArticle("");
      setMontant("");
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!nature || !titre || !chapitre || !article || !montant) {
        Swal.fire({
          title: t("Error"),
          text: t("RequiredField"),
          icon: "error",
        });
        return;
      }

      const formData = {
        Nature: nature,
        Titre: titre,
        Chapitre: chapitre,
        Article: article,
        Montant: montant,
      };

      try {
        if (currentBudget) {
          // Edit existing budget
          await api.patch(`/budget/${currentBudget.ID}`, formData);
          Swal.fire({
            title: t("Success"),
            text: t("Budget_Updated_Successfully"),
            icon: "success",
          }).then(() => {
            setModalShow(false); // Close the modal
            fetchBudgets(); // Refresh the list of budgets
          });
        } else {
          // Add new budget
          const response = await api.post("/budget", formData);
          console.log(t("Budget added successfully:"), response.data);
          Swal.fire({
            title: t("Success"),
            text: t("Budget_Added_Successfully"),
            icon: "success",
          }).then(() => {
            setModalShow(false); // Close the modal
            fetchBudgets(); // Refresh the list of budgets
            clearForm(); // Clear form fields after submission
          });
        }
      } catch (error) {
        console.error(t("Error_Adding_Or_Updating_Budget"), error);
        Swal.fire({
          title: t("Error"),
          text: t("Error_Adding_Or_Updating_Budget"),
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
          <Modal.Title>
            {currentBudget ? t("Edit_Budget") : t("Add_New_Budget")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="row my-3">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    value={nature}
                    onChange={(e) => setNature(e.target.value)}
                    placeholder={t("Nature")}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    placeholder={t("Title")}
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
                    value={chapitre}
                    onChange={(e) => setChapitre(e.target.value)}
                    placeholder={t("Chapter")}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    placeholder={t("Article")}
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
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    placeholder={t("Amount")}
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
                {currentBudget ? t("Update") : t("Add")}
              </button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    );
  };

  export default AddBudgetModal;

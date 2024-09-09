import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      Profile: "Profile",
      Logout: "Logout",
      Search: "Search...",
      Language: "Language",
      English: "English",
      French: "French",
      Home: "Home",
      employees: "Employee",
      mission_order: "Mission Order",
      Settings: "Settings",
      Printing: "Printing",
      About: "About",
      Title_I: "Title I",
      Title_II: "Title II",
      Title: "Title",
      Article: "Article",
      Chapter: "Chapter",
      Amount: "Amount",
      Error: "Error",
      RequiredField: "These fields cannot be empty!",
      Succes: "Success!",
      Budget_Added_Successfully: "Added Successfully",
      Error_Adding_Or_Updating_Budget:
        "There was an error while adding or updating!",
      Add_New_Budget: "Add New Article to the budget",
      Close: "Close",
      Add: "Submit",
      Edit_Budget: "Edit Article",
      Budget_Updated_Successfully: "Article updated successfully",
      Update: "Update",
      NomPrenom: "Name",
      Grade: "Rank",
      Categorie: "Category",
      Compte: "Account",
      NCompte: "Account Number",
      Delete: "Delete",
      Actions: "Actions",
      AddNewEmployee: "Add New Employee",
      Employee_Added_Successfully: "Employee Added Successfully",
      Error_Adding_Employee: "Error adding Employee",
      Add_New_Employee: "Add New Employee",
      Sure_Deleting_Employee: "Are you sure you want to delete this employee?",
      ListOrdre: "List of mission orders",
      ListMandat: "List of mandates",
      Sure_Deleting_OrdreMission:
        "Are you sure you want to delete this Mission Order?",
      Yes: "Yes",
      No: "No",
      Prise_En_Charge: "Total Support",
      HeureRetour: "Return Time",
      Select_Destination: "Select Destination",
      Destination: "Destination",
      HeureDepart: "Departure Time",
      Select_Employee: "Select Employee",
      NumOrdreMission: "Mission Order Number",
      Add_New_OrderMission: "Add New Mission Order",
      Error_Adding_Or_Updating_OrderMission:
        "Error adding or updating a mission order",
      OrdreMission_Added_Successfully: "Mission Order Added Successfully",
      Error_Fetching_Employee: "Error Fetching Employee Data",
      DateRetourAfterDateDepart:
        "Return date cannot be before the Departure date",
      DateDepart: "Departure Date",
      NetAPayer: "Net Paid",
      DateRetour: "Return Date",
      List_Etat: "List of States",
      Not_Paid: "Not Paid",
      Paid: "Paid",
      PrintPDF: "Print PDF",
      Back: "Back",
      Mission_Etat: "N° Etat Mission :",
      AddNewEtat: "Create State",
      SelectEmployee: "Select Employee",
      Select: "Select",
      Save: "Save ",
      NbrDejeuner: "N° Lunches",
      DecompteDejeuner: "Lunch Count",
      NbrDiner: "N° Dinner",
      DecompteDiner: "Dinner Count",
      NbrDecoucher: "N° Nights",
      DecompteDecoucher: "Night Count",
      Enter_Grade: "Enter Rank",
      PrintMandat: "Print the mandate",
      NameArabic: "الاسم و اللقب",
      From: "From :",
      To: "To:",
      Missions_for: "Missions for ",
      State: "State",
      Mandat: "Mandate",
      Print: "Print",
    },
  },
  fr: {
    translation: {
      Profile: "Profil",
      Logout: "Se déconnecter",
      Search: "Rechercher...",
      Language: "Langue",
      English: "Anglais",
      French: "Français",
      Home: "Accueil",
      employees: "Employés",
      mission_order: "Ordre de Mission",
      Settings: "Paramètres",
      Printing: "Impression",
      About: "À propos",
      Title_I: "Titre I",
      Title_II: "Titre II",
      Title: "Titre",
      Article: "Article",
      Chapter: "Chapitre",
      Amount: "Montant",
      Error: "Erreur",
      RequiredField: "Tous les champs sont obligatoires !",
      Succes: "Succès !",
      Budget_Added_Successfully: "Ajouté avec succès",
      Error_Adding_Or_Updating_Budget:
        "Erreur lors de l'ajout ou de la mise à jour !",
      Add_New_Budget: "Ajouter un nouvel article au budget",
      Close: "Fermer",
      Add: "Soumettre",
      Edit_Budget: "Modifier l'article",
      Budget_Updated_Successfully: "Article mis à jour avec succès",
      Update: "Mettre à jour",
      NomPrenom: "Nom et Prénom",
      Grade: "Grade",
      Categorie: "Catégorie",
      Compte: "Compte",
      NCompte: "Numéro de Compte",
      Delete: "Supprimer",
      Actions: "Actions",
      AddNewEmployee: "Ajouter un Nouvel Employé",
      Employee_Added_Successfully: "Employé ajouté avec succès",
      Error_Adding_Employee: "Erreur lors de l'ajout de l'employé",
      Add_New_Employee: "Ajouter un Nouvel Employé",
      Sure_Deleting_Employee:
        "Êtes-vous sûr de vouloir supprimer cet employé ?",
      ListOrdre: "Liste des Ordres de Mission",
      ListMandat: "Liste des Mandats",
      Sure_Deleting_OrdreMission:
        "Êtes-vous sûr de vouloir supprimer cet Ordre de Mission ?",
      Yes: "Oui",
      No: "Non",
      Prise_En_Charge: "Prise en charge totale",
      HeureRetour: "Heure de Retour",
      Select_Destination: "Sélectionner la Destination",
      Destination: "Destination",
      HeureDepart: "Heure de Départ",
      Select_Employee: "Sélectionner un Employé",
      NumOrdreMission: "Numéro d'Ordre de Mission",
      Add_New_OrderMission: "Ajouter un Nouvel Ordre de Mission",
      Error_Adding_Or_Updating_OrderMission:
        "Erreur lors de l'ajout ou de la mise à jour de l'ordre de mission",
      OrdreMission_Added_Successfully: "Ordre de Mission ajouté avec succès",
      Error_Fetching_Employee:
        "Erreur lors de la récupération des données de l'employé",
      DateRetourAfterDateDepart:
        "La date de retour ne peut pas être antérieure à la date de départ",
      DateDepart: "Date de départ",
      NetAPayer: "Net à payer",
      DateRetour: "Date de retour",
      List_Etat: "List des etats ",
      Not_Paid: "Non Payée",
      Paid: "Payée",
      PrintPDF: "Imprimer",
      Back: "Retour",
      Mission_Etat: "N° Etat  :",
      AddNewEtat: "Crée Etat",
      SelectEmployee: "Selectionné un Employé ",
      Select: "Selectionner",
      Save: "Sauvegarder ",
      NbrDejeuner: "N° Dejeuner",
      DecompteDejeuner: "Decompte Dejeuner",
      NbrDiner: "N° Dinner",
      DecompteDiner: "Decompte Dinner",
      NbrDecoucher: "N° Decoucher",
      DecompteDecoucher: "Decompte Decoucher",
      Enter_Grade: "Saisir Grade",
      PrintMandat: "Imprimer Mandat",
      NameArabic: "الاسم و اللقب",
      PrintAllOrderMission: "Imprimer tous les ordres mission",
      From: "De :",
      To: "A:",
      Missions_for: "Missions Pour  ",
      State: "Etat",
      Mandat: "Mandat",
      Print: "Imprimer",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

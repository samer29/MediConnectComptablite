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
      RequiredField: "There fields can not be empty !",
      Succes: "Success ! ",
      Add_Budget_Succes: "Added Successfully",
      Error_Adding_Or_Updating_Budget:
        "There is an error while adding or updating !",
      Add_New_Budget: "Add New Article to the budget",
      Close: "Close",
      Add: "Submit",
      Edit_Budget: "Edit Article",
      Budget_Updated_Successfully: "Article updated successfully",
      Update: "Update ",
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
      Home: "Acceuil",
      employees: "Employés",
      mission_order: "Ordre Mission",
      Settings: "Paramètres",
      Printing: "Impression",
      About: "À propos !",
      Title_I: "Titre I",
      Title_II: "Titre II",
      Title: "Titre",
      Article: "Article",
      Chapter: "Chapitre",
      Amount: "Montant",
      Error: "Erreur",
      RequiredField: "Tous les champs sont obligatoires",
      Succes: "Succès ! ",
      Add_Budget_Succes: "Ajouté avec succès",
      Error_Adding_Or_Updating_Budget: "Erreur d'Ajout  ou modification!",
      Add_New_Budget: "Ajouter un nouveau article ",
      Close: "Fermer",
      Add: "Valider",
      Edit_Budget: "Modifier un Article",
      Budget_Updated_Successfully: "Modification avec succès",
      Update: "Mettre a jour ",
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

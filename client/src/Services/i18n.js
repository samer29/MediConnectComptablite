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
      Settings: "Parametres",
      Printing: "Impression",
      About: "A Propo",
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

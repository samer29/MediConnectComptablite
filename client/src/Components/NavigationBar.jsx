import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "../Style/NavigationBar.css";
import searchIcon from "../assets/search.png";
import profileIcon from "../assets/profile.svg";
import arrowIcon from "../assets/Vector.svg";

const NavigationBar = ({ setAuth }) => {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="nav-bar">
      <div className="nav-search">
        <input
          id="search-input"
          type="search"
          aria-label={t('Search')}
          placeholder={t('Search')}
        />
        <img src={searchIcon} alt="Search Icon" className="search-icon" />
      </div>
      <div className="nav-profile" onClick={toggleDropdown}>
        <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
        <img src={arrowIcon} alt="Vector Icon" className="vector-icon" />
        {dropdownOpen && (
          <div className="dropdown-menu">
            <a href="/profile" className="dropdown-item">{t('Profile')}</a>
            <button onClick={handleLogout} className="dropdown-item">{t('Logout')}</button>
            <div className="dropdown-item" onClick={() => changeLanguage('en')}>{t('English')}</div>
            <div className="dropdown-item" onClick={() => changeLanguage('fr')}>{t('French')}</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;

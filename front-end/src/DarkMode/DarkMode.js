import React from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";

const DarkMode = () => {
  //function to select dom elements and set attributes for dark mode
  function setDarkMode() {
    document.querySelector("body").setAttribute("data-theme", "dark");
    //locally stores your settings on refresh/reload
    localStorage.setItem("selectedTheme", "dark");
  }
  //function to select dom elements and set attributes for dark mode
  function setLightMode() {
    document.querySelector("body").setAttribute("data-theme", "light");
    //locally stores your settings on refresh/reload
    localStorage.setItem("selectedTheme", "light");
  }

  const selectedTheme = localStorage.getItem("selectedTheme");
  //Accesses local storage sets appropriate mode
  if (selectedTheme === "dark") setDarkMode();
  //function for toggling dark/light mode
  function toggleTheme(event) {
    if (event.target.checked) setDarkMode();
    else setLightMode();
  }
  return (
    <>
      <h5>Theme</h5>
      <div className="dark_mode">
        <input
          className="dark_mode_input"
          type="checkbox"
          id="darkmode-toggle"
          onChange={toggleTheme}
          defaultChecked={selectedTheme === "dark"}
        />
        <label className="dark_mode_label" for="darkmode-toggle">
          <Sun />
          <Moon />
        </label>
      </div>
    </>
  );
};

export default DarkMode;

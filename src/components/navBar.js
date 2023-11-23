import React from "react";
import { THEMES, setTheme } from "../theme.js";

function NavBar() {
  return (
    <div className="App d-flex mt-0 me-2">
      <header className="App-header">
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
          <div className="container-fluid">
            <button className="navbar-brand">WeSchedule</button>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarColor01">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <button className="nav-link">Calander</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link">Files</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link">Teams</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link">Chats</button>
                </li>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Themes</button>
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => setTheme(0)}>{THEMES[0]}</button>
                    <button className="dropdown-item" onClick={() => setTheme(1)}>{THEMES[1]}</button>
                    <button className="dropdown-item" onClick={() => setTheme(2)}>{THEMES[2]}</button>
                    <button className="dropdown-item" onClick={() => setTheme(3)}>{THEMES[3]}</button>
                  </div>
                </li>

              </ul>
            </div>
            <li className="nav-item">
              {/* Curious why it matters what the class name is in relation to the link I put in the index.html and the account_box name */}
              <button className="nav-link"><span className="material-symbols-outlined">account_box</span></button>
            </li>
          </div>
        </nav>
      </header>
    </div>

  );
}
export default NavBar;
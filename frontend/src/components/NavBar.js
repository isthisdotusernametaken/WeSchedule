import React from "react";
import { THEMES, setTheme } from "../theme.js";

function NavBar({ username, name }) {
    return (
        // JSX was originally BootSwatch HTML and has been heavily modified to fit our site by Caleb Krauter.
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                {/* Logo and title */}
                <img src="logo.png" width={40} height={40} alt="Logo" />
                <button className="navbar-brand">WeSchedule</button>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Theme selection */}
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item dropdown">
                            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Themes</button>
                            <div className="dropdown-menu">
                                <button className="dropdown-item" onClick={() => setTheme(0)}>{THEMES[0]}</button>
                                <button className="dropdown-item" onClick={() => setTheme(1)}>{THEMES[1]}</button>
                                <button className="dropdown-item" onClick={() => setTheme(2)}>{THEMES[2]}</button>
                                <button className="dropdown-item" onClick={() => setTheme(3)}>{THEMES[3]}</button>
                            </div>
                        </li>

                    </ul>
                </div>

                {/* Current account details */}
                <h5>{name != null ? "Welcome, " + name : "Not Logged In"}</h5>
                <h6 className="ms-5">{username != null && "Logged in as " + username}</h6>
            </div>
        </nav>
    );
}
export default NavBar;

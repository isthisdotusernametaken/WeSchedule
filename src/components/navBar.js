import React from "react";
import { THEMES, setTheme } from "./theme.js";
import { handleTheme } from './themeHandler.js';
function navBar() {
    const handleSend1 = async () => {
        // setTheme("Dark 1");
        handleTheme("Dark 1");
      }
      const handleSend2 = async () => {
        // setTheme("Dark 2");
        handleTheme("Dark 2");
    
      }
      const handleSend3 = async () => {
        // setTheme("Light 1");
        handleTheme("Light 1");
    
      }
      const handleSend4 = async () => {
        // setTheme("Light 2");
        handleTheme("Light 2");
    
      }    
      return (
        
          <div className="App d-flex mt-0 me-2">
          <header className="App-header">
          <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div class="container-fluid">
        <button class="navbar-brand">WeSchedule</button>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarColor01">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <button class="nav-link">Calander</button>
            </li>
            <li class="nav-item">
              <button class="nav-link">Files</button>
            </li>
            <li class="nav-item">
              <button class="nav-link">Teams</button>
            </li>
            <li class="nav-item">
              <button class="nav-link">Chats</button>
            </li>
            <li class="nav-item dropdown">
              <button class="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Themes</button>
              <div class="dropdown-menu">
                <button class="dropdown-item" onClick={handleSend1}>Dark 1</button>
                <button class="dropdown-item" onClick={handleSend2}>Dark 2</button>
                <button class="dropdown-item" onClick={handleSend3}>Light 1</button>
                <button class="dropdown-item" onClick={handleSend4}>Light 2</button>
              </div>
            </li>
            
          </ul>
        </div>
        <li class="nav-item">
          {/* Curious why it matters what the class name is in relation to the link I put in the index.html and the account_box name */}
          <button class="nav-link"><span class="material-symbols-outlined">account_box</span></button>
        </li>
      </div>
      </nav>
          </header>
        </div>
      
      );
}
export default navBar;
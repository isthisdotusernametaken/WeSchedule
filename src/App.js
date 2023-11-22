import logo from './logo.svg';
import './App.css';
import React from "react";
import { THEMES, setTheme } from "./components/theme.js";
import { handleTheme } from './components/themeHandler.js';

function App() {

  // This is a hook.
  // const [input, setInput] = useState("");

  // I intend to consolidate these functions and rename it.
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
            <button className="dropdown-item" onClick={handleSend1}>Dark 1</button>
            <button className="dropdown-item" onClick={handleSend2}>Dark 2</button>
            <button className="dropdown-item" onClick={handleSend3}>Light 1</button>
            <button className="dropdown-item" onClick={handleSend4}>Light 2</button>
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

export default App;

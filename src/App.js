import logo from './logo.svg';
import './App.css';
import React from "react";
import { THEMES, setTheme } from "./theme.js";

function App() {

  // This is a hook.
  // const [input, setInput] = useState("");

  // I intend to consolidate these functions and rename it.
  const handleSend1 = async () => {
    setTheme("Dark 1");
  }
  const handleSend2 = async () => {
    setTheme("Dark 2");
  }
  const handleSend3 = async () => {
    setTheme("Light 1");
  }
  const handleSend4 = async () => {
    setTheme("Light 2");
  }
  return (
    <div className="App">
      <header className="App-header">
      <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">WeSchedule</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">Calander</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Files</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Teams</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Chats</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Themes</a>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="#" onClick={handleSend1}>Dark 1</a>
            <a class="dropdown-item" href="#" onClick={handleSend2}>Dark 2</a>
            <a class="dropdown-item" href="#" onClick={handleSend3}>Light 1</a>
            <a class="dropdown-item" href="#" onClick={handleSend4}>Light 2</a>
          </div>
        </li>
        
      </ul>
    </div>
    <li class="nav-item">
      {/* Curious why it matters what the class name is in relation to the link I put in the index.html and the account_box name */}
      <a class="nav-link" href="#"><span class="material-symbols-outlined">account_box</span></a>
    </li>
  </div>
</nav>
      </header>
    </div>
  );
}

export default App;

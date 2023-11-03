import logo from './logo.svg';
import './App.css';
import React from "react";
import { THEMES, setTheme } from "./theme.js";

function App() {

  // This is a hook.
  // const [input, setInput] = useState("");

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
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link active" href="#">Home
            <span class="visually-hidden">(current)</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">About</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="#" onClick={handleSend1}>Dark 1</a>
            <a class="dropdown-item" href="#" onClick={handleSend2}>Dark 2</a>
            <a class="dropdown-item" href="#" onClick={handleSend3}>Light 1</a>
            {/* <div class="dropdown-divider"></div> */}
            <a class="dropdown-item" href="#" onClick={handleSend4}>Light 2</a>
          </div>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-sm-2" type="search" placeholder="Search"/>
        <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
      </header>
    </div>
  );
}

export default App;

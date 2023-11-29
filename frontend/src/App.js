import './App.css';
import React from "react";
import NavBar from './components/NavBar';
import MessageCenter from "./components/MessageCenter";

function App() {
    return (
        <>
            <header><NavBar /></header>
            <body><MessageCenter /></body>
        </>
    );
}

export default App;

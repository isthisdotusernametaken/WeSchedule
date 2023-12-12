import './App.css';
import React from "react";
import NavBar from './components/NavBar';
import SignInOrUp from './components/SignInOrUp';

function App() {
    return (
        <>
            <header><NavBar /></header>
            <SignInOrUp />
        </>
    );
}

export default App;

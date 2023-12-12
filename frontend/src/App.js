import './App.css';

import React, { useEffect, useState } from "react";
import axios from "axios"

import NavBar from './components/NavBar';
import TabPanel from './components/TabPanel';
import Tab from './components/Tab';
import Account from './components/Account';

function App() {
    const [userInfo, setUserInfo] = useState({username: 1, name: 2});
    const [languages, setLanguages] = useState(null);
    
    useEffect(() => {
        loadLangs(setLanguages); // Get the list of languages the app supports
    }, []);

    return (
        <>
            {/* The app title and logo, the user's username and name, and the color theme chooser. */}
            <header><NavBar username={userInfo.username} name={userInfo.name} /></header>

            {/* Tab selection bar and selected tab's body. Hide all tabs but account if logged out */}
            <TabPanel panelId="main-panel">
                <Tab title="Account">
                    <Account userInfo={userInfo} setUserInfo={setUserInfo} languages={languages} /></Tab>
                {userInfo.name != null && <Tab title="Wheat"></Tab>}
                {userInfo.name != null && <Tab title="Weather"></Tab>}
            </TabPanel>
        </>
    );
}

const loadLangs = setLanguages =>
    axios.get(
        "http://localhost:3001/language"
    ).then(res =>
        setLanguages(res.data)
    ).catch(err =>
        setLanguages({en: "English"})
    );

export default App;

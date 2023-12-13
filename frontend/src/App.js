import './App.css';

import React, { useEffect, useState } from "react";

import { get } from './backendRequest';

import NavBar from './components/NavBar';
import TabPanel from './components/TabPanel';
import Tab from './components/Tab';
import Account from './components/Account';
import Groups from './components/Groups';

// The main/outer view of the client app. Connects the files in /src/components
function App() {
    const [languages, setLanguages] = useState({});

    // Currently selected user, group, and topic
    const [user, setUser] = useState({});
    const [group, setGroup] = useState({});
    const [topic, setTopic] = useState({});

    // Current user's groups, group's topics and members and logs, and topic's
    // members and messages and events. This information is loaded when the
    // user clicks on the associated tab.
    const [groups, setGroups] = useState([]);
    const [logs, setLogs] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [topics, setTopics] = useState([]);
    const [topicMembers, setTopicMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [messages, setMessages] = useState([]);

    

    // Clear all info (when the user is logged out or cannot be validated)
    const clearInfo = () => {
        setUser({});
        setGroup({});
        setTopic({});
        setGroups([]);
        setLogs({});
        setGroupMembers([]);
        setTopics([]);
        setTopicMembers([]);
        setEvents([]);
        setMessages([]);
    }

    // Logout and hide tabs
    const logout = () => {
        clearInfo();
        get("/auth/logout");
    }

    // Reload user information for the session from server
    const loadUser = () =>
        get("/users").then(res => {
            setUser(res.data);
        }).catch(err => { // Can't verify user, clear all info
            clearInfo();
        });
    
    const loadGroups = () =>
        get("/groups").then(res => {
            setGroups(res.data);
        }).catch(err => { // Can't verify user
            clearInfo();
        });


    // When the user loads the page:
    useEffect(() => {
        // Get the list of languages the app supports
        get("/language").then(res =>
            setLanguages(res.data)
        ).catch(err =>
            setLanguages({ en: "English" })
        );

        // Get the logged in user's details on load
        loadUser();
        // eslint-disable-next-line
    }, []);


    return (
        <>
            {/* The app title and logo, the user's username and name, and the color theme chooser. */}
            <header><NavBar username={user.username} name={user.name} /></header>

            {/*
                Tab selection bar and selected tab's body.
                Hide all tabs after Account if logged out.
                Hide all tabs after Groups if no group is selected.
                Hide all tabs after Topics if no topic is selected.

                When a tab other than the Account tab is clicked, the data
                associated with that tab is loaded from the server.
            */}
            <TabPanel panelId="main-panel">
                <Tab title="Account">
                    <Account user={user} logout={logout} loadUser={loadUser} languages={languages} /></Tab>
                
                {/* Display or hide user's groups */}
                {user.username != null &&
                    <Tab title={"Groups" + (group.gid ? ` (${group.name})` : "")} onClick={loadGroups}>
                        <Groups groups={groups} name={user.name} username={user.username} group={group} setGroup={setGroup} /></Tab>}

                {/* Display or hide info about chosen group */}
                {group.gid != null && <Tab title="Group Members"></Tab>}
                {group.gid != null && <Tab title="Log"></Tab>}
                {group.gid != null && <Tab title="Topics"></Tab>}

                
                {/* Display or hide info about chosen group */}
                {topic.topic != null && <Tab title="Topic Members"></Tab>}
                {topic.topic != null && <Tab title="Events"></Tab>}
                {topic.topic != null && <Tab title="Messages"></Tab>}
            </TabPanel>
        </>
    );
}


export default App;

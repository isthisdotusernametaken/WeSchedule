import './App.css';

import React, { useEffect, useState } from "react";

import { get } from './backendRequest';

import NavBar from './components/NavBar';
import TabPanel from './components/TabPanel';
import Tab from './components/Tab';
import Account from './components/Account';
import Groups from './components/Groups';
import GroupMembers from './components/GroupMembers';
import Logs from './components/Logs';
import Topics from './components/Topics';
import TopicMembers from './components/TopicMembers';
import Events from './components/Events';
import MessageCenter from './components/MessageCenter';

// The main/outer view of the client app. Connects the files in /src/components
function App() {
    const [languages, setLanguages] = useState({});

    // Currently selected user, group, and topic
    const [user, setUser] = useState({});
    const [group, setGroup] = useState({});
    const [topic, setTopic] = useState({});

    // Message translation toggle
    const [translate, setTranslate] = useState(false);

    // Date after which to show events for
    const [eventsAfter, setEventsAfter] = useState(new Date());

    // Start of endpoints using selected group and topic
    const groupRID = () => `/groups/${group.gid}`;
    const topicRID = () => `${groupRID()}/topics/${topic.topic}`;
    const eventsRID = () => `${topicRID()}/events`;

    // Current and other users' permissions in selected group
    const otherLocalAdmin = username =>
        groupMembers?.find(member => member.username === username)?.local_admin;
    const localAdmin = () => otherLocalAdmin(user.username);
    const eventPerm = () =>
        topicMembers?.find(member => member.username === user.username)?.event_perm;
    const messagePerm = () =>
        topicMembers?.find(member => member.username === user.username)?.message_perm;


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


    // Clear all info dependent on badData (e.g., all info when the user is
    // logged out or cannot be validated).
    const clearInfo = badData => {
        setMessages([]);
        setEvents([]);
        setTopicMembers([]);
        if (badData === "beforeTopic") return;
        setTopic({});
        if (badData === "topic") return;

        setTopics([]);
        setGroupMembers([]);
        setLogs([]);
        if (badData === "beforeGroup") return;
        setGroup({});
        if (badData === "group") return;

        setGroups([]);
        setUser({});
    }
    const clearUser = () => clearInfo("user");
    const clearTopic = () => clearInfo("topic");
    const clearGroup = () => clearInfo("group");
    const clearBeforeTopic = () => clearInfo("beforeTopic");
    const clearBeforeGroup = () => clearInfo("beforeGroup");

    // Logout and hide tabs
    const logout = () => {
        clearInfo("user");
        get("/auth/logout");
    }

    // Reload the data this user can access from server. If can't verify, clear
    // later dependent info. The UI's structure is intended to prevent these
    // requests from being invalid as long as the current group, topic, etc. is
    // not deleted or moved while the user is working, which should be rare.
    const load = (url, setter, clear, ...args) =>
        get(url, ...args).then(res => setter(res.data)).catch(clear);
    const loadUser = () =>
        load("/users", setUser, clearUser);
    const loadGroups = () =>
        load("/groups", setGroups, clearUser);
    const loadLogs = () =>
        load(`${groupRID()}/log`, setLogs, clearGroup);
    const loadGroupMembers = () =>
        load(`${groupRID()}/users`, setGroupMembers, clearGroup);
    const loadTopics = () =>
        load(`${groupRID()}/topics`, setTopics, clearGroup, { headers: { Desc: true } });
    const loadTopicMembers = () =>
        load(`${topicRID()}/users`, setTopicMembers, clearTopic);
    const loadEvents = () =>
        load(`${topicRID()}/events`, setEvents, clearTopic, { headers: { After: eventsAfter } });
    const loadMessages = () =>
        load(`${topicRID()}/messages`, setMessages, clearTopic, { headers: { Translate: translate } });


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


    // Group members and topic members are preemptively loaded when groups and
    // topics are selected; this ensures permission information can be accessed
    // by other tabs.
    // When the group is changed:
    useEffect(() => {
        if (group.gid != null) loadGroupMembers();
        // eslint-disable-next-line
    }, [group]);
    // When the topic is changed:
    useEffect(() => {
        if (topic.topic != null) loadTopicMembers();
        // eslint-disable-next-line
    }, [topic]);


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
                        <Groups groups={groups} name={user.name} username={user.username}
                            group={group} setGroup={setGroup} clearGroup={clearGroup} clearBeforeGroup={clearBeforeGroup} loadGroups={loadGroups} groupRID={groupRID} /></Tab>}

                {/* Display or hide info about chosen group */}
                {group.gid != null &&
                    <Tab title="Log" onClick={loadLogs}>
                        <Logs localAdmin={localAdmin} logs={logs} loadLogs={loadLogs} groupName={group.name} groupRID={groupRID} /></Tab>}
                {group.gid != null &&
                    <Tab title="Group Members" onClick={loadGroupMembers}>
                        <GroupMembers username={user.username} localAdmin={localAdmin} groupOwner={group.owner_username}
                            groupName={group.name} groupMembers={groupMembers} loadGroupMembers={loadGroupMembers} groupRID={groupRID} /></Tab>}
                {group.gid != null &&
                    <Tab title={"Topics" + (topic.topic ? ` (${topic.topic})` : "")} onClick={loadTopics}>
                        <Topics localAdmin={localAdmin} username={user.username} group={group} topics={topics} topic={topic}
                            setTopic={setTopic} clearTopic={clearTopic} clearBeforeTopic={clearBeforeTopic} loadTopics={loadTopics}
                            groupRID={groupRID} topicRID={topicRID} /></Tab>}


                {/* Display or hide info about chosen group */}
                {topic.topic != null &&
                    <Tab title="Topic Members" onClick={loadTopicMembers}>
                        <TopicMembers localAdmin={localAdmin} otherLocalAdmin={otherLocalAdmin} topicName={topic.topic}
                            topicMembers={topicMembers} loadTopicMembers={loadTopicMembers} topicRID={topicRID} /></Tab>}
                {topic.topic != null &&
                    <Tab title="Events" onClick={loadEvents}>
                        <Events eventPerm={eventPerm} topicName={topic.topic} events={events} eventsAfter={eventsAfter}
                            setEventsAfter={setEventsAfter} loadEvents={loadEvents} eventsRID={eventsRID} /></Tab>}
                {topic.topic != null &&
                    <Tab title="Messages" onClick={loadMessages}>
                        <MessageCenter messagePerm={messagePerm} messages={messages} loadMessages={loadMessages}
                            setTranslate={setTranslate} topicRID={topicRID} /></Tab>}
            </TabPanel>
        </>
    );
}


export default App;

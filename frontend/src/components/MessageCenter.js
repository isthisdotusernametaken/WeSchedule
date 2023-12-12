import React, { useEffect, useRef, useState } from "react";
import Groups from "./Groups.js"
// Created by:
// Caleb,
// Josh
// Some of the React and jsx is inspired and was originally derrived from Assignment 3 script.js but has
// been heavily changed.
function MessageCenter({user}) {

    // Use state hooks to store the messages and the current message being sent.
    const [correspondence, setMessages] = useState([]);
    const [groups, addGroup] = useState([]);
    const [members, addMember] = useState([]);
    const [topics, addTopic] = useState([]);
    const [membersOfTopic, addMemberToTopic] = useState([]);
    const [logs, log] = useState([]);



    const inputField = useRef(null);
    const latestMsg = useRef(null);

    const createGroup = () => {
        addGroup([...groups, {name: "Cod Squad", owner: "Caleb Krauter", creationDate: "Group Creation Date", joinedDate: "Joined Date"}]);
        console.log(groups);
    };

    // const createMembers = () => {
    //     addMember([...members, {username: "user", joinedDate: "Joined time", adminStatus: "true/false"}]);
    // }

    // const createTopic = () => {
    //     addTopic([...topics, {topicName: "Topic Name", description: "About"}]);
    // }

    // const addMemberToCurTopic = () => {
    //     addMemberToTopic([...topics, {username: "username", eventPermission: "True/False", msgPermission: "True/False"}]);
    // }

    // const logDetails = () => {
    //     log([...logs, {time: "time", description: "description"}]);
    // }

    const loadGroup = () => {
        // Load corespondance based on group.
        console.log("hi");
    };
    // Used resource for this useEffect idea (https://reacthustle.com/blog/react-auto-scroll-to-bottom-tutorial)
    // to implement auto-scroll to bottom.
    useEffect(() => {
        if (latestMsg.current != null) {
            latestMsg.current.scrollTop = latestMsg.current.scrollHeight;
        }
    }, [correspondence]);

    // Learned to format time below from chatGPT 3.5.
    const timeFormat = {
        weekday: "long",
        year: "2-digit",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short"
    }

    const send = () => {
        let message = inputField.current.value.trim();
        if (message === "" || message === null) {
            alert("Please don't send nothing. Thanks :)")
            inputField.current.value = "";
        } else {
            setMessages([...correspondence, {user: user, time: (new Date()).toLocaleDateString("en-US", timeFormat), content: message}]);
            inputField.current.value = "";
        }
        
    }

    return (
        // For getting started on bootstrap this resource was used (https://youtu.be/eow125xV5-c?si=SkyOKDeQ2Z2mMK8P)
        <div className="border border-success p-2 mb-2" data-bs-theme="dark">
           <div className="groups-area p-2 mb-2 rounded-4">
                <button onClick={createGroup}>+</button>
                {/* <button onClick={loadGroup}>Load group</button> */}
                <div className="select-group-btn p-1 d-flex border bg-dark rounded-4">{groups.map(Groups)}</div>
            </div>
            <div className="container inner-frame p-1 d-flex flex-column border bg-dark">
                <div ref={latestMsg} className="h-100 overflow-auto">
                    {correspondence.map(MessageBubble)}
                </div>
                <button className="translate-button">T</button>
                <div>
                    <input ref={inputField} type="textfield" id="input-msg-field" className="chat-field" autoComplete="off"></input>
                    <button onClick={send} className="chat-send">
                        {/* Send icon is from Google Fonts.*/}
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    );

}


const MessageBubble = ({
    user,
    time,
    content
}) => 
    <div className="rounded-4 p-1 my-4 message-box message-left p-1 message-outgoing">
        <p>{user}: <p>{content}</p> </p>
        <div className="rounded-3 p-1 time">
            <p>{time.toString()}</p>
        </div>
    </div>



const MembersOfCurGroup = ({
    username,
    joinedDate,
    adminStatus
// component to display all the members of the current group (with username, joined date, and admin status for each);
}) =>
    <div>
        <p>{username} | Is admin: {adminStatus}</p>
        <p>Joined Group on: {joinedDate}</p>
    </div>

const TopicsOfCurGroup = ({
    topicName,
    description
// component to display all of the topics a user belongs to within the current group (with topic name and description for each);
}) =>
    <div>
        <p>{topicName}</p>
        <p>Description: {description}</p>
    </div>

const MembersOfCurTopic = ({
    username,
    eventPermission,
    msgPermission
    // component to display all the members of the current topic (with username, event creation permission, and message creation permission for each);

}) => 
    <div>
        <p>{username}</p>
        <p>Create events T/F: {eventPermission}</p>
        <p>Create msg T/F: {msgPermission}</p>
    </div>

const Logs = ({
    time,
    description
    // component to display all log entries for a group (with time and description for each)
}) =>
    <div>
        <p>{time}</p>
        <p>{description}</p>
    </div>
export default MessageCenter;

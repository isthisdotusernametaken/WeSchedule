import React, { useEffect, useRef, useState } from "react";
import Groups from "./Groups.js";
import MessageBubble from "./MessageBubble.js";
// Created by:
// Caleb,
// Josh
// Some of the React and jsx is inspired and was originally derrived from Assignment 3 script.js but has
// been heavily changed.
function MessageCenter({user}) {

    // Use state hooks to store the messages and the current message being sent.
    const [correspondence, setMessages] = useState([]);
    let [btnActive, setBtnActive] = useState(false);



    const inputField = useRef(null);
    const latestMsg = useRef(null);

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

    // Learned to format time below from chatGPT 3.5. ->Caleb
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

    // This function is somewhat inspired by an exmaple found using chatGPT 3.5 ->Caleb
    const checkState = () => {
        if (btnActive) {
            setBtnActive(false);
            document.getElementById("translate-button").style.backgroundColor = "#2b2a32";
            console.log("set to off");
        } else if (!btnActive) {
            setBtnActive(true);
            document.getElementById("translate-button").style.backgroundColor = "red";
            console.log("set to on");
        }
    }

    return (
        // For getting started on bootstrap this resource was used (https://youtu.be/eow125xV5-c?si=SkyOKDeQ2Z2mMK8P)
        <div className="border border-success p-2 mb-2" data-bs-theme="dark">
           {/* <div className="groups-area p-2 mb-2 rounded-4">
                <button onClick={createGroup}>+</button>
                <button onClick={loadGroup}>Load group</button>
                <div className="select-group-btn p-1 d-flex border bg-dark rounded-4">{groups.map(Groups)}</div>
            </div> */}
            <div className="container inner-frame p-1 d-flex flex-column border bg-dark">
                <div ref={latestMsg} className="h-100 overflow-auto">
                    {correspondence.map(MessageBubble)}
                </div>
                <button onClick={checkState} className="translate-button rounded-circle" id="translate-button">
                    <span className="material-symbols-outlined translate-icon">
                        translate
                    </span>
                </button>
                    <div className="text-white mb-1">Translate</div>
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

export default MessageCenter;

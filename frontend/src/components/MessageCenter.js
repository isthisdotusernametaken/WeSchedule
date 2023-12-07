import React, { useEffect, useRef, useState } from "react";
// import send from "send";

// Created by:
// Caleb,
// Josh
// Some of the React and jsx is inspired and was originally derrived from Assignment 3 script.js but has
// been heavily changed.
function MessageCenter({user}) {

    // Use state hooks to store the messages and the current message being sent.
    const [correspondence, setMessages] = useState([]);
    const inputField = useRef(null);
    const latestMsg = useRef(null);

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
            setMessages([...correspondence, {user: user, time: (new Date()).toLocaleDateString("en-US", timeFormat),content: message}]);
            inputField.current.value = "";
        }
        
    }

    return (
        // For getting started on bootstrap this resource was used (https://youtu.be/eow125xV5-c?si=SkyOKDeQ2Z2mMK8P)
        <div className="border border-success p-2 mb-2" data-bs-theme="dark">
            <div className="container inner-frame p-1 d-flex flex-column border bg-dark">
                <div ref={latestMsg} className="h-100 overflow-auto">
                    {correspondence.map(MessageBubble)}
                </div>
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

export default MessageCenter;

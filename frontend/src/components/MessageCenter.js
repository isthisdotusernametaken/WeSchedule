import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.js";
import { post } from "../backendRequest.js";
import Message, { clearAndCallbackHandler, errHandler } from "./Message.js";
// Created by:
// Caleb,
// Josh
// Some of the React and jsx is inspired and was originally derrived from Assignment 3 script.js but has
// been heavily changed.
function MessageCenter({ messagePerm, messages, loadMessages, setTranslate, topicRID }) {
    const inputField = useRef(null);
    const messageHolder = useRef(null);

    // Display/clear error messages
    const [notifMessage, setNotifMessage] = useState([true, null]);
    const setErr = errHandler(setNotifMessage);
    const succ = clearAndCallbackHandler(setNotifMessage, loadMessages);

    // Used resource for this useEffect idea (https://reacthustle.com/blog/react-auto-scroll-to-bottom-tutorial)
    // to implement auto-scroll to bottom.
    useEffect(() => {
        if (messageHolder.current != null) {
            messageHolder.current.scrollTop = messageHolder.current.scrollHeight;
        }
    }, [messages]);


    const send = () => {
        let message = inputField.current?.value?.trim();
        if (message !== "" && message != null) {
            inputField.current.value = "";

            post(`${topicRID()}/messages`, { text: message }).then(succ).catch(setErr);
        }
    }

    // This function is somewhat inspired by an exmaple found using chatGPT 3.5 ->Caleb
    const checkState = () => {
        setTranslate(old => {
            if (old) {
                document.getElementById("translate-button").style.backgroundColor = "#2b2a32";
                return false;
            } else {
                document.getElementById("translate-button").style.backgroundColor = "red";
                return true;
            }
        })
    }

    return (
        // For getting started on bootstrap this resource was used (https://youtu.be/eow125xV5-c?si=SkyOKDeQ2Z2mMK8P)
        <div className="border border-success p-2 mb-2" data-bs-theme="dark">
            <button className="btn btn-success" onClick={loadMessages}>Refresh</button>
            <div className="container inner-frame p-1 d-flex flex-column border bg-dark">
                <div ref={messageHolder} className="h-100 overflow-auto">
                    {messages.map(MessageBubble)}
                </div>
                <button onClick={checkState} className="translate-button rounded-circle" id="translate-button">
                    <span className="material-symbols-outlined translate-icon">
                        translate
                    </span>
                </button>
                <div className="text-white mb-1">Translate</div>
                {!!messagePerm() && <div>
                    <input ref={inputField} type="textfield" id="input-msg-field" className="chat-field" autoComplete="off"></input>
                    <button onClick={send} className="chat-send">
                        {/* Send icon is from Google Fonts.*/}
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>}
            </div>

            <div className="mt-2">
                <Message succ={notifMessage[0]} title={notifMessage[1]} />
            </div>
        </div>
    );

}

export default MessageCenter;

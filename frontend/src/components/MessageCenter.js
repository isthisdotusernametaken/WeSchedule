import React, { useEffect, useRef, useState } from "react";
import { THEMES, setTheme } from "../theme.js";
import { message } from "statuses";
function MessageCenter({user}) {

    // Use state hooks to store the messages and the current message being sent.
    const [correspondence, setMessages] = useState([]);
    const inputField = useRef(null);
    const latestMsg = useRef(null);

    useEffect(() => {
        if (latestMsg.current != null) {
            latestMsg.current.scrollTop = latestMsg.current.scrollHeight;
        }
    }, [correspondence]);

    const send = () => {
        let message = inputField.current.value.trim();
        if (message === "") {
            console.log("No message sent.")
        } else {
            setMessages([...correspondence, {user: user, time: new Date(),content: message}]);
            inputField.current.value = "";
        }
    }

    return (
        <div className="border border-success p-2 mb-2" data-bs-theme="dark">
            <div className="container inner-frame p-1 d-flex flex-column border bg-dark">
                <div ref={latestMsg} className="h-100 overflow-auto">
                    {correspondence.map(MessageBubble)}
                </div>
                
            </div>
                <div className="">
                    <input ref={inputField} type="textfield" id="input-msg-field" className="chat-input"></input>
                    <button onClick={send}>+</button>
                </div>
        </div>
    );
}

const MessageBubble = ({
    user,
    time,
    content
}) => 
    <div className="rounded-2 p-1 my-4 message-box message-left p-3 message-outgoing">
        <p>{user}: {time.toString()}</p>
        <p>{content}</p>
    </div>

export default MessageCenter;

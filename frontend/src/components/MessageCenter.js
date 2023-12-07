import React, { useEffect, useRef, useState } from "react";
import { THEMES, setTheme } from "../theme.js";
import { message } from "statuses";
function MessageCenter() {

    // Use state hooks to store the messages and the current message being sent.
    const [corespondence, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const latestMessage = useRef(null);

    useEffect(() => {
        if (corespondence.length === 0) {
            document.getElementById("my-message-box-out").style.display = "none";
            document.getElementById("my-message-box-in").style.display = "none";
        }
    }); 
    const send = () => {
        document.getElementById("my-message-box-out").style.display = "block";
        document.getElementById("my-message-box-in").style.display = "block";
        
        if (newMessage.trim() === "") {
            console.log("No message sent.")
            return;
        } else {
            setMessages([...corespondence, {text: newMessage, sender: "YOU"}]);
            console.log(newMessage);
            const newMessageBubble = (
                `<div>User: ${newMessage}</div>`
            );
            document.getElementById("my-message-box-out").innerHTML += newMessageBubble + `<div><br></div>`;
            document.getElementById("my-message-box-in").innerHTML += newMessageBubble + `<div><br></div>`;
            latestMessage.current.scrollIntoView({ behavior: 'smooth' });
            document.getElementById("input-msg-field").value = "";
        }
    }

    return (
        <msgFrame className="border border-success p-2 mb-2" data-bs-theme="dark">
            <div className="container inner-frame p-1 col-sm-4 col-md-6 col-lg-6 float-start border bg-dark">
                <div id="my-message-box-out" className="message-box message-left p-3 message-outgoing p-0.5"></div>
                <div ref={latestMessage} id="my-message-box-in" className="message-box message-right p-3 message-incoming p-0.5"></div>

                <div className="row">
                    <input type="textfield" id="input-msg-field" className="chat-input" onChange={(e) => setNewMessage(e.target.value)}></input>
                    <button onClick={send}>+</button>
                </div>
            </div>
            
        </msgFrame>
    );
}


export default MessageCenter;

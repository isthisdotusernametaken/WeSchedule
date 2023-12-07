import React, { useState } from "react";
import { THEMES, setTheme } from "../theme.js";
import { message } from "statuses";
function MessageCenter() {

    // Use state hooks to store the messages and the current message being sent.
    const [corespondence, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const send = () => {
        if (newMessage.trim() === "") {
            console.log("No message sent.")
            return;
        } else {
            setMessages([...corespondence, {text: newMessage, sender: "YOU"}])
        }
    }

    return (
        <msgFrame className="border border-success p-2 mb-2" data-bs-theme="dark">
            <div className="container inner-frame p-1 col-sm-4 col-md-6 col-lg-6 float-start border bg-dark">
                <div className="row">
                    {/* 12 avaliable col */}
                    <div className="order-1 justify-content-start col-sm-4">
                        <div className="message-incoming p-0.5">OTHER</div>
                    </div>
                    <div className="justify-content-end order-2 col-sm-4 d-flex flex-row-reverse">
                        <div className="message-outgoing p-0.5">ME: {newMessage.text}</div>
                    </div>
                </div>
                <div className="row">
                    <input type="textfield" className="chat-input" onChange={(e) => setNewMessage(e.target.value)}></input>
                    <button onClick={send}>+</button>
                </div>
            </div>
            
        </msgFrame>
    );
}


export default MessageCenter;

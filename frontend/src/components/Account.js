// Author: Joshua Barbee

import { useState } from "react";

import Message, { errHandler, succHandler } from "./Message";
import SignInOrUp from "./SignInOrUp";
import AccountDetails from "./AccountDetails";

function Account(props) {
    // Display success/error messages
    const [message, setMessage] = useState([true, null]);

    const setErr = errHandler(setMessage);
    const setSucc = succHandler(setMessage);

    return (
        <>
            {/* Show Sign in/Sign up or account details, depending on whether the user is logged in. */}
            {props.user.username == null ?
                <SignInOrUp {...props} setErr={setErr} setSucc={setSucc} /> :
                <AccountDetails {...props} setErr={setErr} setSucc={setSucc} />}
            <Message succ={message[0]} title={message[1]} />
        </>
    );  
};

export default Account;

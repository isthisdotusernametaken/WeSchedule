// Caleb
// Josh

import { useRef, useState } from "react";
import { post } from "../backendRequest";
import { Card } from "./Card";
import Message, { clearAndCallbackHandler, errHandler } from "./Message";

const Logs = ({
    localAdmin, logs, loadLogs, groupName, groupRID
}) => {
    const newLogInput = useRef(null);

    // Display/clear error messages
    const [message, setMessage] = useState([true, null]);
    const setErr = errHandler(setMessage);
    const succ = clearAndCallbackHandler(setMessage, () => {
        loadLogs();
        if (newLogInput.current) newLogInput.current.value = "";
    }); // Clear error and reload logs

    return (
        <div>
            {localAdmin() && <div className="mb-3">
                <button className="btn btn-success" onClick={() => {
                    const newLogText = newLogInput.current ? newLogInput.current.value.trim() : "";
                    if (newLogText === "") return;

                    post(`${groupRID()}/log`, { description: newLogText }).then(succ).catch(setErr);
                }}>Add Log Point</button>
                <h6><label htmlFor="logsNewLog">Description</label></h6>
                <textarea ref={newLogInput} className="form-control" id="logsNewLog" rows="3"></textarea>
            </div>}

            <div className="mb-0">History of {groupName}:</div>
            {logs.map(Log)}

            <div className="mt-2">
                <Message succ={message[0]} title={message[1]} />
            </div>
        </div>
    );
}

const Log = ({
    // Take input
    time, description
}) =>
    <Card>
        <p>{time}</p>
        <p>{description}</p>
    </Card>

export default Logs;
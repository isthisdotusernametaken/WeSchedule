import { useState } from "react";

function Logs({
    group,
    canAdd
}) {

    const [logs, setLogs] = useState;

    return (
        <div>
            <button>Add Log</button>            
            {logs.map(Log)}
        </div>
    );
}
const Log = ({
    // Take input
    time,
    description
}) => {
    <div>
        <p>{time}</p>
        <p>Description: {description}</p>
        <input></input>
    </div>
    
}
export default Logs;
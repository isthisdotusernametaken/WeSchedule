import { useState } from "react";

function Logs({
    group,
    canAdd
}) {

    const [group, canAdd] = useState;

    return (
        <div>
            <button>
                <p>Add Log</p>
                {group.map(Log)}
            </button>            
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
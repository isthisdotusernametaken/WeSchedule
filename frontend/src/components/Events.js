import { useState } from "react";
    const [description, setDescription] = useState([]);

function Events({
    group,
    topic,
    canModify
        // component to display all log entries for a group (with time and description for each)

}) {

    return (
        <div>
            {/*Should get description of selected topic. */}
            <button onClick={setDescription(Event)}>Set Description</button>
            {/* If true add a delete and edit button one time.*/}
            {canModify ? 
                <div>
                    <input className="event-name"></input>
                    <input className="time-duration"></input>
                    <input className="description"></input>
                </div>
                // Can't edit, just add an empty div.
                 : <div/>}
        </div>
    );
}
const Event = ({
    eventName,
    description
// component to display all of the topics a user belongs to within the current group (with topic name and description for each);
}) =>
    <div>
        <p>{eventName}</p>
        {canModify ? 
            <div>
                <button>Delete</button>
                <button onClick={setDescription(description)}>Edit</button>
                <input className="event-name"></input>
                <input className="description"></input>
                <input className="time"></input>
            </div>
            :
            <div/>
        }
    </div>

export default Events;
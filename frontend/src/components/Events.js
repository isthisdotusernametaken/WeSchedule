import { useState } from "react";

function checkCanModify() {
    if (canModify) {
        return true;
    } else {
        return false;
    }
}

function Events({
    group,
    topic,
    canModify
        // component to display all log entries for a group (with time and description for each)

}) {
    const [event, setEvent] = useState([]);
    const [editSelected, setEditSelected] = useState(false);
    const [selected, setSelected] = useState(false);

    return (
        <div>
            {/* Select topic */}
            <button onClick={setEvent}>
                {event.map(Event)}
            </button>
            {/* If true add a delete and edit button one time.*/}
            {checkCanModify ? 
                <div>
                    <button>Delete</button>
                    <button onClick={selected 
                        ? setEditSelected(true) 
                        : setEditSelected(false)}>
                            Edit
                    </button>
                    {/* If edit is pressed, input pops up one time.*/}
                    {editSelected ? 
                    <div>
                        <input className="event-name"></input>
                        <input className="time-duration"></input>
                        <input className="description"></input>
                    </div>
                    : <div/>}
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
        {/* Check if event is selected and if so display description */}
        <button 
            onClick={selected 
            ? setSelected(true) 
            : setSelected(false)}>
                Topic
        </button>
        {selected ?  
            <p>Description: {description}</p>
            : 
            <div/>
            }
    </div>

export default Events;
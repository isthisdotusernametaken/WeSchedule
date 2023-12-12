import { useState } from "react";

function checkCanModify() {
    if (canModify) {
        return true;
    } else {
        return false;
    }
}

function Topics({
    group,
    setTopic,
    canModify
}) {
    const [topic, setTopic] = useState([]);
    const [editSelected, setEditSelected] = useState(false);
    const [selected, setSelected] = useState(false);

    return (
        <div>
            {/* Select topic */}
            <button onClick={setTopic}>
                {topic.map(Topics)}
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
                    <input></input>
                    : <div/>}
                </div>
                // Can't edit, just add an empty div.
                 : <div/>}
        </div>
    );
}
const Topics = ({
    topicName,
    description
// component to display all of the topics a user belongs to within the current group (with topic name and description for each);
}) =>
    <div>
        <p>{topicName}</p>
        {/* Check if topic is selected and if so display description */}
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

export default Topics;
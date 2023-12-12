import { useState } from "react";

const [description, setDescription] = useState([]);
function Topics({
    group,
    canModify
}, setTopic) {
    const [topics, setTopics] = useState([]);
    return (
        <div>
            {/* Select topic */}
            <button onClick={setTopics(Topic)}>Set Topic</button>
        </div>
    );
}
const Topic = ({
    topicName,
    description
// component to display all of the topics a user belongs to within the current group (with topic name and description for each);
}) =>
    <div>
        <p>{topicName}</p>
        {/* Check if topic is selected and if so display description */}

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

export default Topics;
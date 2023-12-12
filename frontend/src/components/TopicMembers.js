import { useState } from "react";

function TopicMembers({
    group,
    topic,
    canModify
}) {
    const [topicMembers, setTopicMembers] = useState([]);
    return (
        <div>
            <button>Add Member to Group</button>
                {topicMembers.map(TopicMember)}
            {/* If true add a delete and edit button one time.*/}
            {canModify ? 
                <div>
                    <button>Add</button>
                    <input></input>
                    {/* In case username is entered it needs
                    to be mapped to the new topic member. */}
                    {topicMembers.map(TopicMember)}                  
                </div>
                // Can't edit, just add an empty div.
                : 
                <div/>
            }
        </div>
    );
}
const TopicMember = ({
    username,
    eventPermission,
    msgPermission
}) => 
    <div>
        <p>{username}</p>
        <p>Create events T/F: {eventPermission}</p>
        <p>Create msg T/F: {msgPermission}</p>
        {canModify ?
            <div>
                <button>Delete</button>
                <button>Edit</button>
                <input className="topic-member-name"></input>
                <input className="topic-member-admin"></input>
                <input className="topic-member-msg-permission"></input>
            </div> 
            :
            <div/>
        }
        
    </div>
export default TopicMembers;
import { useState } from "react";

function checkCanModify() {
    if (canModify) {
        return true;
    } else {
        return false;
    }
}

function TopicMembers({
    group,
    topic,
    canModify
}) {
    const [topicMembers, setTopicMembers] = useState([]);
    const [editSelected, setEditSelected] = useState(false);

    return (
        <div>
            <button>
                <p>Add Member to Group</p>
                {membersInGroup.map(GroupMember)}
            </button>
            {/* If true add a delete and edit button one time.*/}
            {checkCanModify ? 
                <div>
                    <button>Add</button>
                    {checkCanModify ? 
                    <input></input>
                    : <div/>}
                    {/* In case username is entered it needs
                    to be mapped to the new topic member. */}
                    {topicMembers.map(TopicMember)}
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
const TopicMember = ({
    username,
    eventPermission,
    msgPermission
    // component to display all the members of the current topic (with username, event creation permission, and message creation permission for each);

}) => 
    <div>
        <p>{username}</p>
        <p>Create events T/F: {eventPermission}</p>
        <p>Create msg T/F: {msgPermission}</p>
    </div>
export default TopicMembers;
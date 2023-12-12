import { useState } from "react";

function checkCanModify() {
    if (canModify) {
        return true;
    } else {
        return false;
    }
}

function GroupMembers({
    group,
    canModify
}) {
    const [membersInGroup, setMemberInGroup] = useState([]);
    const [editSelected, setEditSelected] = useState([]);

    return (
        <div>
            {/* If true add a delete and edit button one time.*/}
            {checkCanModify ? 
                <div>
                    <button>Delete</button>
                    <button>Edit</button>
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
const GroupMember = ({
    // Take input
    username,
    joinedDate,
    adminStatus
    // component to display all the members of the current group (with username, joined date, and admin status for each);
}) => {
    return (
        <div>
            <p>{username} | Admin Status: {adminStatus}</p>
            <p>Joined Group on: {joinedDate}</p>
        </div>
    )
}
export default GroupMembers;
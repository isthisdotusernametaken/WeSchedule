import { useState } from "react";

function GroupMembers({
    group,
    canModify
}) {
    const [membersInGroup, setMemberInGroup] = useState([]);
    const [editSelected, setEditSelected] = useState(false);

    return (
        <div>
            {canModify ? 
                <button>Add Member to Group</button>
                :
                <div/>
            }
            {membersInGroup.map(GroupMember)}
            {canModify ? 
                <div>
                    <input className="username"></input>
                    <input className="joined-date"></input>
                    <input type="checkbox" className="admin-status"></input>
                </div>
                // Can't edit, just add an empty div.
                 : <div/>}
            {/* If true add a delete and edit button one time.*/}
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
    <div>
        <p>{username} | Admin Status: {adminStatus}</p>
        <p>Joined Group on: {joinedDate}</p>
        {canModify ? 
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
    
}
export default GroupMembers;
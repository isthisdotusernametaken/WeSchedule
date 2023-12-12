// Caleb
// Josh
import { useState } from "react";

function Groups({
    user,
    gid
}, setGroup) {
    const [groups, setGroups] = useState([]);
    return (
        <div>
            <div>{user}'s group:</div>
            {groups.map(group => Group(group, setGroup))}
            <button onClick={setGroups}>Add New Group</button>
            {canModify ? 
                <div>
                    {/* Most details are added without input field.*/}
                    <input className="group-name"></input>
                </div>
                // Can't edit, just add an empty div.
                 : <div/>}
        </div>
    );
}
const Group = ({
    // Take input
    name,
    owner,
    creationDate,
    joinedDate
    // (with name, owner, creation date, and optionally joined date and admin status for each row);
}) => {
    <div>
        <p>{name} | Owner: {owner}</p>
        <p>Chat Started: {creationDate}</p>
        <p>You Joined on: {joinedDate}</p>
        <button onClick={setGroup(gid)}>Select Group</button>
    </div>

}
export default Groups;
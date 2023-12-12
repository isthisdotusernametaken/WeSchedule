// Caleb
// Josh
import { useState } from "react";

function Groups({
    user,
    setGroup
}) {
    const [groups, setGroups] = useState([]);
    return (
        <div>
            {/* setGroup or setGroups? */}
            <button onClick={setGroup}>
                <div>{user}'s group:</div>
                {groups.map(Group)}
            </button>
            {/* <button onClick={setGroups}>Add New Group</button> */}
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
    </div>

}
export default Groups;
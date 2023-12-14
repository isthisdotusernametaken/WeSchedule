// Caleb
// Josh

import { useState } from "react";
import { deleteData, post, put } from "../backendRequest";
import { Card } from "./Card";
import Message, { clearAndCallbackHandler, errHandler } from "./Message";

const GroupMembers = ({
    username, localAdmin, groupName, groupOwner, groupMembers, loadGroupMembers, groupRID
}) => {
    const [selectedMember, setSelectedMember] = useState({});
    
    const [confirmDelete, setConfirmDelete] = useState("");
    const [admin, setAdmin] = useState(false);
    const [newMemberUsername, setNewMemberUsername] = useState("");

    // Display/clear error messages
    const [message, setMessage] = useState([true, null]);
    const setErr = errHandler(setMessage);
    const succ = clearAndCallbackHandler(setMessage, () => {
        loadGroupMembers();
        setConfirmDelete("");
        setAdmin(false);
    }); // Clear error and reload members

    return (
        <div>
            {/* Indicate selected member */}
            {selectedMember.username != null && <div className="d-flex mb-2">
                <Card>
                    <h5>Selected Member</h5>
                    {selectedMember.local_admin && <h6>Admin</h6>}
                    <p>{selectedMember.username}</p>
                    <p>Joined: {selectedMember.joined_time}</p>
                </Card>

                {/* If admin in group and non-admin selected, display kick option */}
                {!selectedMember.local_admin && localAdmin() && <div className="ms-5">
                    <button className="btn btn-danger" onClick={() => {
                            if (confirmDelete.toLowerCase() !== "confirm") return;

                            deleteData(`${groupRID()}/users/${selectedMember.username}`).then(succ).catch(setErr);
                            setSelectedMember({});
                        }}>Kick from Group</button>
                    <h6><label htmlFor="groupMembersDelete">Type <i>confirm</i></label></h6>
                    <input id="groupMembersDelete" name="groupMembersDelete" type="text"
                        onChange={e => setConfirmDelete(e.target.value)} />
                </div>}

                {/* If group owner, display admin promotion/demotion option */}
                {groupOwner === username && selectedMember.username !== username && <div className="ms-5">
                    <button className="btn btn-warning" onClick={() => {
                            put(`${groupRID()}/users/${selectedMember.username}`, { local_admin: admin }).then(succ).catch(setErr);
                            setSelectedMember({});
                        }}>Modify Member Permissions</button>
                    <div className="d-flex">
                        <div className="ms-3">
                            <h6><label htmlFor="groupMembersAdmin">Is Admin</label></h6>
                            <input id="groupMembersAdmin" name="groupMembersAdmin" type="checkbox"
                                className="form-check-input" onChange={e => setAdmin(e.target.checked)} />
                        </div>
                    </div>
                </div>}
            </div>}
            {localAdmin() && <div className="mb-3">
                <button className="btn btn-success" onClick={() => {
                        const newMemberUsernameVal = newMemberUsername.trim();
                        if (newMemberUsernameVal === "") return;

                        post(`${groupRID()}/users/${newMemberUsernameVal}`, {}).then(succ).catch(setErr);
                    }}>Add Group Member</button>
                <h6><label htmlFor="groupMembersNewUsername">New Member's Username</label></h6>
                <input id="groupMembersNewUsername" name="groupMembersNewUsername" type="text"
                    onChange={e => setNewMemberUsername(e.target.value)} />
            </div>}

            <div className="mb-0">Members of {groupName}:</div>
            {groupMembers.map(member => GroupMember(member, setSelectedMember))}

            <div className="mt-2">
                <Message succ={message[0]} title={message[1]} />
            </div>
        </div>
    );
}

const GroupMember = (member, setSelectedMember) =>
    <Card>
        {member.local_admin && <h6>Admin</h6>}
        <p>{member.username}</p>
        <p>Joined: {member.joined_time}</p>
        <button onClick={() => setSelectedMember(member)}>Select Member</button>
    </Card>

export default GroupMembers;
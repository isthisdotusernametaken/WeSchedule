// Caleb
// Josh

import { useState } from "react";
import { deleteData, post, put } from "../backendRequest";
import { Card } from "./Card";
import Message, { clearAndCallbackHandler, errHandler } from "./Message";

const Groups = ({
    username, name, groups, group, setGroup, clearGroup, clearBeforeGroup, loadGroups, groupRID
}) => {
    const [confirmDelete, setConfirmDelete] = useState("");
    const [newOwner, setNewOwner] = useState("");
    const [renameName, setRenameName] = useState("");
    const [newGroupName, setNewGroupName] = useState("");
    const [confirmLeave, setConfirmLeave] = useState("");

    // Display/clear error messages
    const [message, setMessage] = useState([true, null]);
    const setErr = errHandler(setMessage);
    const succ = clearAndCallbackHandler(setMessage, () => {
        loadGroups();
        setNewOwner("");
        setConfirmDelete("");
        setRenameName("");
        setConfirmLeave("");
    });

    return (
        <div>
            {/* Indicate selected group */}
            {group.gid != null && <div className="d-flex mb-2">
                <Card>
                    <h5>Current Group</h5>
                    <p>{group.name} | Owner: {group.owner_username}</p>
                    <p>Created: {group.creation_time}</p>
                    <p>You Joined: {group.joined_time}</p>
                </Card>

                {/* If owner of current group, display modification options */}
                {username === group.owner_username && <>
                    <div className="ms-5">
                        <button className="btn btn-danger" onClick={() => {
                                if (confirmDelete.toLowerCase() !== "confirm") return;

                                deleteData(groupRID()).then(succ).catch(setErr);
                                clearGroup();
                            }}>Delete {group.name} (IRREVERSIBLE)</button>
                        <h6><label htmlFor="groupsDelete">Type <i>confirm</i></label></h6>
                        <input id="groupsDelete" name="groupsDelete" type="text"
                            onChange={e => setConfirmDelete(e.target.value)} />
                    </div>

                    <div className="ms-5">
                        <button className="btn btn-warning" onClick={() => {
                                const newOwnerVal = newOwner.trim()
                                const newNameVal = renameName.trim();
                                if (newOwnerVal === "" && newNameVal === "") return;
                                
                                const values = {};
                                if (newOwnerVal !== "") values.owner = newOwnerVal;
                                if (newNameVal !== "") values.name = newNameVal;
                                
                                put(groupRID(), values).then(res => {
                                    succ(); // Clear err and reload
                                    clearGroup();
                                }).catch(setErr);
                            }}>Transfer Ownership of {group.name} and/or Rename Group</button>
                        <div className="d-flex">
                            <div>
                                <h6><label htmlFor="groupsRename">New group name</label></h6>
                                <input id="groupsRename" name="groupsRename" type="text"
                                    onChange={e => setRenameName(e.target.value)} />
                            </div>
                            <div className="ms-3">
                                <h6><label htmlFor="groupsTransfer">Username of the new owner</label></h6>
                                <input id="groupsTransfer" name="groupsTransfer" type="text"
                                    onChange={e => setNewOwner(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </>}

                {/* If not owner of selected group, show leave group button */}
                {username !== group.owner_username && <div className="flex-fill">
                    <div className="float-end">
                        <button className="btn btn-danger" onClick={() => {
                                if (confirmLeave.toLowerCase() !== "confirm") return;

                                deleteData(`${groupRID()}/users/${username}`).then(succ).catch(setErr);
                                clearGroup();
                            }}>Leave Group</button>
                        <h6><label htmlFor="groupsLeave">Type <i>confirm</i></label></h6>
                        <input id="groupsLeave" name="groupsLeave" type="text"
                            onChange={e => setConfirmLeave(e.target.value)} />
                    </div>
                </div>}
            </div>}
            <div className="mb-3">
                <button className="btn btn-success" onClick={() => {
                        const newNameVal = newGroupName.trim();
                        if (newNameVal === "") return;

                        post("/groups", { name: newNameVal }).then(succ).catch(setErr);
                        clearGroup();
                    }}>Add New Group</button>
                <h6><label htmlFor="groupsNewGroupName">New Group's Name</label></h6>
                <input id="groupsNewGroupName" name="groupsNewGroupName" type="text"
                    onChange={e => setNewGroupName(e.target.value)} />
            </div>

            <div className="mb-0">{name}'s groups:</div>
            {groups.map(group => Group(group, setGroup, clearBeforeGroup))}

            <div className="mt-2">
                <Message succ={message[0]} title={message[1]} />
            </div>
        </div>
    );
}

const Group = (group, setGroup, clearBeforeGroup) =>
    <Card>
        <p>{group.name} | Owner: {group.owner_username}</p>
        <p>Created: {group.creation_time}</p>
        <p>You Joined: {group.joined_time}</p>
        <button onClick={() => {
            clearBeforeGroup();
            setGroup(group);
        }}>Select Group</button>
    </Card>;

export default Groups;
// Caleb
// Josh

import { useState } from "react";
import { deleteData, post, put } from "../backendRequest";
import { Card } from "./Card";
import Message, { clearAndCallbackHandler, errHandler } from "./Message";

const TopicMembers = ({
    localAdmin, otherLocalAdmin, topicName, topicMembers, loadTopicMembers, topicRID
}) => {
    const [selectedMember, setSelectedMember] = useState({});

    const [confirmDelete, setConfirmDelete] = useState("");
    const [eventPerm, setEventPerm] = useState(false);
    const [messagePerm, setMessagePerm] = useState(false);
    const [newMemberUsername, setNewMemberUsername] = useState("");

    // Display/clear error messages
    const [message, setMessage] = useState([true, null]);
    const setErr = errHandler(setMessage);
    const succ = clearAndCallbackHandler(setMessage, () => {
        loadTopicMembers();
        setConfirmDelete("");
        setEventPerm(false);
        setMessagePerm(false);
    }); // Clear error and reload members

    return (
        <div>
            {/* Indicate selected member */}
            {selectedMember.username != null && <div className="d-flex mb-2">
                <Card>
                    <p>{selectedMember.username}</p>
                    <p>{`${(selectedMember.event_perm ? "CAN" : "CANNOT")} create/edit/delete events`}</p>
                    <p>{`${(selectedMember.message_perm ? "CAN" : "CANNOT")} send messages`}</p>
                </Card>

                {/* If admin in group and non-admin selected, display kick and modify options */}
                {!otherLocalAdmin(selectedMember.username) && localAdmin() && <>
                    <div className="ms-5">
                        <button className="btn btn-danger" onClick={() => {
                            if (confirmDelete.toLowerCase() !== "confirm") return;

                            deleteData(`${topicRID()}/users/${selectedMember.username}`).then(succ).catch(setErr);
                            setSelectedMember({});
                        }}>Kick from Topic</button>
                        <h6><label htmlFor="topicMembersDelete">Type <i>confirm</i></label></h6>
                        <input id="topicMembersDelete" name="topicMembersDelete" type="text"
                            onChange={e => setConfirmDelete(e.target.value)} />
                    </div>
                    <div className="ms-5">
                        <button className="btn btn-warning" onClick={() => {
                            put(`${topicRID()}/users/${selectedMember.username}`, { event_perm: eventPerm, message_perm: messagePerm }).then(succ).catch(setErr);
                            setSelectedMember({});
                        }}>Modify Member Permissions</button>
                        <div className="d-flex">
                            <div>
                                <h6><label htmlFor="topicMembersEventPerm">Can Add/Edit/Delete Events</label></h6>
                                <input id="topicMembersEventPerm" name="topicMembersEventPerm" type="checkbox"
                                    className="form-check-input" onChange={e => setEventPerm(e.target.checked)} />
                            </div>
                            <div className="ms-3">
                                <h6><label htmlFor="topicMembersMessagePerm">Can Send Messages</label></h6>
                                <input id="topicMembersMessagePerm" name="topicMembersMessagePerm" type="checkbox"
                                    className="form-check-input" onChange={e => setMessagePerm(e.target.checked)} />
                            </div>
                        </div>
                    </div>
                </>}
            </div>}

            {/* Add new member */}
            {localAdmin() && <div className="mb-3">
                <button className="btn btn-success" onClick={() => {
                    const newMemberUsernameVal = newMemberUsername.trim();
                    if (newMemberUsernameVal === "") return;

                    post(`${topicRID()}/users/${newMemberUsernameVal}`, {}).then(succ).catch(setErr);
                }}>Add Topic Member</button>
                <h6><label htmlFor="groupMembersNewUsername">New Member's Username</label></h6>
                <input id="groupMembersNewUsername" name="groupMembersNewUsername" type="text"
                    onChange={e => setNewMemberUsername(e.target.value)} />
            </div>}

            <div className="mb-0">Members of {topicName}:</div>
            {topicMembers.map(member => TopicMember(member, setSelectedMember))}

            <div className="mt-2">
                <Message succ={message[0]} title={message[1]} />
            </div>
        </div>
    );
}

const TopicMember = (member, setSelectedMember) =>
    <Card>
        <p>{member.username}</p>
        <p>{`${(member.event_perm ? "CAN" : "CANNOT")} create/edit/delete events`}</p>
        <p>{`${(member.message_perm ? "CAN" : "CANNOT")} send messages`}</p>
        <button onClick={() => setSelectedMember(member)}>Select Member</button>
    </Card>


export default TopicMembers;
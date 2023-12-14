// Caleb
// Josh

import { useRef, useState } from "react";
import { deleteData, post, put } from "../backendRequest";
import { Card } from "./Card";
import Message, { clearAndCallbackHandler, errHandler } from "./Message";

const Topics = ({
    localAdmin, username, group, topics, topic, setTopic, clearTopic, clearBeforeTopic, loadTopics, groupRID, topicRID
}) => {
    const newTopicDescInput = useRef(null);
    const oldTopicDescInput = useRef(null);

    const [confirmDelete, setConfirmDelete] = useState("");
    const [oldTopicName, setOldTopicName] = useState("");
    const [newTopicName, setNewTopicName] = useState("");
    const [confirmLeave, setConfirmLeave] = useState("");

    // Display/clear error messages
    const [message, setMessage] = useState([true, null]);
    const setErr = errHandler(setMessage);
    const succ = clearAndCallbackHandler(setMessage, () => {
        loadTopics();
        setConfirmDelete("");
        setConfirmLeave("");

        if (newTopicDescInput.current) newTopicDescInput.current.value = "";
        if (oldTopicDescInput.current) oldTopicDescInput.current.value = "";
    });

    return (
        <div>
            {/* Indicate selected topic */}
            {topic.topic != null && <div className="d-flex mb-2">
                <Card>
                    <h5>Current Topic</h5>
                    <p>{topic.topic}</p>
                    <p>{topic.description}</p>
                </Card>

                {/* If local admin in group, display modification options */}
                {localAdmin() && <>
                    <div className="ms-5 me-5">
                        <button className="btn btn-danger" onClick={() => {
                            if (confirmDelete.toLowerCase() !== "confirm") return;

                            deleteData(topicRID()).then(succ).catch(setErr);
                            clearTopic();
                        }}>Delete {topic.topic} (IRREVERSIBLE)</button>
                        <h6><label htmlFor="topicsDelete">Type <i>confirm</i></label></h6>
                        <input id="topicsDelete" name="topicsDelete" type="text"
                            onChange={e => setConfirmDelete(e.target.value)} />
                    </div>

                    <div className="ms-5">
                        <button className="btn btn-warning" onClick={() => {
                            const descVal = oldTopicDescInput.current ? oldTopicDescInput.current.value.trim() : "";
                            const nameVal = oldTopicName.trim();

                            if (descVal === "" && nameVal === "") return;

                            const values = {}
                            if (descVal !== "") values.description = descVal
                            if (nameVal !== "") values.topic = nameVal;

                            put(topicRID(), values).then(res => {
                                succ(); // Clear and reload
                                clearTopic();
                            }).catch(setErr);
                        }}>Edit Name or Description of {topic.topic}</button>
                        <div className="d-flex">
                            <div>
                                <h6><label htmlFor="topicsRename">New Name for Topic</label></h6>
                                <input id="topicsRename" name="topicsRename" type="text"
                                    onChange={e => setOldTopicName(e.target.value)} />
                            </div>
                            <div className="ms-3">
                                <h6><label htmlFor="topicsOldTopicDesc">New Description for Topic</label></h6>
                                <textarea ref={oldTopicDescInput} className="form-control" id="topicsOldTopicDesc" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                </>}

                <div className="flex-fill">
                    <div className="float-end">
                        <button className="btn btn-danger" onClick={() => {
                            if (confirmLeave.toLowerCase() !== "confirm") return;

                            clearTopic();
                            deleteData(`${topicRID()}/users/${username}`).then(succ).catch(setErr);
                        }}>Leave Topic</button>
                        <h6><label htmlFor="groupsLeave">Type <i>confirm</i></label></h6>
                        <input id="groupsLeave" name="groupsLeave" type="text"
                            onChange={e => setConfirmLeave(e.target.value)} />
                    </div>
                </div>
            </div>}

            {localAdmin() && <div className="mb-3 mt-4">
                <button className="btn btn-success" onClick={() => {
                    const newDescVal = newTopicDescInput.current ? newTopicDescInput.current.value.trim() : "";
                    const newNameVal = newTopicName.trim();
                    if (newNameVal === "") return;

                    const values = {}
                    if (newDescVal !== "") values.description = newDescVal

                    post(`${groupRID()}/topics/${newNameVal}`, values).then(succ).catch(setErr);
                }}>Add New Topic</button>

                <div className="d-flex">
                    <div>
                        <h6><label htmlFor="topicsNewTopicName">New Topic's Name</label></h6>
                        <input id="topicsNewTopicName" name="topicsNewTopicName" type="text"
                            onChange={e => setNewTopicName(e.target.value)} />
                    </div>
                    <div className="ms-3">
                        <h6><label htmlFor="topicsNewTopicDesc">New Topic's Description</label></h6>
                        <textarea ref={newTopicDescInput} className="form-control" id="topicsNewTopicDesc" rows="3"></textarea>
                    </div>
                </div>
            </div>}

            <div className="mb-0">{group.name}'s topics:</div>
            {topics.map(topic => Topic(topic, setTopic, clearBeforeTopic))}

            <div className="mt-2">
                <Message succ={message[0]} title={message[1]} />
            </div>
        </div>
    );
}

const Topic = (topic, setTopic, clearBeforeTopic) =>
    <Card>
        <p>{topic.topic}</p>
        <button onClick={() => {
            clearBeforeTopic();
            setTopic(topic);
        }}>Select Topic</button>
    </Card>;

export default Topics;
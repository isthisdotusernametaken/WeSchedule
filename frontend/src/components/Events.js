// Caleb
// Josh

import { useRef, useState } from "react";
import { deleteData, post, put } from "../backendRequest";
import { Card } from "./Card";
import Message, { clearAndCallbackHandler, errHandler } from "./Message";

const Events = ({
    eventPerm, topicName, events, eventsAfter, setEventsAfter, loadEvents, eventsRID
}) => {
    const [event, setEvent] = useState({});

    const oldEventDescInput = useRef(null);
    const newEventDescInput = useRef(null);

    const [confirmDelete, setConfirmDelete] = useState("");
    const [oldEventName, setOldEventName] = useState("");
    const [oldEventTime, setOldEventTime] = useState("");
    const [oldEventDuration, setOldEventDuration] = useState(-1);
    const [newEventName, setNewEventName] = useState("");
    const [newEventTime, setNewEventTime] = useState("");
    const [newEventDuration, setNewEventDuration] = useState(-1);

    // Display/clear error messages
    const [message, setMessage] = useState([true, null]);
    const setErr = errHandler(setMessage);
    const succ = clearAndCallbackHandler(setMessage, () => {
        loadEvents();
        setConfirmDelete("");
        setOldEventDuration(-1);

        setEvent({});

        if (newEventDescInput.current) newEventDescInput.current.value = "";
        if (oldEventDescInput.current) oldEventDescInput.current.value = "";
    });

    return (
        <div>
            {/* Indicate selected event */}
            {event.time != null && <>
                <div className="d-flex mb-2">
                    <Card>
                        <p>{event.name}</p>
                        <p>At: {event.time}</p>
                        <p>{event.duration} minutes</p>
                        <p>{event.description}</p>
                    </Card>

                    {/* If have event permission, display modification options */}
                    {eventPerm() && <div className="ms-5 me-5">
                        <button className="btn btn-danger" onClick={() => {
                            if (confirmDelete.toLowerCase() !== "confirm") return;

                            deleteData(`${eventsRID()}/${event.time}`).then(succ).catch(setErr);
                        }}>Delete {event.name} (IRREVERSIBLE)</button>
                        <h6><label htmlFor="eventsDelete">Type <i>confirm</i></label></h6>
                        <input id="eventsDelete" name="eventsDelete" type="text"
                            onChange={e => setConfirmDelete(e.target.value)} />
                    </div>}
                </div>

                {eventPerm() && <div>
                    <button className="btn btn-warning" onClick={() => {
                        const descVal = oldEventDescInput.current ? oldEventDescInput.current.value.trim() : "";
                        const nameVal = oldEventName.trim();
                        const time = new Date(oldEventTime ?? -1);
                        if (nameVal === "" && descVal === "" && Number.isNaN(time.valueOf()) && oldEventDuration === -1) return;

                        const values = {}
                        if (descVal !== "") values.description = descVal;
                        if (nameVal !== "") values.event = nameVal;
                        if (!Number.isNaN(time.valueOf())) values.time = time;
                        if (oldEventDuration !== -1) values.duration = oldEventDuration;

                        put(`${eventsRID()}/${event.time}`, values).then(succ).catch(setErr);
                    }}>Edit {event.name}</button>
                    <div className="d-flex">
                        <div>
                            <h6><label htmlFor="eventsOldEventName">New Name for Event</label></h6>
                            <input id="eventsOldEventName" name="eventsOldEventName" type="text"
                                onChange={e => setOldEventName(e.target.value)} />
                        </div>
                        <div className="ms-3">
                            <h6><label htmlFor="eventsOldEventDuration">New Duration in Minutes for Event</label></h6>
                            <input id="eventsOldEventDuration" name="eventsOldEventDuration" type="number" min={0}
                                onChange={e => setOldEventDuration(e.target.value)} />
                        </div>
                        <div className="ms-3">
                            <h6><label htmlFor="topicsOldTopicDesc">New Description for Event</label></h6>
                            <textarea ref={oldEventDescInput} className="form-control" id="topicsOldTopicDesc" rows="3"></textarea>
                        </div>
                        <div className="ms-3">
                            <h6><label htmlFor="eventsOldEventTime">New Time for Event</label></h6>
                            <input type="datetime-local" id="eventsOldEventTime" name="eventsOldEventTime"
                                onChange={e => setOldEventTime(e.target.value)} />
                        </div>
                    </div>
                </div>}
            </>}

            {eventPerm() && <div className="mb-3 mt-4">
                <button className="btn btn-success" onClick={() => {
                    const newDescVal = newEventDescInput.current ? newEventDescInput.current.value.trim() : "";
                    const newNameVal = newEventName.trim();
                    const newTime = new Date(newEventTime ?? -1);
                    if (newNameVal === "" || Number.isNaN(newTime.valueOf()) || newEventDuration === -1) return;

                    const values = {}
                    if (newDescVal !== "") values.description = newDescVal;
                    values.event = newNameVal;
                    values.duration = newEventDuration;

                    post(`${eventsRID()}/${newTime.toISOString()}`, values).then(succ).catch(setErr);
                }}>Create Event</button>

                <div className="d-flex">
                    <div>
                        <h6><label htmlFor="eventsNewEventName">New Event's Name</label></h6>
                        <input id="eventsNewEventName" name="eventsNewEventName" type="text"
                            onChange={e => setNewEventName(e.target.value)} />
                    </div>
                    <div className="ms-3">
                        <h6><label htmlFor="eventsNewEventDuration">New Event's Duration in Minutes</label></h6>
                        <input id="eventsNewEventDuration" name="eventsNewEventDuration" type="number" min={0}
                            onChange={e => setNewEventDuration(e.target.value)} />
                    </div>
                    <div className="ms-3">
                        <h6><label htmlFor="eventsNewEventDesc">New Event's Description</label></h6>
                        <textarea ref={newEventDescInput} className="form-control" id="eventsNewEventDesc" rows="3"></textarea>
                    </div>
                    <div className="ms-3">
                        <h6><label htmlFor="eventsNewEventTime">New Event's Time</label></h6>
                        <input type="datetime-local" id="eventsNewEventTime" name="eventsNewEventTime" defaultValue="2023-12-13T12:00"
                            onChange={e => setNewEventTime(e.target.value)} />
                    </div>
                </div>
            </div>}

            <div className="d-flex">
                <button className="btn btn-success" onClick={loadEvents}>Refresh</button>
                <div className="ms-3">
                    <h6><label htmlFor="eventsEventsAfter">Show Events After</label></h6>
                    <input type="datetime-local" id="eventsEventsAfter" name="eventsEventsAfter"
                        onChange={e => setEventsAfter(e.target.value)} />
                </div>
            </div>

            <div className="mb-0">{topicName}'s events:</div>
            {events.map(event => Event(event, setEvent))}

            <div className="mt-2">
                <Message succ={message[0]} title={message[1]} />
            </div>
        </div>
    );
}

const Event = (event, setEvent) =>
    <Card>
        <p>{event.name}</p>
        <p>At: {event.time}</p>
        <p>{event.duration} minutes</p>
        <button onClick={() => setEvent(event)}>Select Event</button>
    </Card>;

export default Events;
// Caleb
// Josh

import { Card } from "./Card";

const Groups = ({
    username,
    name,
    groups,
    group,
    setGroup
}) =>
        <div>
            <div className="d-flex mb-5">
                {group.gid != null && <>
                    <div>
                        <h5>Current Group</h5>
                        <p>{group.name} | Owner: {group.owner_username}</p>
                        <p>Created: {group.creation_time}</p>
                        <p>You Joined: {group.joined_time}</p>
                    </div>

                    <div className="ms-5">
                        <button>Delete {group.name} (IRREVERSIBLE)</button>
                        <h6><label htmlFor="groupsNewGroupName">New Group's Name</label></h6>
                        <input id="groupsNewGroupName" name="groupsNewGroupName" type="text"
                            onChange={e => 1} />
                    </div>
                </>}

                <div className="ms-5">
                    <button>Add New Group</button>
                    <h6><label htmlFor="groupsNewGroupName">New Group's Name</label></h6>
                    <input id="groupsNewGroupName" name="groupsNewGroupName" type="text"
                        onChange={e => 1} />
                </div>
            </div>

            {username === group.owner_username && <div>
                <button onClick={() => 1}>Delete Group</button>
                
                <button onClick={() => 1}>Transfer Ownership to (username):</button>
                <input id="groupsNewGroupName" name="groupsNewGroupName" type="text"
                    onChange={e => 1} />

            </div>}

            <div className="mb-0">{name}'s groups:</div>
            {groups.map(group => Group(group, setGroup))}
        </div>;

const Group = (group, setGroup) =>
    <Card>
        <p>{group.name} | Owner: {group.owner_username}</p>
        <p>Created: {group.creation_time}</p>
        <p>You Joined: {group.joined_time}</p>
        <button onClick={() => setGroup(group)}>Select Group</button>
    </Card>;

export default Groups;
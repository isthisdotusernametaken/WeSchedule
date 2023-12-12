const TopicMembers = ({
    username,
    eventPermission,
    msgPermission
    // component to display all the members of the current topic (with username, event creation permission, and message creation permission for each);

}) => 
    <div>
        <p>{username}</p>
        <p>Create events T/F: {eventPermission}</p>
        <p>Create msg T/F: {msgPermission}</p>
    </div>
export default TopicMembers;
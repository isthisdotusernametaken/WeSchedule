const Events = ({
    group,
    topic,
    canModify
    // component to display all log entries for a group (with time and description for each)
}) =>
    <div>
        <p>{group}</p>
        <p>Topic: {topic}</p>
        <p>Can modify event T/F: {canModify}</p>
    </div>
export default Events;
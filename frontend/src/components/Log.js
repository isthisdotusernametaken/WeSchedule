const Logs = ({
    time,
    description
    // component to display all log entries for a group (with time and description for each)
}) =>
    <div>
        <p>{time}</p>
        <p>{description}</p>
    </div>
export default Logs;
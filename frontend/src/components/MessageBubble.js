// Learned to format time below from chatGPT 3.5. ->Caleb
const timeFormat = {
    weekday: "long",
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short"
}

const MessageBubble = ({ username, time, text }) =>
    <div className="rounded-4 p-1 my-4 message-box message-left p-1 message-outgoing">
        <p>{username}:</p>
        <p>{text}</p>
        <div className="rounded-3 p-1 time">
            <p>{new Date(time).toLocaleString(timeFormat)}</p>
        </div>
    </div>

export default MessageBubble;
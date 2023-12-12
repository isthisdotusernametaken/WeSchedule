const MessageBubble = ({
    user,
    time,
    content
}) => 
    <div className="rounded-4 p-1 my-4 message-box message-left p-1 message-outgoing">
        <p>{user}: <p>{content}</p> </p>
        <div className="rounded-3 p-1 time">
            <p>{time.toString()}</p>
        </div>
    </div>

export default MessageBubble;
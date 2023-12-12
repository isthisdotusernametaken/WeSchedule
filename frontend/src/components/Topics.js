const Topics = ({
    topicName,
    description
// component to display all of the topics a user belongs to within the current group (with topic name and description for each);
}) =>
    <div>
        <p>{topicName}</p>
        <p>Description: {description}</p>
    </div>

export default Topics;
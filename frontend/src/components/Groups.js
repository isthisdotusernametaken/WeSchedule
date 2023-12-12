const Groups = ({
    name,
    owner,
    creationDate,
    joinedDate
    // (with name, owner, creation date, and optionally joined date and admin status for each row);
}) =>
    <div>
        {/* <h1>{name}</h1> */}
        <p>{name} | Owner: {owner}</p>
        <p>Chat Started: {creationDate}</p>
        <p>You Joined on: {joinedDate}</p>
    </div>

export default Groups;
// Author: Joshua Barbee

const Account = ({
    userInfo: { username, name, email, joined_time, lang }, setUserInfo,
    languages
}) => username == null ?
    <>Not signed in</> :
    <>
        <div className="d-flex container-fluid ms-2">
            <div className="d-flex flex-column">
                <h5>Username</h5>
                <h5>{username}</h5>
            </div>
            <div className="d-flex flex-column ms-3">
                <h5>Name</h5>
                <h5>{name}</h5>
            </div>
            <div className="d-flex flex-column ms-3">
                <h5>Email</h5>
                <h5>{email}</h5>
            </div>
            <div className="d-flex flex-column ms-3">
                <h5>Creation Date</h5>
                <h5>{joined_time}</h5>
            </div>
            <div className="d-flex flex-column ms-3">
                <h5>Preferred Language</h5>
                <h5>{lang}</h5>
            </div>
        </div>

        <div className="d-flex mt-5">
            <h4>Edit</h4>
            <h5 className="ms-2">(only fill the fields you want to change)</h5>
        </div>
        <div className="d-flex container-fluid ms-2">
            <div className="d-flex flex-column">
                <h5><label htmlFor="newUsername">Username</label></h5>
                <input id="newUsername" name="newUsername" type="text" />
            </div>
            <div className="d-flex flex-column ms-3">
                <h5><label htmlFor="newName">Name</label></h5>
                <input id="newName" name="newName" type="text" />
            </div>
            <div className="d-flex flex-column ms-3">
                <h5><label htmlFor="newEmail">Email</label></h5>
                <input id="newEmail" name="newEmail" type="text" />
            </div>
            <div className="d-flex flex-column ms-3">
                <h5><label htmlFor="newLang">Preferred Language</label></h5>
                <select id="newLang" name="newLang" >

                </select>
            </div>
        </div>
    </>;

export default Account;

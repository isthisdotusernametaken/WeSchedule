// Author: Joshua Barbee

import { useState } from "react";
import { put } from "../backendRequest";

import LanguageDropdown from "./LanguageDropdown";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

function Account({
    user: { username, name, email, joined_time, lang },
    logout, loadUser, languages
}) {
    // For updating account info
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newLang, setNewLang] = useState("");

    const [err, setErr] = useState(null);
    const [succ, setSucc] = useState(null);


    function updateInfo() {
        if (newPass !== confirmPass) {
            setErr("Password and Confirm Password do not match");
        } else {
            const values = {}; // Values to update

            // Choose only the provided values
            if (newPass.trim() !== "")
                values.password = newPass;
            if (newName.trim() !== "")
                values.name = newName;
            if (newEmail.trim() !== "")
                values.email = newEmail;
            if (newLang.trim() !== "")
                values.language = newLang;

            if (Object.keys(values).length)
                // Send to server
                put("/users", values).then(res => {
                    setErr(null);
                    setSucc(res.data.success);
                    loadUser();
                }).catch(error => {
                    setErr(error.response ? error.response.data.error : "Unable to access server.");
                    setSucc(null);
                });
            else {
                setErr(null);
                setSucc(null);
            }
        }
    }

    function logoutAndClear() {
        setErr(null); // Clear messages
        setSucc(null);

        logout();
    }

    // Show Sign in/Sign up or account details, depending on whether the user is logged in.
    return username == null ?
        <>Not signed in</> :
        <div className="d-flex">
            {/* Account details (left column) */}
            <div>
                {/* Current account details */}
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
                        <h5>{languages[lang]}</h5>
                    </div>
                </div>

                {/* Edit account details */}
                <div className="d-flex mt-5">
                    <h4>Edit</h4>
                    <h5 className="ms-2">(only fill the fields you want to change)</h5>
                </div>
                <div className="d-flex container-fluid ms-2">
                    <div className="d-flex flex-column ms-3">
                        <h5><label htmlFor="newPassword">Password</label></h5>
                        <input id="newPassword" name="newPassword" type="password"
                            onChange={e => setNewPass(e.target.value)} />
                    </div>
                    <div className="d-flex flex-column ms-3">
                        <h5><label htmlFor="confirmPassword">Confirm Password</label></h5>
                        <input id="confirmPassword" name="confirmPassword" type="password"
                            onChange={e => setConfirmPass(e.target.value)} />
                    </div>
                    <div className="d-flex flex-column ms-3">
                        <h5><label htmlFor="newName">Name</label></h5>
                        <input id="newName" name="newName" type="text"
                            onChange={e => setNewName(e.target.value)} />
                    </div>
                    <div className="d-flex flex-column ms-3">
                        <h5><label htmlFor="newEmail">Email</label></h5>
                        <input id="newEmail" name="newEmail" type="email"
                            onChange={e => setNewEmail(e.target.value)} />
                    </div>
                    <div className="d-flex flex-column ms-3">
                        <LanguageDropdown id="newLang" languages={languages}
                            setLang={setNewLang} />
                    </div>
                </div>

                {/* Update info button */}
                <button className="btn btn-primary mt-2" onClick={updateInfo}>
                    <h5>Update My Information</h5>
                </button>

                <ErrorMessage title={err} />
                <SuccessMessage title={succ} />
            </div>
            
            {/* Logout button (right column) */}
            <div className="flex-fill">
                <button className="btn btn-primary float-end me-4" onClick={logoutAndClear}>
                    <h5>Logout</h5>
                </button>
            </div>
        </div>
};

export default Account;

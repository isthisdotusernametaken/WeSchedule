import React, { useState } from 'react';
import { post } from '../backendRequest';

function SignIn({ loadUser, setErr, setSucc }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username.trim() === "" || password.trim() === "")
            setErr("Username and password cannot be blank.");
        else
            post("/auth/login", { username: username, password: password }).then(res => {
                setSucc(null);
                loadUser();
            }).catch(err => {
                setErr(err);
            });
    };

    return (
        <>
            <h2 className="mt-5">Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="inputEmail">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputUsername"
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Sign In</button>
            </form>
        </>
    );
}

export default SignIn;

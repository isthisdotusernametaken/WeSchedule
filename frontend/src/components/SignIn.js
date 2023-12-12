import React, { useState } from 'react';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password);
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
                        value={email}
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
                        value={password}
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

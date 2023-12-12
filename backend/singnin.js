import React, { useState } from 'react';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the sign-in logic here
        console.log(email, password);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mt-5">Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="inputEmail">Email address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="inputEmail" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
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
                        <button type="submit" className="btn btn-primary">Sign In</button>
                    </form>
                    <p className="mt-3">
                        Don't have an account? <a href="/signup">Sign up here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;

import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

function SignInOrUp() {
    const [signIn, setSignIn] = useState(true);

    return (
        <div className="container mt-5">
            {signIn ? <SignIn /> : <SignUp />}
            <button className="btn btn-primary mt-3"
                onClick={() => setSignIn(state => !state)}>
                Switch to {signIn ? "Sign Up" : "Sign In"}
            </button>
        </div>
    );
}

export default SignInOrUp;
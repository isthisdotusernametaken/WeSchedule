import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

function SignInOrUp(props) {
    const [signIn, setSignIn] = useState(true);

    return (
        <div className="container mt-5">
            {signIn ? <SignIn {...props} /> : <SignUp {...props} />}
            <button className="btn btn-primary mt-3"
                onClick={() => setSignIn(state => !state)}>
                Switch to {signIn ? "Sign Up" : "Sign In"}
            </button>
        </div>
    );
}

export default SignInOrUp;
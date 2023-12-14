import React, { useState} from 'react';
import LanguageDropdown from './LanguageDropdown';
import { post } from '../backendRequest';

const SignUp = ({ loadUser, languages, setErr, setSucc }) => {
    // State for form fields
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [language, setLanguage] = useState('');

    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const usernameValid = username.trim() !== "";

        // Validate email format
        const emailValid = email.trim() !== "";

        // Validate password
        const passwordValid = password.trim() !== ""

        // Validate that password and confirm password match
        const confirmPasswordValid = password === confirmPassword;

        setIsEmailValid(emailValid);
        setIsPasswordValid(passwordValid);
        setIsConfirmPasswordValid(confirmPasswordValid);

        // If all validations pass, proceed with signup logic
        if (emailValid && passwordValid && confirmPasswordValid && usernameValid) {
            post("/auth/signup", {
                username: username, password: password,
                email: email, language: language, name: name
            }).then(res => {
                setSucc("Account created");
                post("/auth/login", { username: username, password: password }).then(res => {
                    loadUser();
                }).catch(err => {
                    setErr(err);
                });
            }).catch(err =>
                setErr(err)
            );
        }
    };

    return (
        <>
            <h2 className="mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                {/* Name */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email:
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!isEmailValid && <p>Invalid email format</p>}
                </div>
                {/* Language */}
                <div className="mb-3">
                    <LanguageDropdown id="signUpLang" languages={languages} setLang={setLanguage} defaultValue="en" />
                </div>
                {/* Password */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isPasswordValid && (
                        <p>
                            Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one digit.
                        </p>
                    )}
                </div>
                {/* Confirm Password */}
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {!isConfirmPasswordValid && (
                        <p>Passwords do not match</p>
                    )}
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary">
                    Sign Up
                </button>
            </form>
        </>
    );
};

export default SignUp;

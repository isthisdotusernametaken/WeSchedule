import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUpForm = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  
  const handleSubmit = (e) => {
    e.preventDefault();

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));

    
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    setIsPasswordValid(passwordRegex.test(password));

    
    setIsConfirmPasswordValid(password === confirmPassword);

    
    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {

      console.log('Signup successful!');
    } else {
      console.log('Please correct the form errors.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isEmailValid && <p style={{ color: 'red' }}>Invalid email format</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isPasswordValid && (
            <p style={{ color: 'red' }}>
              Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one digit.
            </p>
          )}
        </div>
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
            <p style={{ color: 'red' }}>Passwords do not match</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
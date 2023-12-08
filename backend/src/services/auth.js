// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// Service: /auth
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router();

// Establish a connection to the database
// Note that config.js will only be executed once despite being imported in
// multiple files.
const dbConnection = require("../dbConfig")

// Cryptographic hashing for password
const crypto = require("crypto");

// Axios for making external requests
const axios = require("axios");

// Utilities
const {
    requireBodyParams,
    createSuccess, success200,
    clientError, dbError, serverError
} = require("../routing");


// ----------------------------------------------------------------------------
// (A)  Configuration details.
// ----------------------------------------------------------------------------

// To avoid requiring ALL accounts to reset their passwords, these parameters
// should not be changed if at all possible.
// The salt length and hash length must match those of the database.
const HASH_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const HASH_LENGTH = 64;
const HASH_ALGORITHM = "sha512";

// External email validation service
const emailValidationUrl = "http://api.eva.pingutil.com/email";

// Password format, constructed for easy detection of the invalid feature.
const PASS_LENGTH_RANGE = Object.freeze([8, 30]);
const PASS_LENGTH = pass => pass.length >= PASS_LENGTH_RANGE[0] && pass.length <= PASS_LENGTH_RANGE[1];
const PASS_UPPERCASE = /[A-Z]/;
const PASS_LOWERCASE = /[a-z]/;
const PASS_NUMBER = /\d/;
const PASS_SPECIAL = /[!@#\\$%\\^&*()_+=-]/;
const PASS_DESC =
    "The password must have at least one of each of the following character " +
    "types: uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9) " +
    "and special characters (!@#$%^&*()_+=-). The password must be between " +
    `${PASS_LENGTH_RANGE[0]} and ${PASS_LENGTH_RANGE[1]} characters.`;


// ----------------------------------------------------------------------------
// (B)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

// Salt from CSPRNG as a hex string.
const generateSalt = () => crypto.randomBytes(SALT_LENGTH);

// Hash given password and salt with the server's hashing configuration. Return
// the hash as a hex string.
const hash = (pass, salt) =>
    crypto.pbkdf2Sync(
        pass, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGORITHM
    );

// A salt to use if the email is incorrect. This avoids information leakage
// about whether a user exists via the login process.
// Note that this does not prevent detection of user's emails from the signup
// service, which must check whether an email exists. The signup service may be
// modified in the future to require unique usernames but not necessarily
// unique emails to avoid leakage.
const errorSalt = generateSalt();

function validPass(res, pass) {
    if (!PASS_LENGTH(pass)) {
        clientError(res, "Invalid password length. " + PASS_DESC);
        return false;
    }
    if (!PASS_UPPERCASE.test(pass)) {
        clientError(res, "Password missing uppercase letter. " + PASS_DESC);
        return false;
    }
    if (!PASS_LOWERCASE.test(pass)) {
        clientError(res, "Password missing lowercase letter. " + PASS_DESC);
        return false;
    }
    if (!PASS_NUMBER.test(pass)) {
        clientError(res, "Password missing number. " + PASS_DESC);
        return false;
    }
    if (!PASS_SPECIAL.test(pass)) {
        clientError(res, "Password missing special character. " + PASS_DESC);
        return false;
    }
    return true; // Valid password
}

// Generate/regenerate the client's validated session. This overwrites an old
// valid session from the same device if the same cookie is used.
// Only set response data if res is defined (so that this code can be reused
// for signup and login).
const establishSession = (uid, name, req, res) => req.session.regenerate(err => {
    // If unable to confirm session, do not authorize subsequent requests.
    if (err) {
        if (res)
            serverError(res, err, "Unable to establish session.");
        return;
    }

    req.session.uid = uid;
    req.session.name = name;
    if (res)
        success200(res, "Logged in succesfully.");
})

// Use an external service to determine whether the email is valid. This
// currently only checks syntax because UW emails are detected as not
// deliverable, but a simple change to the line marked below can require the
// email address to be deliverable to be accepted.
async function validEmail(res, email) {
    try {  
        const data = (await axios.get(emailValidationUrl, {
            params: { email: email }
        })).data;

        if (data.data.valid_syntax) // Can add && data.data.deliverable to be strict
            return true;

        clientError(res, "Invalid email address.");
        return false;
    } catch (err) {
        serverError(res, err, "Email could not be validated. Please report to admin.");
        return false;
    }
}

// ----------------------------------------------------------------------------
// (C)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Create a new account with an email and password.
//
//     EXTERNAL SERVICE 1 (email validation)
//          Undisclosed rate limits may apply, potentially preventing the
//          creation of new accounts.
//
// URI: http://localhost:3001/auth/signup
router.post('/signup', async (req, res) => {
    if (requireBodyParams(req, res, "email", "name", "password")) return;

    // Validate email address (EXTERNAL SERVICE 1)
    if (!(await validEmail(res, req.body.email))) return;

    // Validate password format
    if (!validPass(res, req.body.password)) return;

    // Collect parameters for new user record
    const salt = generateSalt();
    const values = [
        req.body.email, req.body.name,
        salt, hash(req.body.password, salt),
        new Date()
    ];

    dbConnection.query(
        "INSERT INTO USERS (email, name, salt, password_hash, joined_time) VALUES (?);",
        [values], (err, result) => {
            if (err) {
                if (err.code == "ER_DUP_ENTRY")
                    return clientError(res, "Email is already in use.");
                return dbError(res, err);
            }
            
            // Attempt to establish session, but do not override success
            // response. This ensures the message that the account was created
            // is sent.
            establishSession(result.insertId, req.body.name, req, null);

            return createSuccess(res, "Account succesfully created");
    });
});

// ----------------------------------------------------------------------------
// (2) Log in to an existing account with an email and password. Establish
//     this session with the users uid (note that the session information is
//     stored on the server and not sent in cookies).
//
// URI: http://localhost:3001/auth/login
router.post('/login', (req, res) => {
    // Validate request format
    if (requireBodyParams(req, res, "email", "password"))
        return;
    
    dbConnection.query(
        "SELECT uid, name, salt, password_hash FROM USERS WHERE email = ?;",
        [req.body.email], (err, result) => {
            if (err)
                return dbError(res, err);
            
            // Check whether email has an account. Avoid leaking which of email
            // and password was wrong.
            if (result.length === 0) {
                hash(req.body.password, errorSalt);
                return clientError(res, "Email or password is incorrect.");
            }

            // Check whether password is correct. Avoid leaking which of email
            // and password is wrong.
            if (hash(req.body.password, result[0].salt).toString("hex") !==
                result[0].password_hash.toString("hex"))
                return clientError(res, "Email or password is incorrect.");
            
            // Attempt to establish session for the authenticated user.
            return establishSession(result[0].uid, result[0].name, req, res);
    });
});

// ----------------------------------------------------------------------------
// (3) Log out of the current account by ending the client's current session.
//     Note that this does not log out of the account on other devices, as the
//     current session is based only on the session ID sent in the client's
//     cookie.
//
// URI: http://localhost:3001/auth/logout
router.get('/logout', (req, res) => {
    if (!req.session.uid)
        return success200(res, "Was not logged in.")

    // Mark the session as invalid and confirm that the session data and its
    // old ID are invalidated. Report to the user whether this was successful.
    req.session.uid = null;
    req.session.name = null;
    req.session.save(
        err => err ?
            serverError(res, err, "Logout may have failed.") : 
            req.session.regenerate(
                err2 => err2 ?
                    serverError(res, err2, "Logout may have failed.") :
                    success200(res, "Logged out successfully.")
            )
    );
});


module.exports = router;

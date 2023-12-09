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
const { validLanguage } = require("./language");

// Languages from translation service
const languages = require("./language").languages;


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
// service, which checks whether an email exists. This may be updated in the
// future to prevent leakage here, perhaps replacing the email uniqueness
// constraint with a number of accounts that can be associated with a single
// email and a requirement that new users validate email address ownership.
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
const establishSession = (user, name, req, res) => req.session.regenerate(err => {
    // If unable to confirm session, do not authorize subsequent requests.
    if (err) {
        if (res)
            serverError(res, err, "Unable to establish session.");
        return;
    }

    req.session.user = user;
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
// (1) Create a new account with an email, password, holder name, and prefered
//     language. Currently, the language preference is only used for
//     translation, but it may be used to translate more UI elements in the
//     future.
//
//     EXTERNAL SERVICE 1 (email validation)
//          Undisclosed rate limits may apply, potentially preventing the
//          creation of new accounts.
//
// URI: http://localhost:3001/auth/signup
/**
 * @swagger
 * /auth/signup:
 *      post:
 *          summary: Create a new account with an email, password, holder name, and prefered language.
 *          tags: [User]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required: [username, email, name, password, language]
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: An unused username to associate with the new account
 *                              email:
 *                                  type: string
 *                                  description: A valid, unused email address to associate with the new account.
 *                              name:
 *                                  type: string 
 *                                  description: The name to associate with the account. This is not used for authentication and is purely cosmetic.
 *                              password:
 *                                  type: string
 *                                  description: A valid password for accessing the new account.
 *                              language:
 *                                  type: string
 *                                  description: The user's preferred language.
 *                          example:
 *                              username: merefish
 *                              email: "example@example.com"
 *                              name: Ariel Person
 *                              password: a1b2c3A*
 *                              language: en
 *          responses:
 *              200:
 *                  description: Account created.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              400:
 *                  description: The body is missing username, email, name, password, or language, the email or password has an invalid format, the language is invalid, or the email or username is already in use. See the error message.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Bad Request'
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.post('/signup', async (req, res) => {
    if (requireBodyParams(req, res, "username", "email", "name", "password", "language"))
        return;

    // Validate email address (EXTERNAL SERVICE 1)
    if (!(await validEmail(res, req.body.email)))
        return;

    // Validate password format
    if (!validPass(res, req.body.password))
        return;

    // Validate language preference
    if (!validLanguage(res, req.body.language))
        return; 

    // Collect parameters for new user record
    const salt = generateSalt();
    const values = [
        req.body.username, req.body.email, req.body.name,
        salt, hash(req.body.password, salt),
        new Date(), req.body.language
    ];

    // Add new record for this account.
    dbConnection.query(
        `INSERT INTO USERS (username, email, name, salt, password_hash, joined_time, lang)
         VALUES (?);`,
        [values], (err, result) => {
            if (err) {
                if (err.code == "ER_DUP_ENTRY")
                    return clientError(res, "Username or email is already in use.");
                return dbError(res, err);
            }
            
            // Attempt to establish session, but do not override success
            // response. This ensures the message that the account was created
            // is sent.
            establishSession(req.body.username, req.body.name, req, null);

            return createSuccess(res, "Account succesfully created.");
    });
});

// ----------------------------------------------------------------------------
// (2) Log in to an existing account with a username and password. Establish
//     this session with the username.
//
// URI: http://localhost:3001/auth/login
/**
 * @swagger
 * /auth/login:
 *      post:
 *          summary: Log into an account with a username and password. Establish this session with the username.
 *          tags: [User]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required: [username, password]
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: The username of an existing account.
 *                              password:
 *                                  type: string
 *                                  description: The password for the account.
 *                          example:
 *                              username: merefish
 *                              password: a1b2c3A*
 *          responses:
 *              200:
 *                  description: Logged in succesfully.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              400:
 *                  description: The body is missing username or password, the username is not associated with an account, or the password is wrong. See the error message.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Bad Request'
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.post('/login', (req, res) => {
    // Validate request format
    if (requireBodyParams(req, res, "username", "password"))
        return;
    
    dbConnection.query(
        "SELECT name, salt, password_hash FROM USERS WHERE username = ?;",
        [req.body.username], (err, result) => {
            if (err)
                return dbError(res, err);
            
            // Check whether email has an account. Avoid leaking which of email
            // and password was wrong.
            if (result.length === 0) {
                hash(req.body.password, errorSalt);
                return clientError(res, "Username or password is incorrect.");
            }

            // Check whether password is correct. Avoid leaking which of email
            // and password is wrong.
            if (hash(req.body.password, result[0].salt).toString("hex") !==
                result[0].password_hash.toString("hex"))
                return clientError(res, "Username or password is incorrect.");
            
            // Attempt to establish session for the authenticated user.
            return establishSession(req.body.username, result[0].name, req, res);
    });
});

// ----------------------------------------------------------------------------
// (3) Log out of the current account by ending the client's current session.
//     Note that this does not log out of the account on other devices, as the
//     current session is based only on the session ID sent in the client's
//     cookie.
//
// URI: http://localhost:3001/auth/logout
/**
 * @swagger
 * /auth/logout:
 *      get:
 *          summary: Log out of the current account by ending the client's current session. Note that this does not log out of the account on other devices, as the current session is based only on the session ID sent in the client's cookie.
 *          tags: [User]
 *          responses:
 *              200:
 *                  description: Logged out in succesfully, or was not logged in (guaranteed to not be logged in now).
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              500:
 *                  description: Internal server error. The session may not have been terminated.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.get('/logout', (req, res) => {
    if (!req.session.user)
        return success200(res, "Was not logged in.")

    // Mark the session as invalid and confirm that the session data and its
    // old ID are invalidated. Report to the user whether this was successful.
    req.session.user = null;
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

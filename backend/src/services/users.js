// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Service: /users
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router();

// Utilities
const {
    paramGiven, requireSomeBodyParam,
    getSuccess, success200,
    unauthorizedError, clientError, serverError, dbError
} = require("../routing");

// Email and password validation, and password establishment
const {
    generateSalt, hash, validPass, validEmail
} = require("../emailPassword");

// Language code validation
const { validLanguage } = require("./language");

// SQL update statement
const { modularUpdate, select } = require("../sqlQuery");

// Handle invalid sessions
const { sessionError } = require("./auth");

// ----------------------------------------------------------------------------
// (A)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve all information for the current user, or (for global admins
//     only), retrieve all information for a user from their email.
//     For customer support, global admins may use this for recovering a user's
//     account information (including the username required to sign in) from
//     their email.
//
// URI: http://localhost:3001/users
/**
 * @swagger
 * /users:
 *      get:
 *          summary: Retrieve all information for the current user, or (for global admins only), retrieve all information for a user from their email. For customer support, global admins may use this for recovering a user's account information (including the username required to sign in) from their email.
 *          tags: [Users]
 *          parameters:
 *              - in: header
 *                name: Email
 *                description: The email of the account to look up information for. If this is excluded, the account you are logged in to is used.
 *                schema:
 *                      type: string
 *          responses:
 *              200:
 *                  description: User data retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              required: [username, name, email, joined_time, lang]
 *                              properties:
 *                                  username:
 *                                      type: string
 *                                      description: The user's username
 *                                  name:
 *                                      type: string
 *                                      description: The user's chosen name
 *                                  email:
 *                                      type: string
 *                                      description: The user's email address
 *                                  joined_time:
 *                                      type: string
 *                                      description: The user's join date and time
 *                                  lang:
 *                                      type: string
 *                                      description: The user's preferred language
 *                              example:
 *                                  username: merefish
 *                                  name: Ariel Person
 *                                  email: "example@example.com"
 *                                  joined_time: 2023-12-09T17:27:56.000Z
 *                                  lang: en
 *              401:
 *                  description: Unauthorized. Not logged in, or Email header used by non-admin.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.get('/', (req, res) => select("USERS", "email, joined_time, lang, admin",
    "username", req.session.user, (err, result) => { // First, get this user
        if (err)
            return dbError(res, err);

        if (result.length === 0) // No rows matched the username (bad session).
            return serverError(resm);
        const myInfo = result[0];
        
        // Next, if the Email header is specified, the user must be a
        // global admin. If they are, the requested user's details will be
        // returned; otherwise, the request will fail as unauthorized.
        const email = req.get("Email");
        if (email != undefined && `${email}`.trim() != "") {
            if (!myInfo.admin)
                return unauthorizedError(res,
                    "Only global admins may use this header."
                );
            
            // Retrieve specified user's information from their email
            select("USERS", "username, email, name, joined_time, lang",
                "email", req.get("Email"), (err, result2) => {
                    if (err)
                        return dbError(res, err);
                    
                    if (result2.length === 0) // No users have this email.
                        return clientError(res, "This email is not in use");
        
                    return getSuccess(res, result2[0]); // User exists
            });
        } else { // No Email header, so simply return this user's details
            return getSuccess(res, {
                username: req.session.user, name: req.session.name,
                email: myInfo.email, joined_time: myInfo.joined_time, lang: myInfo.lang
            });
        }
    }
));

// ----------------------------------------------------------------------------
// (2) Update the password, email, name, and/or language of the current user.
//     If multiple sessions are logged in to the same account and the name is
//     changed, the new name will not be shown in other sessions until they log
//     in again.
//
// URI: http://localhost:3001/users
/**
 * @swagger
 * /users:
 *      put:
 *          summary: Update the password, email, name, and/or language of the current user. If multiple sessions are logged in to the same account and the name is changed, the new name will not be shown in other sessions until they log in again.
 *          tags: [Users]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              password:
 *                                  type: string
 *                                  description: The new password for the account
 *                              email:
 *                                  type: string
 *                                  description: The new email for the account
 *                              name:
 *                                  type: string
 *                                  description: The new holder name for the account
 *                              language:
 *                                  type: string
 *                                  description: The new preferred language for the new account
 *                          example:
 *                              name: Afake Person
 *                              language: es
 *          responses:
 *              200:
 *                  description: Specified values are now used, even if the same values as before were specified.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              400:
 *                  description: The body provided no values to update, the email or password has an invalid format, the language is invalid, or the email is already in use. See the error message.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Bad Request'
 *              401:
 *                  description: Unauthorized. Not logged in, or Email header used by non-admin.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.put('/', async (req, res) => {
    if (requireSomeBodyParam(req, res,
        "password", "email", "name", "language")) return;

    const values = {}; // The columns to update, and their new values

    // Validate email address (EXTERNAL SERVICE 1)
    if (paramGiven(req.body.email)) {
        if (!(await validEmail(res, req.body.email))) return;
        if (!validEmailLength(res, req.body.email)) return;

        values.email = req.body.email;
    }

    // Validate password format and generate salt and hash
    if (paramGiven(req.body.password)) {
        if (!validPass(res, req.body.password)) return;

        values.salt = generateSalt();
        values.password_hash = hash(req.body.password, values.salt);
    }
    
    // Add name if given
    if (paramGiven(req.body.name)) {
        if (!validNameLength(res, req.body.name)) return;

        values.name = req.body.name;
    }

    // Validate language preference
    if (paramGiven(req.body.language)) {
        if (!validLanguage(res, req.body.language)) return;

        values.lang = req.body.language;
    }

    // Attempt to update the specified values.
    modularUpdate("USERS", values, "username", req.session.user, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY")
                return clientError(res, "Email is already in use.");
            return dbError(res, err);
        }

        if (result.affectedRows === 0) // No record matched username
            return sessionError(req, res);

        if (paramGiven(req.body.name)) // Update session's name preference
            req.session.name = req.body.name;
        
        if (result.changedRows === 0) // Success, but same values given
            return success200(res, "Information unchanged.");

        return success200(res, "Information succesfully updated.");
    })
});

module.exports = router;

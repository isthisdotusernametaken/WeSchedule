// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// Authentication Utilities
//
// Author: Joshua Barbee
// ----------------------------------------------

// Axios for making external requests
const axios = require("axios");

// Cryptographic tools for passwords
const crypto = require("crypto");

// Utilities
const { clientError, serverError } = require("./routing");


// ----------------------------------------------------------------------------
// (A)  Password hashing.
// ----------------------------------------------------------------------------

// To avoid requiring ALL accounts to reset their passwords, these parameters
// should not be changed if at all possible.
// The salt length and hash length must match those of the database.
const HASH_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const HASH_LENGTH = 64;
const HASH_ALGORITHM = "sha512";

// Salt from CSPRNG as a hex string.
const generateSalt = () => crypto.randomBytes(SALT_LENGTH);

// Hash given password and salt with the server's hashing configuration. Return
// the hash as a hex string.
const hash = (pass, salt) =>
    crypto.pbkdf2Sync(
        pass, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGORITHM
    );


// ----------------------------------------------------------------------------
// (A)  Password validation.
// ----------------------------------------------------------------------------

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

// Require the specified password to meet the above requirements. Return true
// on success; return false and set response data on fail.
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


// ----------------------------------------------------------------------------
// (B)  Email validation with the external service eva.pingutil.com/email.
// ----------------------------------------------------------------------------

// External email validation service
const emailValidationUrl = "http://api.eva.pingutil.com/email";

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

module.exports = { generateSalt, hash, validPass, validEmail };

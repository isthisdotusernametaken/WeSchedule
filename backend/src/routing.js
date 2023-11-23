// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// Routing Utilities
//
// Author: Joshua Barbee
// ----------------------------------------------

// ----------------------------------------------------------------------------
// (A)  Report success to the client and return any necessary message or data.
//      For modifying data (i.e., not GET), a JSON object with a success
//      message in the "success" property is returned for successful requests.
//      This allows the client to check for non-GET requests success via the
//      presence of the "success" property. 
// ----------------------------------------------------------------------------

// Wrap the success message in an object for consistent JSON formatting.
const successMsg = msg => ({success: msg});

// Return the specified file with the status code 200 OK.
const getFileSuccess = (res, filename, rootDir) =>
    res.status(200).sendFile(filename, {root: rootDir});

// Return the specified data as a JSON object with the status code 200 OK.
const getSuccess = (res, output) => res.status(200).json(output);

// Report successful resource creation to the client with status code 201
// Created and the specified message.
// This for some but not necessarily all POST requests.
const createSuccess = (res, msg) => res.status(201).json(successMsg(msg));

// Report successful resource updating to the client with status code 200 OK
// and the specified message.
const putSuccess = (res, msg) => res.status(200).json(successMsg(msg));

// Report successful resource deletion to the client with status code 200 OK
// and the specified message.
const deleteSuccess = (res, msg) => res.status(200).json(successMsg(msg));

// ----------------------------------------------------------------------------
// (B)  Report an error to the client.
//      All error messages are returned in the "error" property of a JSON
//      object so that errors can be easily detected by checking for the
//      presence of the "error" property
// ----------------------------------------------------------------------------

// Wrap the error message in an object for consistent JSON formatting.
const errorMsg = msg => ({error: msg});

// Report the specified error with a 400 Bad Request status code to indicate
// client error.
const clientError = (res, msg) => res.status(400).json(errorMsg(msg));

// Report the specified error with a 500 Internal Server Error status code to
// indicate server error.
const serverError = (res, msg) => res.status(500).json(errorMsg(msg));

// Report a data retrieval error.
// This should be used when any unexpected SQL error occurs.
const dataRetrievalError = res =>
    serverError(res, "Error in data retrieval. Please report to admin.");

// ----------------------------------------------------------------------------
// (C)  Handle all uncaught errors from external modules before sending
//      response. 
// ----------------------------------------------------------------------------

// Return an error message for failures outside of routing code
const handleErrors = (res, err) => {
    if (err.type === "entity.parse.failed")
        clientError(res, "Invalid JSON in body.");
    else // All unknown errors
        serverError(res, "Server error. Please report to admin.")
}


module.exports = {
    getFileSuccess, getSuccess, createSuccess, putSuccess, deleteSuccess,
    clientError, serverError, dataRetrievalError,
    handleErrors
};

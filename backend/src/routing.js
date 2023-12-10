// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// Routing Utilities
//
// Author: Joshua Barbee
// The success and error format and many of the
// methods are based on my Assignment 4
// submission.
// ----------------------------------------------

// ----------------------------------------------------------------------------
// (A)  Utility functions to simplify routing code.
// ----------------------------------------------------------------------------

// Determine whether a nonempty value was provided.
const paramGiven = param => param != undefined && `${param}`.trim() !== "";

// If the the specified property is not in the request body or is blank, send a
// descriptive error and return true (so that the caller can immediately exit);
// otherwise, return false to signal that the caller should not exit (the
// property exists and is nonempty). Set the response data on failure if res is
// defined.
const requireBodyParam = (req, res, param) => {
    // eslint-disable-next-line
    if (!paramGiven(req.body[param])) {
        if (res)
            clientError(res, `The "${param}" property is required in the body.`);
        return true; // Exit
    } else {
        return false; // Continue
    }
}

// Require all of the specified properties in the request body, as for
// requireBodyParam.
const requireBodyParams = (req, res, ...params) =>
    params.some(param => requireBodyParam(req, res, param));

// Require at least one of the specified properties in the request body, as for
// requireBodyParam.
const requireSomeBodyParam = (req, res, ...params) => {
    const hasNone = params.every(param => requireBodyParam(req, null, param));

    if (hasNone) {
        clientError(res, `The body requires at least one of ${params.join(",")}.`);
        return true;
    }
    return false;
}
    

// Require the specified request header, as for requireBodyParam.
const requireHeader = (req, res, header) => {
    // eslint-disable-next-line
    if (!paramGiven(req.get(header))) {
        clientError(res, `The "${header}" header is required.`);
        return true; // Exit
    } else {
        return false; // Continue
    }
}

// Require all of the specified request headers, as for requireHeader.
const requireHeaders = (req, res, ...headers) =>
    headers.some(header => requireHeader(req, res, header));

// ----------------------------------------------------------------------------
// (B)  Report success to the client and return any necessary message or data.
//      For modifying data (i.e., not GET), a JSON object with a success
//      message in the "success" property is returned for successful requests.
//      This allows the client to check for non-GET requests success via the
//      presence of the "success" property. 
// ----------------------------------------------------------------------------

// Wrap the success message in an object for consistent JSON formatting.
const successWithMsg = (res, status, msg) =>
    res.status(status).json({success: msg});

// Return the specified file with the status code 200 OK.
const getFileSuccess = (res, filename, rootDir) =>
    res.status(200).sendFile(filename, {root: rootDir});

// Return the specified data as a JSON object with the status code 200 OK.
// This supports GET requests and other requests that return data.
const getSuccess = (res, output) => res.status(200).json(output);

// Report successful resource creation to the client with status code 201
// Created and the specified message.
// This supports some but not necessarily all POST requests.
const createSuccess = (res, msg) => successWithMsg(res, 201, msg);

// Report success with status 200 and a message. This supports
// This supports DELETE and PUT requests and the remaining POST requests.
const success200 = (res, msg) => successWithMsg(res, 200, msg);

// ----------------------------------------------------------------------------
// (C)  Report an error to the client.
//      All error messages are returned in the "error" property of a JSON
//      object so that errors can be easily detected by checking for the
//      presence of the "error" property.
// ----------------------------------------------------------------------------

// Wrap the error message in an object for consistent JSON formatting.
const error = (res, status, msg) => res.status(status).json({error: msg});

// Report the specified error with a 400 Bad Request status code to indicate
// client error.
const clientError = (res, msg) => error(res, 400, msg);

// Report the specified error with a 400 Bad Request status code to indicate
// client error.
const unauthorizedError = (res, msg) => error(res, 401, msg);

// Report the specified error with a 500 Internal Server Error status code to
// indicate server error.
const serverErrorNoLog = (res, msg) => error(res, 500, msg);

// Report the specified error with a 500 Internal Server Error status code to
// indicate server error. Log the error to the console for easier diagnosis.
const serverError = (res, err, msg) => {
    serverErrorNoLog(res, msg);
    console.error(err);
};

// Report a data retrieval error.
// This should be used when any unexpected SQL error occurs.
const dbError = (res, err) =>
    serverError(res, err, "Data error. Please report to admin.");

// Report the specified error with a 500 Internal Server Error status code to
// indicate server error.
const unknownError = (res, err) =>
    serverError(res, err, "Server error. Please report to admin.");

// ----------------------------------------------------------------------------
// (D)  Handle all uncaught errors from external modules and custom code to
//      (1) reduce checking in the processing code for routes and to (2) ensure
//      a consistent error format.
// ----------------------------------------------------------------------------

// Return an error message for failures before routing code.
const handleErrorsBefore = (req, res, err) => {
    if (err.type === "entity.parse.failed") // Bad body format
        clientError(res,
            req.get("Content-Type") === "application/json" ?
            "Invalid JSON in body." : "Invalid body format."
        );
    else // All unknown errors
        unknownError(res, err);
}

// Return an error message for unhandled errors in the routing code.
const handleErrorsAfter = (req, res, err) => unknownError(res, err);


module.exports = {
    paramGiven, requireBodyParams, requireSomeBodyParam, requireHeaders,
    getFileSuccess, getSuccess, createSuccess, success200,
    clientError, unauthorizedError, serverErrorNoLog, serverError, dbError,
    handleErrorsBefore, handleErrorsAfter
};

// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
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

// Determine whether the given value is a valid boolean
const isBool = val => [true, false, "true", "false", 0, 1].includes(val);

// Convert the given value to a boolean. This assumes isBool was called.
const convertToBool = val => val === "true" || val === true || val === 1;


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

// Report the specified error with a 401 Unauthorized status code to indicate
// lack of access.
const unauthorizedError = (res, msg) => error(res, 401, msg);

// Report the specified error with a 404 Not Found status code to indicate
// the resource cannot be accessed.
const notFoundError = (res, msg) => error(res, 404, msg);

// Report the resource either does not exist or cannot be accessed by this user
// with a 404 Not Found status code.
// If req is defined, use it to indicate to global admins that the resource
// truly does not exist; req may not be defined so that global admins cannot
// access a resource either. It is still possible for global admins to access
// such resources, but many visible steps (such as forcibly joining a group)
// will be required, allowing global admins to perform system maintenance while
// also providing some barriers to unchecked admin intervention.
const notExistsOrNoAccess = (req, res, resource) =>
    notFoundError(res, `${resource} does not exist` + (
        (req && req.session.admin) ? "." : ", or you do not have access for this."
    ));

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
    serverError(res, err,
        "Data error. Please refresh the page. If the error persists, please " +
        "report to global admin."
    );

// Report the specified error with a 500 Internal Server Error status code to
// indicate server error.
const unknownError = (res, err) =>
    serverError(res, err, "Server error. Please report to global admin.");

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
    isBool, convertToBool,

    getSuccess, createSuccess, success200,
    clientError, unauthorizedError, notFoundError, notExistsOrNoAccess,
    serverErrorNoLog, serverError, dbError,
    
    handleErrorsBefore, handleErrorsAfter
};

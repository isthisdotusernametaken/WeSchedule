// ----------------------------------------------
// TCSS 460: Autumn 2023
// WeSchedule Backend
//
// Author: Joshua Barbee
// This file is partially based on my index.js
// for Assignment 4, which was mostly based on
// the index.js file provided for the assignment
// on Canvas
// (https://canvas.uw.edu/courses/1669859/files/111914835).
// ----------------------------------------------

const PORT = 3001; // 3001 to avoid conflict with 3000 for frontend
const MAX_SESSION_AGE = 1000 * 60 * 60 * 24 * 7 // 7 days before auto logout

// Load necessary modules (express, cors, express-session, swagger-ui-express,
// swagger-jsdoc)
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const {
    handleErrorsBefore, handleErrorsAfter, unauthorizedError
} = require("./src/routing")
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

// ----------------------------------------------------------------------------
// (A)  Create an express application using the above modules.
//      Incoming requests' bodies are parsed as JSON unless specified otherwise
//          by Content-Type (e.g., for images or other binary data).
//      All uncaught errors (including for invalid body format) are captured to
//          ensure response body uniformity.
// ----------------------------------------------------------------------------
const app = express();
app.use(express.json())
app.use(cors());

// Intercept errors before our code to ensure consistent error messages.
app.use((err, req, res, next) =>
    err ? handleErrorsBefore(req, res, err) : next());


// ----------------------------------------------------------------------------
// (B)  Add session manager.
//
//      IMPORTANT NOTE: When moving to production, make the following changes
//          1. Specify a MySQL memory store with express-mysql-session, rather
//             than using the current, insecure default of MemoryStore.
//          2. Set "secure" to true in the cookie options object, and only use
//             HTTPS, rather than the current HTTP communications that will
//             not protect the session ID, email, or password.
// ----------------------------------------------------------------------------
app.use(session({
    secret: require("./config/sessionKey.json").key, // Load secret from config
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: MAX_SESSION_AGE }
}))

// ----------------------------------------------------------------------------
// (C)  Add the Swagger documentation.
// ----------------------------------------------------------------------------
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WeSchedule API",
            version: require("./package.json").version,
            description: "WeSchedule groups over HTTP with REST."
        },
        servers: [{ url: `http://localhost:${PORT}` }]
    },
    apis: ["./src/swaggerBase.js", "./src/services/*.js"]
})));

// ----------------------------------------------------------------------------
// (D)  Add the routes for the API.
// ----------------------------------------------------------------------------

// No session required for this service. This service establishes sessions.
app.use("/auth", require("./src/services/auth"));

// If valid session, continue; otherwise, skip next callbacks.
const authenticatedUser = express.Router()
// eslint-disable-next-line
authenticatedUser.use((req, res, next) => req.session.uid != null ? next() :
    unauthorizedError(res, "Invalid session. You must log in with /auth/login.")
);

// Valid session required for these services
// authenticatedUser.use("/users", require("./src/services/users"));
// authenticatedUser.use("/groups", require("./src/services/groups"));
// authenticatedUser.use("/groups/:group/users", require("./src/services/groupUsers"));
// authenticatedUser.use("/groups/:group/topics", require("./src/services/topics"));
// authenticatedUser.use("/groups/:group/topics/:topic/messages", require("./src/services/messages"));
// authenticatedUser.use("/translate", require("./src/services/translate"));
// authenticatedUser.use("/groups/:group/events", require("./src/services/events"));
// authenticatedUser.use("/groups/:group/stats", require("./src/services/stats"));
// authenticatedUser.use("/groups/:group/visualization", require("./src/services/visualization"));

app.use("/", authenticatedUser);



app.use((err, req, res, next) =>
    err ? handleErrorsAfter(req, res, err) : next());

// ----------------------------------------------------------------------------
// (E)  Listen to requests on specified port.
// ----------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log("Express server is running and listening.");
});

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
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

// Load utilities
const {
    handleErrorsBefore, handleErrorsAfter, unauthorizedError
} = require("./src/routing")
const { ifGroupMember } = require("./src/services/groupMembers");
const { ifTopicMember } = require("./src/services/topicMembers");


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
app.use("/auth", require("./src/services/auth").router);
app.use("/language", require("./src/services/language").router);


// For all but /auth and GET /language
// If valid session, continue; otherwise, skip next callbacks.
// Valid session required for all services below (2-9). Valid session required
// for part of WS-10, so this is handled in that service.
const authenticatedUser = express.Router()
authenticatedUser.use((req, res, next) => req.session.user != null ? next() :
    unauthorizedError(res, "Invalid session. You must log in with /auth/login.")
);

authenticatedUser.use("/users", require("./src/services/users").router);
authenticatedUser.use("/groups", require("./src/services/groups"));
authenticatedUser.use("/groups/:gid/users", require("./src/services/groupMembers").router);


// For /groups/{gid}/...
// If group member, continue; otherwise, skip next callbacks.
// Valid group member required for all services below (5-9). Required for some
// routes in WS-4, so this is handled in that service's file.
const authenticatedGroupMember = express.Router({ mergeParams: true })
authenticatedGroupMember.use((req, res, next) =>
    ifGroupMember(false, res, req.params.gid, req.session.user, localAdmin => {
        // If user is in group, pass their admin status to route
        req.localAdmin = localAdmin;
        next();
    })
);

authenticatedGroupMember.use("/topics", require("./src/services/topics").router);
authenticatedGroupMember.use("/topics/:topic/users", require("./src/services/topicMembers").router);
authenticatedGroupMember.use("/log", require("./src/services/log"));


// For /groups/{gid}/topics/{topic}/...
// If topic member, continue; otherwise, skip next callbacks.
// Valid topic member required for all services below (7-8). Required for some
// routes in WS-6, so this is handled in that service's file.
const authenticatedTopicMember = express.Router({ mergeParams: true })
authenticatedTopicMember.use((req, res, next) =>
    ifTopicMember(res, req.params.gid, req.params.topic, req.session.user,
        (event_perm, message_perm) => {
            // If user is in topic, pass their event and message perms to route
            req.event_perm = event_perm;
            req.message_perm = message_perm;
            next();
        }
    )
);

authenticatedTopicMember.use("/messages", require("./src/services/messages"));
authenticatedTopicMember.use("/events", require("./src/services/events"));


authenticatedGroupMember.use("/topics/:topic", authenticatedTopicMember);
authenticatedUser.use("/groups/:gid", authenticatedGroupMember);
app.use("/", authenticatedUser);


// Catch errors missed by routing code.
app.use((err, req, res, next) =>
    err ? handleErrorsAfter(req, res, err) : next());

// ----------------------------------------------------------------------------
// (E)  Listen to requests on specified port.
// ----------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log("Express server is running and listening.");
});

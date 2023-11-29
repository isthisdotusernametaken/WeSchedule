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

// ----------------------------------------------
// Load necessary modules (express, cors)
const express = require("express")
const cors = require("cors")
const {handleErrors, getFileSuccess} = require("./src/routing")

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

// Intercept errors to ensure consistent error messages.
app.use((err, req, res, next) => err ? handleErrors(req, res, err) : next());

// ----------------------------------------------------------------------------
// (C)  Add the routes for the UI, the documentation, and the services.
// ----------------------------------------------------------------------------
app.get("/", (req, res) => getFileSuccess(res, "index.html", __dirname));
app.get("/docs", (req, res) => getFileSuccess(res, "docs.html", __dirname));

// ----------------------------------------------------------------------------
// (D)  Listen to requests on specified port.
app.listen(PORT, () => {
    console.log("Express server is running and listening.");
});

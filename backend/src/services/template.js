// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// Service: /template
//
// Author: Joshua Barbee
// ----------------------------------------------

// Establish a connection to the database
// Note that config.js will only be executed once despite being imported in
// multiple files.
const dbConnection = require("../dbConfig")

// Create router for routes in this service
const router = require("express").Router();

// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by multiple routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (B)  Define data and behavior used by multiple routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve ... .
//
// URI: http://localhost:3000/template
router.get('/', (req, res) => {
    
});

// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// Service: /template
//
// Author: Joshua Barbee
// ----------------------------------------------

// Establish a connection to the database
const dbConnection = require("../dbConfig")

// Create router for routes in this service
const router = require("express").Router();

// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve ... .
//
// URI: http://localhost:3001/template
router.get('/', (req, res) => {
    
});

module.exports = router;

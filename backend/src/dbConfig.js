// ----------------------------------------------
// TCSS 460: Autumn 2023
// MySQL Configuration: Backend
// ----------------------------------------------
// Code is based on the 
// Node.js for MySQL Library:
// https://github.com/mysqljs/mysql
// 
// This version is adapted from the file
// "config.js" included on the "Assignment 4"
// page from the Canvas course.
// ----------------------------------------------

// ----------------------------------------------
// (A) Import the MySQL module or library
// ----------------------------------------------
const mysql = require("mysql");

// ----------------------------------------------
// (B) Configure the connection options for MySQL
// ----------------------------------------------
// ###### username and password must match ######
// ----------------------------------------------
// Ensure username and password match the ones
// identified using phpMyAdmin when creating
// the testuser account. We are using the default
// port that is created by XAMPP for MySQL: 3306.
// ----------------------------------------------
const mysqlConfig = {
    host: "localhost", 
    port: 3306,
    user: "testuser", 
    password: "mypassword",
    database: "weschedule_db",
    debug: false // Connection debugging mode is OFF
};

// ----------------------------------------------
// (C) Establishing connection using the options
//     defined in mySQLConfig (without a query)
// ----------------------------------------------
const dbConnection = mysql.createConnection(mysqlConfig);
dbConnection.connect(function(err) {
    // Unsuccessful: handle any errors that might occur during connection
    if (err) {
        console.error('Error connecting to the database: ', err.stack);
        return;
    }
    // Successful: output on the screen a message that connection was successful
    console.log('Backend is now connected to: ' + dbConnection.config.database + '.');
});

// ----------------------------------------------
// (D) This module exports dbConnection to be 
//     used other files (e.g., index.js)
// ----------------------------------------------
module.exports = dbConnection;

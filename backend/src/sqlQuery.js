// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// SQL Query Utilities
//
// Author: Joshua Barbee
// ----------------------------------------------

const dbConnection = require("./dbConfig");

// In the specified table, for the row(s) where the column selector has the
// value selectorVal, update only the columns specified in newVals.
// newVals is an object whose keys are column names and whose values are the
// new column values.
// Call the callback function as with any call to dbConnection.query.
const modularUpdate = (
    table, newVals, selector, selectorVal, callback
) => dbConnection.query(
    `UPDATE ${table}
     SET ${Object.keys(newVals).map(name => `
        ${name} = ?`)}
     WHERE ${selector} = ?;`, // Query
    [...Object.values(newVals), selectorVal], // Values
    callback // Handle err/result
);

module.exports = { modularUpdate };

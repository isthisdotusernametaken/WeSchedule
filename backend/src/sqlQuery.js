// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// SQL Query Utilities
//
// Author: Joshua Barbee
// ----------------------------------------------

const dbConnection = require("./dbConfig");

// Utilities
const { success200 } = require("./routing");

// If the array is already stringified, keep it; otherwise stringify it.
const columnStr = arrayOrStr =>
    Array.isArray(arrayOrStr) ? arrayOrStr.join(", ") : arrayOrStr;

// With a string or array of strings for selectors, format the selectors to be
// in a WHERE clause.
const selectorStr = arrayOrStr =>
    Array.isArray(arrayOrStr) ?
        arrayOrStr.map(selector => selector + " = ?").join(" AND ") :
        arrayOrStr + " = ?";

// If a single value is provided, place it in an array. Otherwise, keep the
// provided array. This allows the returned value to be expanded.
const selectorValArr = arrayOrScalar =>
    Array.isArray(arrayOrScalar) ? arrayOrScalar : [arrayOrScalar];

// In the specified table, for the row(s) where the column(s) given by selector
// have the value(s) given by selectorVal, update only the columns specified in
// newVals. Due to the needs of this project, only some functions allow
// multiple selectors.
// Call the callback function as with any call to dbConnection.query.
// 
// newVals is an object whose keys are column names and whose values are the
// new column values.
// selector and selectorVal are used for the WHERE clause.
const update = (
    table, newVals, selector, selectorVal, callback
) => dbConnection.query(
    `UPDATE ${table}
     SET ${Object.keys(newVals).map(name => `
        ${name} = ?`)}
     WHERE ${selectorStr(selector)};`, // Query
    [...Object.values(newVals), ...selectorValArr(selectorVal)], // Values and selectors
    callback // Handle err/result
);

// Set response data for a successful update, noting whether the new values are
// identical to the old values.
const updateSuccess = (res, result) => success200(res,
    result.changedRows === 0 ? // Success, but same values given
        "Information unchanged." : "Information succesfully updated."
);

// In the specified table, retrieve the row(s) where the column selector has
// the value selectorVal (or all rows from the table if selector is undefined).
// Multple selector columns are allowed.
// Call the callback function as with any call to dbConnection.query.
// 
// selector and selectorVal are used for the WHERE clause.
const select = (
    table, columns, selector, selectorVal, callback
) => dbConnection.query(
    `SELECT ${columnStr(columns)}
     FROM ${table}${
        selector != undefined ? " WHERE " + selectorStr(selector) : ""
     };`,
    selector != undefined ? selectorValArr(selectorVal) : [],
    callback
)

// In the specified join with the specified joinOn condition, retrieve the
// row(s) where the column selector has the value selectorVal (or all rows from
// the join if selector is undefined). Multiple selectors are not explicitly
// allowed, but joinOn can be used for arbitrary conditions.
// Call the callback function as with any call to dbConnection.query.
// 
// selector, selectorVal, and joinOn are used for the WHERE clause.
const selectJoin = (
    tables, columns, selector, selectorVal, joinOn, callback
) => dbConnection.query(
    `SELECT ${columnStr(columns)}
     FROM ${tables}
     WHERE ${joinOn}${
        selector != undefined ? " AND " + selector + " = ?" : ""
     };`,
    selector != undefined ? [selectorVal] : [],
    callback
)

// In the specified table, insert a new row with the specified values for the
// specified columns.
// 
// selector, selectorVal, and joinOn are used for the WHERE clause.
const insert = (table, columns, values, callback) => dbConnection.query(
    `INSERT INTO ${table} (${columnStr(columns)}) VALUES (?);`, [values], callback
);

// In the specified table, delete the row(s) with the specified values for the
// specified columns.
const deleteData = (table, selector, selectorVal, callback) => dbConnection.query(
    `DELETE FROM ${table} WHERE ${selectorStr(selector)};`,
    selectorValArr(selectorVal), callback
);


// Modify the given result set in place, converting the specified columns to
// booleans. The result set is returned for ease of use.
const toBool = (results, ...cols) => {
    results.forEach(row => cols.forEach(col => row[col] = !!row[col]));
    return results;
}


module.exports = {
    update, select, selectJoin, insert, deleteData,
    updateSuccess,
    toBool
};

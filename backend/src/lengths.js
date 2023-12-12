// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Length Validation
//
// Author: Joshua Barbee
// ----------------------------------------------

const { clientError } = require("./routing");

// Enforce a maximum length. Set response data on invalid length.
function validLength(res, str, max, type) {
    if (`${str}`.length > max) {
        clientError(res, `${type} must be less than ${max} characters.`);
        return false;
    }
    return true;
}

// Lengths of different columns
const usernameLength = 20;
const nameLength = 256;
const emailLength = 256;
const eventNameLength = 50;
const topicNameLength = 50;
const groupNameLength = 50;
const description = 1000;

const validUsernameLength = (res, str) =>
    validLength(res, str, usernameLength, "Username");
const validNameLength = (res, str) =>
    validLength(res, str, nameLength, "Name");
const validEmailLength = (res, str) =>
    validLength(res, str, emailLength, "Email");
const validEventNameLength = (res, str) =>
    validLength(res, str, eventNameLength, "Event name");
const validTopicNameLength = (res, str) =>
    validLength(res, str, topicNameLength, "Topic name");
const validGroupNameLength = (res, str) =>
    validLength(res, str, groupNameLength, "Group name");
const validDescriptionLength = (res, str) =>
    validLength(res, str, description, "Description");

module.exports = {
    validUsernameLength, validNameLength, validEmailLength,
    validEventNameLength, validTopicNameLength, validGroupNameLength,
    validDescriptionLength
}

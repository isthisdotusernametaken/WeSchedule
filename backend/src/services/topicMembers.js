// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Service: /groups/{gid}/topics/{topic}/users
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router({ mergeParams: true });

// Utilities
const {
    paramGiven, isBool, convertToBool,
    getSuccess, createSuccess, success200,
    notFoundError, clientError, dbError, requireSomeBodyParam
} = require("../routing");
const {
    select, insert, update, updateSuccess, deleteData, toBool
} = require("../sqlQuery");
const { notLocalAdminError } = require("./groupMembers");

// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

// If the specified user is a member of the specified topic, call
// successCallback with the member's event and message creation permissions.
const ifTopicMember = (res, group, topic, user, successCallback) =>
    select(
        "TOPIC_MEMBERS", "event_perm, message_perm",
        ["gid", "topic", "username"], [group, topic, user],
        (err, result) => err ?
            dbError(res, err) :
            result.length === 0 ? // Invalid topic or member
                badUserOrTopic(res) :
                successCallback(!!result[0].event_perm, !!result[0].message_perm) // Valid member, continue
    );

// Route (3) as a function. Add the specified user to the topic if the current
// user is a local admin. On success, call successCallback.
const addTopicMember = (
    localAdmin, res,
    gid, topic, username, event_perm, message_perm,
    successCallback
) =>
    !localAdmin ? // Only add member if current user is local admin
        notLocalAdminError(res) :
    insert(
        "TOPIC_MEMBERS", "gid, topic, username, event_perm, message_perm",
        [gid, topic, username, event_perm, message_perm],
        (err, result) =>
            err ?
                ( // Insertion failed
                    err.code === "ER_NO_REFERENCED_ROW_2" ? // User not in group
                        clientError(res, "That user or topic does not exist, or the user is not in this group.") :
                    err.code === "ER_DUP_ENTRY" ? // User already in topic
                        clientError(res, "That user is already in this topic.") :
                    dbError(res, err)
                ) :
            successCallback()
    );

// 404 for user not being in the topic or topic not existing. Sets Bad-Param
// header to "username".
const badUserOrTopic = res => {
    res.set("Bad-Param", "username")
    notFoundError(res,
        "That user or topic does not exist, or the user is not in this topic."
    );
}

/**
 * @swagger
 * components:
 *     schemas:
 *          Topic Member:
 *              type: object
 *              required: [event_perm, message_perm]
 *              properties:
 *                  username:
 *                      type: string
 *                      description: The user's username
 *                  event_perm:
 *                      type: boolean
 *                      description: Whether the user can create events
 *                  message_perm:
 *                      type: boolean
 *                      description: Whether the user can send messages
 *              example:
 *                  username: merefish
 *                  event_perm: true
 *                  message_perm: true
 */

// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve the username, event creation permission, and message sending
//     permission for all users in the specified topic.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/users
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/users:
 *      get:
 *          summary: Retrieve the username, event creation permission, and message sending permission for all users in the specified topic.
 *          tags: [Topic Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: path
 *                name: topic
 *                description: The target topic's name
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: Topic membership data retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Topic Member'
 *              401:
 *                  description: Unauthorized. Not logged in or lack required privileges.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              404:
 *                  description: Not Found. The group or topic does not exist, or you are not a group member.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Not Found'
 *                  headers:
 *                      Bad-Param:
 *                          description: The name of the invalid parameter (e.g., gid, username). If multiple parameters or a combination is invalid, any of the invalid parameters may be marked.
 *                          schema:
 *                              type: string
 *                              example: gid
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.get('/', (req, res) => select(
    "TOPIC_MEMBERS", ["username, event_perm, message_perm"],
    ["gid", "topic"], [req.params.gid, req.params.topic],
    (err, result) =>
        err ?
            dbError(res, err) :
        getSuccess(res, toBool(result, "event_perm", "message_perm"))
));

// ----------------------------------------------------------------------------
// (2) Retrieve event creation permission and message sending permission for
//     the specified user in the topic.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/users/{username}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/users/{username}:
 *      get:
 *          summary: Retrieve event creation permission and message sending permission for the specified user in the topic.
 *          tags: [Topic Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: path
 *                name: topic
 *                description: The target topic's name
 *                schema:
 *                      type: string
 *                required: true
 *              - in: path
 *                name: username
 *                description: The target user's username
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: Topic membership retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Topic Member'
 *              401:
 *                  description: Unauthorized. Not logged in or lack required privileges.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              404:
 *                  description: Not Found. The group or topic or user does not exist, or you are not a group member.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Not Found'
 *                  headers:
 *                      Bad-Param:
 *                          description: The name of the invalid parameter (e.g., gid, username). If multiple parameters or a combination is invalid, any of the invalid parameters may be marked.
 *                          schema:
 *                              type: string
 *                              example: gid
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.get('/:username', (req, res) => select(
    "TOPIC_MEMBERS", ["event_perm, message_perm"],
    ["gid", "topic", "username"],
    [req.params.gid, req.params.topic, req.params.username],
    (err, result) =>
        err ?
            dbError(res, err) :
        result.length === 0 ? // No match
            badUserOrTopic(res) :
        getSuccess(res, toBool(result, "event_perm", "message_perm")[0])
));

// ----------------------------------------------------------------------------
// (3) Add the user with the specified username to the topic. Only local admins
//     may do this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/users/{username}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/users/{username}:
 *      post:
 *          summary: Add the user with the specified username to the topic. Only local admins may do this.
 *          tags: [Topic Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: path
 *                name: topic
 *                description: The target topic's name
 *                schema:
 *                      type: string
 *                required: true
 *              - in: path
 *                name: username
 *                description: The target user's username
 *                schema:
 *                      type: string
 *                required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required: [event_perm, message_perm]
 *                          properties:
 *                              event_perm:
 *                                  type: boolean
 *                                  description: Whether the user can create events
 *                              message_perm:
 *                                  type: boolean
 *                                  description: Whether the user can send messages
 *          responses:
 *              201:
 *                  description: Topic member added.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Created'
 *              400:
 *                  description: The user or topic does not exist, or the user is already a topic member.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Bad Request'
 *              401:
 *                  description: Unauthorized. Not logged in or lack required privileges.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.post('/:username', (req, res) => addTopicMember(
    req.localAdmin, res, req.params.gid, req.params.topic, req.params.username,
    false, true, () => // Default permission only for sending messages
        createSuccess(res, "User added to topic.")
));

// ----------------------------------------------------------------------------
// (4) Update the user's event and/or message permissions. Only a local admin
//     can do this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/users/{username}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/users/{username}:
 *      put:
 *          summary: Update the user's event and/or message permissions. Only a local admin can do this.
 *          tags: [Topic Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: path
 *                name: topic
 *                description: The target topic's name
 *                schema:
 *                      type: string
 *                required: true
 *              - in: path
 *                name: username
 *                description: The target user's username
 *                schema:
 *                      type: string
 *                required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              event_perm:
 *                                  type: boolean
 *                                  description: Whether the user can create events
 *                              message_perm:
 *                                  type: boolean
 *                                  description: Whether the user can send messages
 *                          example:
 *                              event_perm: true
 *          responses:
 *              200:
 *                  description: Specified values are now used, even if the same values as before were specified.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              400:
 *                  description: The body provided no values to update, or the specified values are not booleans.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Bad Request'
 *              401:
 *                  description: Unauthorized. Not logged in or lack required privileges.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              404:
 *                  description: Not Found. The group or topic or user does not exist, or the specified user/topic is not in the topic/group
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Not Found'
 *                  headers:
 *                      Bad-Param:
 *                          description: The name of the invalid parameter (e.g., gid, username). If multiple parameters or a combination is invalid, any of the invalid parameters may be marked.
 *                          schema:
 *                              type: string
 *                              example: gid
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.put('/:username', (req, res) => {
    // Ensure current user is local admin
    if (!req.localAdmin) return notLocalAdminError(res);

    if (requireSomeBodyParam(req, res, "event_perm", "message_perm")) return;

    const values = {}; // The columns to update, and their new values

    // Add event_perm if given
    if (paramGiven(req.body.event_perm)) {
        if (!isBool(req.body.event_perm)) // Require boolean if given
            return clientError(res, "event_perm must be a boolean.")

        values.event_perm = convertToBool(req.body.event_perm);
    }

    // Add message_perm if given
    if (paramGiven(req.body.message_perm)) {
        if (!isBool(req.body.message_perm)) // Require boolean if given
            return clientError(res, "message_perm must be a boolean.")

        values.message_perm = convertToBool(req.body.message_perm);
    }

    update(
        "TOPIC_MEMBERS", values,
        ["gid", "topic", "username"],
        [req.params.gid, req.params.topic, req.params.username],
        (err, result) =>
            err ?
                dbError(res, err) :
            result.affectedRows === 0 ? // No row matched gid, topic, and username
                badUserOrTopic(res) :
            updateSuccess(res, result) // Updated
    )
});

// ----------------------------------------------------------------------------
// (5) Remove the specified user from the topic. Only local admins can do this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/users/{username}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/users/{username}:
 *      delete:
 *          summary: Remove the specified user from the topic. Only local admins can do this.
 *          tags: [Topic Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: path
 *                name: topic
 *                description: The target topic's name
 *                schema:
 *                      type: string
 *                required: true
 *              - in: path
 *                name: username
 *                description: The target user's username
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: User removed from group. Their messages are not deleted.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              401:
 *                  description: Unauthorized. Not logged in or lack required privileges.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              404:
 *                  description: Not Found. The group or topic or user does not exist, or you are not a group member.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Not Found'
 *                  headers:
 *                      Bad-Param:
 *                          description: The name of the invalid parameter (e.g., gid, username). If multiple parameters or a combination is invalid, any of the invalid parameters may be marked.
 *                          schema:
 *                              type: string
 *                              example: gid
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.delete('/:username', (req, res) =>
    !req.localAdmin ? // Don't allow delete from non-admin
        notLocalAdminError(res) :
    deleteData(
        "TOPIC_MEMBERS",
        ["gid", "topic", "username"],
        [req.params.gid, req.params.topic, req.params.username],
        (err, result) =>
            err ?
                dbError(res, err) :
            result.affectedRows === 0 ? // Topic or user not found
                badUserOrTopic(res) :
            success200(res, "User successfully removed from topic.")
    )
);


module.exports = { router, ifTopicMember, addTopicMember };

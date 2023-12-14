// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Service: /groups/{gid}/topics
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router({ mergeParams: true });

const { validTopicNameLength, validDescriptionLength } = require("../lengths");
// Utilities
const {
    paramGiven, isBool, convertToBool,
    getSuccess, createSuccess, success200,
    notFoundError, clientError, dbError, requireSomeBodyParam
} = require("../routing");
const {
    select, insert, update, updateSuccess, deleteData
} = require("../sqlQuery");
const { notLocalAdminError } = require("./groupMembers");


// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

// Route (3) as a function. Add the specified topic to the group if the current
// user is a local admin. If the topic is successfully added, call
// successCallback.
const addTopic = (
    localAdmin, res,
    gid, topic, description,
    successCallback
) =>
    !localAdmin ? // Only add topic if current user is local admin
        notLocalAdminError(res) :
    insert(
        "TOPICS", "gid, topic, description", [gid, topic, description ?? ""],
        (err, result) =>
            err ?
                ( // Insertion failed
                    err.code === "ER_DUP_ENTRY" ? // Topic already exists
                        clientError(res, "That topic already exists.") :
                    dbError(res, err)
                ) :
            successCallback()
    );

// 404 for topic not being in the group. Sets Bad-Param header to "topic".
const topicNotInGroup = res => {
    res.set("Bad-Param", "topic")
    notFoundError(res, "That topic does not exist.");
}

/**
 * @swagger
 * components:
 *     schemas:
 *          Topic:
 *              type: object
 *              required: [topic]
 *              properties:
 *                  topic:
 *                      type: string
 *                      description: The topic's name
 *                  description:
 *                      type: string
 *                      description: The topics long-form description
 *              example:
 *                  topic: General
 *                  description: ""
 */


// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve topic name and (if the Desc header is provided and specifies
//     true) description for all topics if the user is a group member.
//
// URI: http://localhost:3001/groups/{gid}/topics
/**
 * @swagger
 * /groups/{gid}/topics:
 *      get:
 *          summary: Retrieve topic name and (if the Desc header is provided and specifies true) description for all topics.
 *          tags: [Topics]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: header
 *                name: Desc
 *                description: Whether to include the topic descriptions in the results
 *                schema:
 *                      type: boolean
 *          responses:
 *              200:
 *                  description: Group topics retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Topic'
 *              400:
 *                  description: The Desc header was included but was not a boolean.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Bad Request'
 *              401:
 *                  description: Unauthorized. Not logged in.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              404:
 *                  description: Not Found. The group does not exist, or you are not a member.
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
router.get('/', (req, res) => {
    // If the optional Desc header is included, require it to be a boolean.
    // If Desc is included and is true, return topic name and description
    let desc = false;
    const descStr = req.get("Desc");
    if (paramGiven(descStr)) {
        if (!isBool(descStr))
            return clientError(res,
                "If the Desc header is included, it must be a boolean."
            );
        
        desc = convertToBool(descStr); // Parse header value
    }

    // Return all topics in group
    select(
        "TOPICS", desc ? "topic, description" : "topic",
        "gid", req.params.gid,
        (err, result) => err ? dbError(res, err) : getSuccess(res, result)
    );
});

// ----------------------------------------------------------------------------
// (2) Retrieve topic name and description for the given topic if the user is a
//     group member.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}:
 *      get:
 *          summary: Retrieve topic name and description for the given topic if the user is a group member.
 *          tags: [Topics]
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
 *                  description: Topic retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Topic'
 *              401:
 *                  description: Unauthorized. Not logged in.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              404:
 *                  description: Not Found. The group does not exist, or you are not a member, or the specified topic is not in the group.
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
router.get('/:topic', (req, res) =>
    select(
        "TOPICS", "topic, description",
        ["gid", "topic"], [req.params.gid, req.params.topic],
        (err, result) =>
            err ?
                dbError(res, err) :
            result.length === 0 ? // No row matched topic and gid
                topicNotInGroup(res) :
            getSuccess(res, result[0])
    )
);

// ----------------------------------------------------------------------------
// (3) Create the specified topic. Only a local admin can do this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}:
 *      post:
 *          summary: Create the specified topic. Only a local admin can do this.
 *          tags: [Topics]
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
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              description:
 *                                  type: string 
 *                                  description: The description for the new topic.
 *                          example:
 *                              description: Marketing discussions
 *          responses:
 *              201:
 *                  description: Topic created.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Created'
 *              400:
 *                  description: The topic name is already in use.
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
router.post('/:topic', (req, res) => addTopic(
    req.localAdmin, res, req.params.gid, req.params.topic, req.body.description,
        () => createSuccess(res, "Topic created.")
));

// ----------------------------------------------------------------------------
// (4) Update the topic's name and/or description. Only a local admin can do
//     this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}:
 *      put:
 *          summary: Update the topic's name and/or description. Only a local admin can do this.
 *          tags: [Topics]
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
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              topic:
 *                                  type: string 
 *                                  description: The new name for the topic.
 *                              description:
 *                                  type: string 
 *                                  description: The new description for the topic.
 *                          example:
 *                              topic: Sales
 *          responses:
 *              200:
 *                  description: Specified values are now used, even if the same values as before were specified.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              400:
 *                  description: The body provided no values to update, or the topic name is in use. See the error message.
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
 *                  description: Not Found. The group does not exist, or you are not a member, or the specified topic does not exist.
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
router.put('/:topic', (req, res) => {
    // Ensure current user is local admin
    if (!req.localAdmin) return notLocalAdminError(res);

    if (requireSomeBodyParam(req, res, "topic", "description")) return;

    const values = {}; // The columns to update, and their new values

    // Add topic name if given
    if (paramGiven(req.body.topic)) {
        if (!validTopicNameLength(res, req.body.topic)) return;

        values.topic = req.body.topic;
    }

    // Add description if given
    if (paramGiven(req.body.description)) {
        if (!validDescriptionLength(res, req.body.description)) return;

        values.description = req.body.description;
    }

    update(
        "TOPICS", values, ["gid", "topic"], [req.params.gid, req.params.topic],
        (err, result) =>
            err ?
                (err.code === "ER_DUP_ENTRY" ?
                    clientError(res, "Topic name is already in use.") :
                dbError(res, err)) :
            result.affectedRows === 0 ? // No row matched gid and topic
                topicNotInGroup(res) :
            updateSuccess(res, result) // Updated
    )
});

// ----------------------------------------------------------------------------
// (5) Remove the specified topic from the group, deleting the topic's events
//     and messages. Only local admins can do this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}:
 *      delete:
 *          summary: Remove the specified topic from the group, deleting the topic's events and messages. Only local admins can do this.
 *          tags: [Topics]
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
 *                  description: Topic removed from group. All associated messages and events are also deleted.
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
 *                  description: Not Found. The group does not exist, or you are not a member, or the specified topic is not in the group.
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
router.delete('/:topic', (req, res) =>
    !req.localAdmin ? // Don't allow delete from non-admin
        notLocalAdminError(res) :
    deleteData(
        "TOPICS",
        ["gid", "topic"], [req.params.gid, req.params.topic],
        (err, result) =>
            err ?
                dbError(res, err) :
            result.affectedRows === 0 ? // Topic not found
                topicNotInGroup(res) :
            success200(res, "Topic successfully deleted.")
    )
);


module.exports = { router, addTopic };

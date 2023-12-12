// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Service: /groups/{gid}/log
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router({ mergeParams: true });

// Utilities
const {
    getSuccess, createSuccess,
    dbError, requireBodyParams,
} = require("../routing");
const { insert, selectOrderBy } = require("../sqlQuery");
const { notLocalAdminError } = require("./groupMembers");
const { validDescriptionLength } = require("../lengths");


// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

/**
 * @swagger
 * components:
 *     schemas:
 *          Log Point:
 *              type: object
 *              required: [time, description]
 *              properties:
 *                  time:
 *                      type: string
 *                      description: The ISO 8601 date and time the log point was created
 *                  description:
 *                      type: string
 *                      description: The description of the log point
 *              example:
 *                  time: 2023-12-09T17:27:56.000Z
 *                  description: First group meeting.
 */


// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve all log points from this group's log. Only group members can do
//     this. This shows a history of points deemed important by local admins,
//     and this history can only be read from and appended to, never shortened.
//
// URI: http://localhost:3001/groups/{gid}/log
/**
 * @swagger
 * /groups/{gid}/log:
 *      get:
 *          summary: Retrieve all log points from this group's log. Only group members can do this.
 *          tags: [Group Log]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *          responses:
 *              200:
 *                  description: Group log retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Log Point'
 *                  headers:
 *                      Translation-Fail:
 *                          description: If present, indicates the translation failed, and the untranslated messages were returned.
 *                          schema:
 *                              type: boolean
 *                              example: true
 *              400:
 *                  description: The Translate header was included but was not a boolean.
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
router.get('/', (req, res) => selectOrderBy(
    "GROUP_LOGS", "time, description",
    "gid", req.params.gid,
    "time", // Order by time ascending (earliest log points top, latest bottom)
    (err, result) => err ? dbError(res, err) : getSuccess(res, result)
));

// ----------------------------------------------------------------------------
// (2) Add a log point. These points cannot be changed or deleted once added.
//     Only local admins can do this.
//
// URI: http://localhost:3001/groups/{gid}/log
/**
 * @swagger
 * /groups/{gid}/log:
 *      post:
 *          summary: Add a log point. These points cannot be changed or deleted once added. Only local admins can do this.
 *          tags: [Group Log]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required: [description]
 *                          properties:
 *                              description:
 *                                  type: string 
 *                                  description: The description for the new log point.
 *                          example:
 *                              description: Initial launch of WeSchedule.
 *          responses:
 *              201:
 *                  description: Log point added.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Created'
 *              400:
 *                  description: The body does not include description, or description is too long.
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
router.post('/', (req, res) => {
    if (!req.localAdmin) // Can only send messages if have this permission
        return notLocalAdminError(res);

    if (requireBodyParams(req, res, "description")) return;

    if (!validDescriptionLength(res, req.body.description)) return; // Max message length

    // Send new message in this topic as the current user
    insert(
        "GROUP_LOGS", "gid, time, description",
        [req.params.gid, new Date(), req.body.description],
        // There should not be foreign key failures here because group
        // membership has already been validated. But the user may need to
        // refresh the page if the group has been deleted.
        (err, result) => err ? dbError(res, err) : createSuccess(res, "Log point added.")
    );
});


module.exports = router;

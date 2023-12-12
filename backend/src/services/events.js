// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Service: /groups/{gid}/topics/{topic}/events
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router({ mergeParams: true });

// Utilities
const {
    paramGiven, requireSomeBodyParam, requireBodyParams,
    getSuccess, createSuccess, success200,
    clientError, dbError, unauthorizedError, notFoundError, requireHeaders
} = require("../routing");
const {
    insert, update, updateSuccess, deleteData, selectOrderByGOrE
} = require("../sqlQuery");
const { validEventNameLength, validDescriptionLength } = require("../lengths");

// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

// 404 for event not existing at this time. Sets Bad-Param header to "time".
const noEvent = res => {
    res.set("Bad-Param", "time")
    notFoundError(res, "There is no event at this time in this topic.");
}

/**
 * @swagger
 * components:
 *     schemas:
 *          Event:
 *              type: object
 *              required: [time, name, description, duration]
 *              properties:
 *                  time:
 *                      type: string
 *                      description: The ISO 8601 date and time the event is scheduled to start
 *                  name:
 *                      type: string
 *                      description: The event's name
 *                  description:
 *                      type: string
 *                      description: The event's long-form description
 *                  duration:
 *                      type: integer
 *                      description: The number of minutes the event lasts
 *              example:
 *                  time: 2023-12-09T17:27:56.000Z
 *                  name: Weekly Meeting
 *                  description: Reviewing our progress and planning for next week
 *                  duration: 30
 */


// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve the time, duration, name, and description for all events in the
//     topic after the given date and time.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/events
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/events:
 *      get:
 *          summary: Retrieve the time, duration, name, and description for all events in the topic.
 *          tags: [Events]
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
 *              - in: header
 *                name: After
 *                description: The ISO 8601 datetime for the earliest time to show events for
 *                schema:
 *                      type: string
 *                      example: 2023-12-01T09:00:00.000Z
 *                required: true
 *          responses:
 *              200:
 *                  description: Topic events retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Event'
 *              400:
 *                  description: The After header is missing or invalid.
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
router.get('/', (req, res) => {
    if (requireHeaders(req, res, "After")) return;

    // Validate earliest time
    const time = new Date(req.get("After"));
    if (Number.isNaN(time.valueOf()))
        return clientError(res, "After must be a valid ISO 8601 date value.");

    selectOrderByGOrE(
        "EVENTS", ["time, name, description, duration"],
        ["gid", "topic"], [req.params.gid, req.params.topic],
        "time", // Order by time ascending
        "time", time, // Only retrieve events at or after the given datetime
        (err, result) => err ? dbError(res, err) : getSuccess(res, result)
    )
});

// ----------------------------------------------------------------------------
// (2) Add the event with the specified name, start time, duration, and
//     description to the topic. Only topic members with event creation
//     permission can do this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/events/{time}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/events/{time}:
 *      post:
 *          summary: Add the event with the specified name, start time, duration, and description to the topic. Only Events with event creation permission can do this.
 *          tags: [Events]
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
 *                name: time
 *                description: The ISO 8601 date and time the event is scheduled to start
 *                schema:
 *                      type: string
 *                      example: 2023-12-12T17:00:00.000Z
 *                required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required: [event, duration]
 *                          properties:
 *                              event:
 *                                  type: string
 *                                  description: The name of the new event
 *                              description:
 *                                  type: string
 *                                  description: The event's long-form description
 *                              duration:
 *                                  type: integer
 *                                  description: The number of minutes the event lasts
 *                          example:
 *                              event: Weekly Meeting
 *                              duration: 30
 *          responses:
 *              201:
 *                  description: Event created.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Created'
 *              400:
 *                  description: The user or topic does not exist, an event already exists at this time, or the start time or duration or description or name is invalid.
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
 *                  description: Not Found. The group or topic does not exist, or you are not a member.
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
router.post('/:time', (req, res) => {
    if (!req.event_perm) // Can only add event if have this permission
        return unauthorizedError(res, "You do not have permission to create events.");

    if (requireBodyParams(req, res, "event", "duration")) return;

    // Validate name
    if (!validEventNameLength(res, req.body.event)) return; // Max name length

    // Validate start time
    const time = new Date(req.params.time);
    if (Number.isNaN(time.valueOf()))
        return clientError(res, "time must be a valid ISO 8601 date value.");

    // Validate duration
    const duration = +req.body.duration;
    if (Number.isNaN(duration) || duration < 0)
        return clientError(res, "duration must be a nonnegative integer.");

    // If description given, check length and add.
    let description = "";
    if (paramGiven(req.body.description)) {
        if (!validDescriptionLength(res, req.body.description)) return;

        description = req.body.description;
    }

    // Create the event
    insert(
        "EVENTS", "gid, topic, time, name, description, duration",
        [req.params.gid, req.params.topic, time, req.body.event, description, duration],
        (err, result) =>
            err ?
                (
                    err.code === "ER_DUP_ENTRY" ? // Event already at this time
                        clientError(res, "There is already an event at this time in this topic.") :
                    dbError(res, err)
                ) :
            createSuccess(res, "Event created.")
    );
});

// ----------------------------------------------------------------------------
// (3) Update the time, name, description, and/or duration of the event. Only
//     topic members with event creation permission can do this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/events/{time}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/events/{time}:
 *      put:
 *          summary: Update the time, name, description, and/or duration of the event. Only topic members with event creation permission can do this.
 *          tags: [Events]
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
 *                name: time
 *                description: The target event's start time
 *                schema:
 *                      type: string
 *                      example: 2023-12-12T17:00:00.000Z
 *                required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              event:
 *                                  type: string
 *                                  description: The new name for the event
 *                              time:
 *                                  type: string
 *                                  description: The ISO 8601 date and time the event is scheduled to start
 *                              description:
 *                                  type: string
 *                                  description: The event's long-form description
 *                              duration:
 *                                  type: integer
 *                                  description: The number of minutes the event lasts
 *                          example:
 *                              time: 2023-12-09T16:27:56.000Z
 *                              duration: 60
 *          responses:
 *              200:
 *                  description: Specified values are now used, even if the same values as before were specified.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              400:
 *                  description: The body provided no values to update, or one of the specified values is invalid. See the error message.
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
 *                  description: Not Found. The group or topic or event does not exist, or the specified event/topic is not in the topic/group.
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
router.put('/:time', (req, res) => {
    if (!req.event_perm) // Can only edit event if have this permission
        return unauthorizedError(res, "You do not have permission to edit events.");

    if (requireSomeBodyParam(req, res, "event", "time", "description", "duration")) return;

    // Validate old start time
    const oldTime = new Date(req.params.time);
    if (Number.isNaN(oldTime.valueOf()))
        return clientError(res, "time in URL must be a valid ISO 8601 date value.");


    const values = {}; // The columns to update, and their new values

    // Validate name
    if (paramGiven(req.body.event)) {
        if (!validEventNameLength(res, req.body.event)) return; // Max name length

        values.name = req.body.event;
    }

    // Validate start time
    if (paramGiven(req.body.time)) {
        const time = new Date(req.body.time);
        if (Number.isNaN(time.valueOf()))
            return clientError(res, "time in body must be a valid ISO 8601 date value.");

        values.time = time;
    }

    // Validate duration
    if (paramGiven(req.body.duration)) {
        const duration = +req.body.duration;
        if (Number.isNaN(duration) || duration < 0)
            return clientError(res, "duration must be a nonnegative integer.");

        values.duration = duration;
    }

    // If description given, check length and add.
    if (paramGiven(req.body.description)) {
        if (!validDescriptionLength(res, req.body.description)) return;

        values.description = req.body.description;
    }

    update(
        "EVENTS", values,
        ["gid", "topic", "time"],
        [req.params.gid, req.params.topic, oldTime],
        (err, result) =>
            err ?
                (
                    err.code === "ER_DUP_ENTRY" ? // Event already at this time
                        clientError(res, "There is already an event at this time in this topic.") :
                    dbError(res, err)
                ) :
            result.affectedRows === 0 ? // No row matched gid, topic, and time
                noEvent(res) :
            updateSuccess(res, result) // Updated
    )
});

// ----------------------------------------------------------------------------
// (4) Delete the specified event. Only local admins can do this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/events/{time}
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/events/{time}:
 *      delete:
 *          summary: Delete the specified event. Only local admins can do this.
 *          tags: [Events]
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
 *                name: time
 *                description: The target event's start time
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: Event deleted.
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
 *                  description: Not Found. The group or topic or event does not exist, or you are not a group member.
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
router.delete('/:time', (req, res) => {
    if (!req.event_perm) // Can only delete event if have this permission
        return unauthorizedError(res, "You do not have permission to delete events.");

    // Validate start time
    const time = new Date(req.params.time)
    if (Number.isNaN(time.valueOf()))
        return clientError(res, "time must be a valid ISO 8601 date value.");

    deleteData(
        "EVENTS",
        ["gid", "topic", "time"],
        [req.params.gid, req.params.topic, time],
        (err, result) =>
            err ?
                dbError(res, err) :
            result.affectedRows === 0 ? // Event not found
                noEvent(res) :
            success200(res, "Event deleted.")
    )
});


module.exports = router;

// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Service: /groups/{gid}/topics/{topic}/messages
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router({ mergeParams: true });

const { validDescriptionLength } = require("../lengths");
// Utilities
const {
    paramGiven, isBool, convertToBool,
    getSuccess, createSuccess,
    clientError, dbError, unauthorizedError, requireBodyParams,
} = require("../routing");
const { insert, selectOrderBy } = require("../sqlQuery");
const { translate } = require("./language");
const { getUser } = require("./users");


// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

/**
 * @swagger
 * components:
 *     schemas:
 *          Message:
 *              type: object
 *              required: [username, text]
 *              properties:
 *                  time:
 *                      type: string
 *                      description: The ISO 8601 date and time the message was logged
 *                  username:
 *                      type: string
 *                      description: The sender's username
 *                  text:
 *                      type: string
 *                      description: The message content
 *              example:
 *                  time: 2023-12-09T17:27:56.000Z
 *                  username: merefish
 *                  text: Hi everyone!
 */


// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve all messages sent in the topic. This can only be done by topic
//     members. If the Translate header is given as true, all messages are
//     translated to the user's preferred language before being returned.
//     If translation fails, the Translation-Fail header will be sent.
//     In the future, this will allow pagination for responsiveness in long
//     chats.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/messages
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/messages:
 *      get:
 *          summary: (Composition 2) Retrieve all messages sent in the topic. This can only be done by topic members. If the Translate header is given as true, all messages are translated before being returned. If translation fails, the Translation-Fail header will be sent. COMPOSITION - If translation is enabled, retrieve the topic's messages as part of this service, call the users service WS-2 to get the current user's preferred language, pass the messages and the language to the language service WS-10 for translation, and return the translated messages to the client.
 *          tags: [Messages]
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
 *                name: Translate
 *                description: Whether to translate all the messages to the users preferred language
 *                schema:
 *                      type: boolean
 *          responses:
 *              200:
 *                  description: Topic messages retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Message'
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
router.get('/', (req, res) => {
    // If the optional Translate header is included, require it to be a
    // boolean. If Translate is included and is true, translate messages.
    let translateMessages = false;
    const translateStr = req.get("Translate");
    if (paramGiven(translateStr)) {
        if (!isBool(translateStr))
            return clientError(res,
                "If the Translate header is included, it must be a boolean."
            );
        
        translateMessages = convertToBool(translateStr); // Parse header value
    }

    // Return all messages in topic. In the future, this should be paginated to
    // support active long-term chats.
    selectOrderBy(
        "MESSAGES", "time, username, text",
        ["gid", "topic"], [req.params.gid, req.params.topic],
        "time", // Order by time ascending (earliest messages top, latest bottom)
        (err, result) => {
            if (err)
                return dbError(res, err);

            // COMPOSITION
            // If translation is enabled, get the user's preferred language,
            // attempt translate all messages, and return the result.
            if (translateMessages && result.length !== 0)
                // Call users WS-2 to get language preference
                return getUser(null, req, res, ({ lang }) =>
                    translate(
                        res, result.map(row => row.text), lang,
                        () => {// Messages could not be translated. Return untranslated messages
                            res.setHeader("Translation-Fail", true); // Indicate translation failure
                            getSuccess(res, result);
                        }, translations => { // Success, replace text in response data
                            result.forEach((row, i) => row.text = translations[i]);
                            getSuccess(res, result);
                        }
                    )
                );
            
            return getSuccess(res, result); // Translation not requested. Return messages
        }
    );
});

// ----------------------------------------------------------------------------
// (2) Send a message. Only topic members with the messaging permissions can do
//     this.
//
// URI: http://localhost:3001/groups/{gid}/topics/{topic}/messages
/**
 * @swagger
 * /groups/{gid}/topics/{topic}/messages:
 *      post:
 *          summary: Send a message. Only topic members with the messaging permissions can do this.
 *          tags: [Messages]
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
 *                          required: [text]
 *                          properties:
 *                              text:
 *                                  type: string 
 *                                  description: The content of the message.
 *                          example:
 *                              text: Hi! Happy to be here!
 *          responses:
 *              201:
 *                  description: Message sent.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Created'
 *              400:
 *                  description: The body does not include text.
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
router.post('/', (req, res) => {
    if (!req.message_perm) // Can only send messages if have this permission
        return unauthorizedError(res, "You do not have permission to send messages.");

    if (requireBodyParams(req, res, "text")) return;

    if (!validDescriptionLength(res, req.body.text)) return; // Max message length

    // Send new message in this topic as the current user
    insert(
        "MESSAGES", "gid, topic, time, username, text",
        [req.params.gid, req.params.topic, new Date(), req.session.user, req.body.text],
        // There should not be foreign key failures here because the group and
        // topic membership have already been validated. But the user may need
        // to refresh the page if the group/topic has been deleted/modified.
        (err, result) => err ? dbError(res, err) : createSuccess(res, "Message sent.")
    );
});


module.exports = router;

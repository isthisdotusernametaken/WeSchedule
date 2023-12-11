// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Service: /groups
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router();

// Database access
const {
    select, selectJoin, toBool, insert, update, deleteData, updateSuccess
} = require("../sqlQuery");

// Utilities
const {
    paramGiven, requireSomeBodyParam,
    success200, getSuccess, createSuccess,
    dbError, requireBodyParams, clientError, notExistsOrNoAccess
} = require("../routing");
const { validGroupNameLength } = require("../lengths");
const { addGroupMember } = require("./groupMembers");
const { addTopic } = require("./topics");


// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

/**
 * @swagger
 * components:
 *     schemas:
 *          Group:
 *              type: object
 *              required: [name, owner_username, creation_time]
 *              properties:
 *                  gid:
 *                      type: integer
 *                      description: The group's ID
 *                  name:
 *                      type: string
 *                      description: The group's name
 *                  owner_username:
 *                      type: string
 *                      description: The group's owner's username
 *                  creation_time:
 *                      type: string
 *                      description: The date and time the group was created
 *                  joined_time:
 *                      type: string
 *                      description: The date and time the user joined the group
 *                  local_admin:
 *                      type: string
 *                      description: Whether the user is an admin in the group
 *              example:
 *                  gid: 1
 *                  name: Company A
 *                  owner_username: bobsAccount
 *                  creation_time: 2023-12-09T17:27:56.000Z
 *                  joined_time: 2023-12-09T17:27:56.000Z
 *                  local_admin: false
 */


// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve all groups the current user is a member of (or all groups for
//     global admins). This includes groups the user owns.
//
// URI: http://localhost:3001/groups
/**
 * @swagger
 * /groups:
 *      get:
 *          summary: Retrieve all groups the current user is a member of (or all groups for global admins). This includes groups the user owns.
 *          tags: [Groups]
 *          responses:
 *              200:
 *                  description: Group data retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Group'
 *              401:
 *                  description: Unauthorized. Not logged in.
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
router.get('/', (req, res) =>  req.session.admin ?
    select( // If global admin, simply get group data
        "GROUPS G", "gid, name, owner_username, creation_time", null, null,
        (err, result) => err ?
            dbError(res, err) : getSuccess(res, result)
    ) :
    selectJoin(
        "GROUP_MEMBERS GM, GROUPS G",
        "G.gid, G.name, owner_username, creation_time, joined_time, local_admin",
        "username", req.session.user, "G.gid = GM.gid", (err, result) => err ?
            dbError(res, err) : getSuccess(res, toBool(result, "local_admin"))
    )
);

// ----------------------------------------------------------------------------
// (2) Create a new group owned by the current user and labeled with the
//     provided name.
//
// URI: http://localhost:3001/groups
/**
 * @swagger
 * /groups:
 *      post:
 *          summary: (Composition 1) Create a new group owned by the current user and labeled with the provided name. COMPOSITION - After making the group, call the group member service to add the owner as a member and call the topic service to make a General topic, which allows the topic member service to be called to add the owner as a topic member).
 *          tags: [Groups]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required: [name]
 *                          properties:
 *                              name:
 *                                  type: string 
 *                                  description: The name for the new group. This does not need to be unique
 *                          example:
 *                              name: Company A
 *          responses:
 *              201:
 *                  description: Group created.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Created'
 *              400:
 *                  description: The body is missing name.
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
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.post('/', (req, res) => {
    if (requireBodyParams(req, res, "name"))
        return;

    insert(
        "GROUPS", "name, owner_username, creation_time",
        [req.body.name, req.session.user, new Date()], (err, result) => {
            if (err)
                return dbError(res, err);
            
            // Add owner as member of new group (call WS-4)
            addGroupMember(
                true, req, res, result.insertId, req.session.user, true,
                // Add General topic (call WS-5)
                () => addTopic(
                    true, res, result.insertId, "General", "", () =>
                    // Add owner as member of General topic (call WS-6)
                    createSuccess(res, "Group created.")
                ) 
            )
        }
    );
});

// ----------------------------------------------------------------------------
// (3) Retrieve the specified group's name, owner, and creation time. The
//     current user must be a group member or a global admin for this
//     operation.
//
// URI: http://localhost:3001/groups/{gid}
/**
 * @swagger
 * /groups/{gid}:
 *      get:
 *          summary: Retrieve the specified group's name, owner, and creation time. The current user must be a group member or a global admin for this operation.
 *          tags: [Groups]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *          responses:
 *              200:
 *                  description: Group data retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Group'
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
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.get('/:gid', (req, res) => req.session.admin ?
    select( // If global admin, simply get group data
        "GROUPS G", "name, owner_username, creation_time",
        "gid", req.params.gid, (err, result) => {
            if (err)
                return dbError(res, err);
            
            if (result.length === 0) // No row matched gid
                return notExistsOrNoAccess(req, res, "Group");
            
            getSuccess(res, result[0])
        }
    ) :
    selectJoin( // If not global admin, only return data if member
        "GROUP_MEMBERS GM, GROUPS G",
        "G.name, owner_username, creation_time, joined_time, local_admin",
        "username", req.session.user,
        `G.gid = GM.gid AND G.gid = ${req.params.gid}`, (err, result) => {
            if (err)
                return dbError(res, err);
            
            if (result.length === 0) // Bad gid or not a member
                return notExistsOrNoAccess(req, res, "Group");
            
            getSuccess(res, toBool(result, "local_admin")[0])
        }
    )
);

// ----------------------------------------------------------------------------
// (4) Update the name and/or owner of the specified group. Only the group
//     owner or a global admin can perform this operation.
//     This allows the transfer of group ownership.
//
// URI: http://localhost:3001/groups/{gid}
/**
 * @swagger
 * /groups/{gid}:
 *      put:
 *          summary: Update the name and/or owner of the specified group. Only the group owner or a global admin can perform this operation. This allows the transfer of group ownership.
 *          tags: [Groups]
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
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: The new display name for the group
 *                              owner:
 *                                  type: string
 *                                  description: The new group owner's username
 *                          example:
 *                              name: Company B (formerly Company A)
 *          responses:
 *              200:
 *                  description: Specified values are now used, even if the same values as before were specified.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              400:
 *                  description: The body provided no values to update, the new display name is too long, or the specified owner username does not exist. See the error message.
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
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.put('/:gid', (req, res) => {
    if (requireSomeBodyParam(req, res, "name", "owner")) return;

    const values = {}; // The columns to update, and their new values

    // Add group name if given
    if (paramGiven(req.body.name)) {
        if (!validGroupNameLength(res, req.body.name)) return;

        values.name = req.body.name;
    }

    // Add new owner username if given
    if (paramGiven(req.body.owner))
        values.owner_username = req.body.owner;

    // Update the specified values if the group exists and the current user is
    // the owner (or is a global admin).
    update(
        "GROUPS", values,
        req.session.admin ? "gid" : ["gid", "owner_username"],
        req.session.admin ? req.params.gid : [req.params.gid, req.session.user],
        (err, result) => {
            if (err) {
                if (err.code === "ER_NO_REFERENCED_ROW_2")
                    return clientError(res, "That user does not exist.");
                return dbError(res, err);
            }

            if (result.affectedRows === 0) // No record matched both gid and owner
                return notExistsOrNoAccess(req, res, "Group");
            
            updateSuccess(res, result); // Updated
        }
    );
});

// ----------------------------------------------------------------------------
// (5) Delete a group, including all the information associated with it. This
//     can only be done by the group's owner or a global admin.
//
// URI: http://localhost:3001/groups/{gid}
/**
 * @swagger
 * /groups/{gid}:
 *      delete:
 *          summary: Delete a group, including all the information associated with it. This can only be done by the group's owner or a global admin.
 *          tags: [Groups]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *          responses:
 *              200:
 *                  description: All of the group's data is deleted.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
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
 *              500:
 *                  description: Internal server error.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Server Error'
 */
router.delete('/:gid', (req, res) => {
    // Delete the group if the group exists and the current user is the owner
    // (or is a global admin).
    deleteData(
        "GROUPS",
        req.session.admin ? "gid" : ["gid", "owner_username"],
        req.session.admin ? req.params.gid : [req.params.gid, req.session.user],
        (err, result) => {
            if (err)
                return dbError(res, err);

            if (result.affectedRows === 0) // No record matched both gid and owner
                return notExistsOrNoAccess(req, res, "Group");

            return success200(res, "Group succesfully deleted.");
        }
    );
});

module.exports = router;

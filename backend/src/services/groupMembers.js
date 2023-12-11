// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Service: /groups/{gid}/users
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router({ mergeParams: true });

// Utilities
const {
    requireBodyParams, isBool, convertToBool,
    getSuccess, createSuccess, success200,
    notFoundError, notExistsOrNoAccess, unauthorizedError, clientError, dbError
} = require("../routing");
const {
    select, insert, update, updateSuccess, deleteData, toBool
} = require("../sqlQuery");


// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

// Route (1) as a function. Retireve basic info for all group members if the
// current user is an admin or a group member.
// On success, call successCallback with the result set.
const getGroupMembers = (req, res, successCallback) => select(
    "GROUP_MEMBERS", "username, joined_time, local_admin",
    "gid", req.params.gid,
    (err, result) => err ?
        dbError(res, err) :
        result.length === 0 ? // No matches for gid
            noGroupAccessRevealing(req, res) :
            !(req.session.admin || // Hide result if not global admin or member
              result.some(row => req.session.user === row.username)) ?
                noGroupAccessRevealing(req, res) :
                successCallback(result) // Results exist and are allowed
);

// If the specified user is a member of the specified group (or if forceAllow
// is true), call successCallback with the member's local admin status.
const ifGroupMember = (forceAllow, res, group, user, successCallback) =>
    forceAllow ?
        successCallback(true) :
        select(
            "GROUP_MEMBERS", "local_admin", ["gid", "username"], [group, user],
            (err, result) => err ?
                dbError(res, err) :
                result.length === 0 ? // Invalid group or member
                    noGroupAccess(res) :
                    successCallback(!!result[0].local_admin) // Valid member, continue
        );

// Route (3) as a function. Add the specified user to the group if the current
// user is a local admin. If the user is successfully added, call
// successCallback.
const addGroupMember = (
    forceAllow, req, res,
    gid, username, local_admin,
    successCallback
) => ifGroupMember(forceAllow, res, gid, req.session.user, currentIsLocalAdmin =>
    !currentIsLocalAdmin ? // Only add member if current user is local admin
        notLocalAdminError(res) :
        insert(
            "GROUP_MEMBERS", "gid, username, joined_time, local_admin",
            [gid, username, new Date(), local_admin],
            (err, result) => err ?
                ( // Insertion failed
                    err.code === "ER_NO_REFERENCED_ROW_2" ? // User doesn't exist
                        clientError(res, "That user does not exist.") :
                    err.code === "ER_DUP_ENTRY" ? // User is already member
                        clientError(res, "That user is already a member.") :
                    dbError(res, err)
                ) :
                successCallback()
        )
);

// 401 for lacking group owner privileges.
const notOwnerError = res =>
    unauthorizedError(res, "Only the group owner may perform this operation.");

// 401 for lacking local admin privileges.
const notLocalAdminError = res =>
    unauthorizedError(res, "Only local admins may perform this operation.");

// 404 for user either not existing or not being in the group. Sets Bad-Param
// header to "username".
const userNotInGroup = res => {
    res.set("Bad-Param", "username")
    notFoundError(res, "That user does not exist or is not in this group.");
}

// 404 for group not existing or not being allowed to be accessed. Sets the
// Bad-Param header to "gid". If req is not null, global admins will see the
// group does not exist (rather than simply being inaccessible).
const noGroupAccessRevealing = (req, res) => {
    res.set("Bad-Param", "gid");
    notExistsOrNoAccess(req, res, "Group");
}

// 404 to indicate this group does not exist or cannot be accessed. Sets the
// Bad-Param header to "gid".
const noGroupAccess = res => noGroupAccessRevealing(null, res);

/**
 * @swagger
 * components:
 *     schemas:
 *          Group Member:
 *              type: object
 *              required: [joined_time, local_admin]
 *              properties:
 *                  username:
 *                      type: string
 *                      description: The group's name
 *                  joined_time:
 *                      type: string
 *                      description: The date and time the user joined the group
 *                  local_admin:
 *                      type: string
 *                      description: Whether the user is an admin in the group
 *              example:
 *                  username: merefish
 *                  joined_time: 2023-12-09T17:27:56.000Z
 *                  local_admin: false
 */

// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve the username, date of joining the group, and local admin status
//     for all users in the group. Only global admins and group members may do
//     this.
//
// URI: http://localhost:3001/groups/{gid}/users
/**
 * @swagger
 * /groups/{gid}/users:
 *      get:
 *          summary: Retrieve the username, date of joining the group, and local admin status for all users in the group. Only global admins and group members may do this.
 *          tags: [Group Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *          responses:
 *              200:
 *                  description: Group membership data retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Group Member'
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
router.get('/', (req, res) =>
    getGroupMembers(req, res, result => getSuccess(res, toBool(result, "local_admin"))));

// ----------------------------------------------------------------------------
// (2) Retrieve the date of joining the group and local admin status for the
//     specified user in the group. Only global admins and group members may
//     do this.
//
// URI: http://localhost:3001/groups/{gid}/users/{username}
/**
 * @swagger
 * /groups/{gid}/users/{username}:
 *      get:
 *          summary: Retrieve the date of joining the group and local admin status for the specified user in the group. Only global admins and group members may do this.
 *          tags: [Group Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: path
 *                name: username
 *                description: The target user's username
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: Group membership data retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Group Member'
 *              401:
 *                  description: Unauthorized. Not logged in.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Unauthorized'
 *              404:
 *                  description: Not Found. The group does not exist, or you are not a member, or the specified user is not in the specified group.
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
router.get('/:username', (req, res) =>
    // After determining that the user can access membership information, check
    // whether the specified user is in the group.
    getGroupMembers(req, res, result => { // To reduce queries, ifMember is not used first
        const user = result.find(row => req.params.username === row.username);
        if (user == undefined)
            return userNotInGroup(res);

        // Return the user's membership information (join date and local admin)
        delete user.username; // The username is already known if this is called
        user.local_admin = !!user.local_admin;
        getSuccess(res, user);
    })
);

// ----------------------------------------------------------------------------
// (3) Add the user with the specified username to the group. Only local admins
//     may do this. The new user is not a local admin; an additional put
//     operation is required to set this status so that new users are not
//     accidentally made admins.
//
// URI: http://localhost:3001/groups/{gid}/users/{username}
/**
 * @swagger
 * /groups/{gid}/users/{username}:
 *      post:
 *          summary: Add the user with the specified username to the group. Only local admins may do this. The new user is not a local admin; an additional put operation is required to set this status so that new users are not accidentally made admins.
 *          tags: [Group Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: path
 *                name: username
 *                description: The target user's username
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              201:
 *                  description: Group member added.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Created'
 *              400:
 *                  description: The user does not exist or is already a member.
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
router.post('/:username', (req, res) => addGroupMember(
    false, req, res, req.params.gid, req.params.username, false, () =>
        createSuccess(res, "User added to group.")
));

// ----------------------------------------------------------------------------
// (4) Update the user's local admin status. Only the group owner can do this.
//
// URI: http://localhost:3001/groups/{gid}/users/{username}
/**
 * @swagger
 * /groups/{gid}/users/{username}:
 *      put:
 *          summary: Update the user's local admin status. Only the group owner can do this.
 *          tags: [Group Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
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
 *                          required: local_admin
 *                          properties:
 *                              local_admin:
 *                                  type: boolean
 *                                  description: Whether the user should be an admin within the group
 *                          example:
 *                              local_admin: true
 *          responses:
 *              200:
 *                  description: Specified values are now used, even if the same values as before were specified.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Success'
 *              400:
 *                  description: The body is missing local_admin, local_admin is not a boolean, or the specified user is the group owner (the owner's admins status cannot be changed). See the error message.
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
 *                  description: Not Found. The group does not exist, or you are not a member, or the specified user is not in the group.
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
    if (requireBodyParams(req, res, "local_admin")) return;

    if (!isBool(req.body.local_admin)) // Require boolean for new admin status
        return clientError(res, "local_admin must be a boolean.")
    const local_admin = convertToBool(req.body.local_admin);

    // Ensure the current user can see this group (is a member)
    ifGroupMember(false, res, req.params.gid, req.session.user, _ =>
        select( // Ensure current user is owner. Group known to exist now
            "GROUPS", "owner_username", "gid", req.params.gid,
            (err, result) => {
                if (err)
                    return dbError(res, err);

                if (result[0].owner_username !== req.session.user) // User is not owner
                    return notOwnerError(res);
                
                if (req.session.user === req.params.username) // Owner tries to demote self
                    return clientError(res,
                        "The owner's admin privileges cannot be changed."
                    );
                
                // Attempt to update privileges
                update(
                    "GROUP_MEMBERS", { local_admin: local_admin },
                    ["gid", "username"], [req.params.gid, req.params.username],
                    (err2, result2) => err2 ?
                        dbError(res, err2) :
                        result2.affectedRows === 0 ? // No row matched gid and username
                            userNotInGroup(res) :
                            updateSuccess(res, result2) // Updated
                )
            }
        )
    );
});

// ----------------------------------------------------------------------------
// (5) Remove the specified user from the group. Only local admins (or the
//     current user for themself) can do this.
//
// URI: http://localhost:3001/groups/{gid}/users/{username}
/**
 * @swagger
 * /groups/{gid}/users/{username}:
 *      delete:
 *          summary: Remove the specified user from the group. Only local admins can do this.
 *          tags: [Group Members]
 *          parameters:
 *              - in: path
 *                name: gid
 *                description: The target group's ID
 *                schema:
 *                      type: integer
 *                required: true
 *              - in: path
 *                name: username
 *                description: The target user's username
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: User removed from group and all topics. Their messages are not deleted.
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
 *                  description: Not Found. The group does not exist, or you are not a member, or the specified user is not in the group.
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
    ifGroupMember(false, res, req.params.gid, req.session.user, currentIsLocalAdmin =>
        (!currentIsLocalAdmin && req.session.user !== req.body.username) ?
            notLocalAdminError(res) : // Non-admin can only remove self
            deleteData(
                "GROUP_MEMBERS",
                ["gid", "username"], [req.params.gid, req.params.username],
                (err, result) => {
                    if (err)
                        return dbError(res, err);
        
                    if (result.affectedRows === 0)
                        return userNotInGroup(res);
        
                    return success200(res, "User successfully removed.");
                }
            )
    )
);


module.exports = { router, ifGroupMember, addGroupMember, notLocalAdminError };

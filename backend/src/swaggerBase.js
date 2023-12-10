// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// Swagger Categories and Schemas
//
// Author: Joshua Barbee
// ----------------------------------------------

/**
 * @swagger
 * tags:
 *      name: Authentication
 *      description: Creating, logging into, and logging out of accounts.
 */
/**
 * @swagger
 * tags:
 *      name: Users
 *      description: Retrieving and modifying account data.
 */
/**
 * @swagger
 * tags:
 *      name: Groups
 *      description: Creating, accessing, modifying, and deleting groups.
 */
/**
 * @swagger
 * tags:
 *      name: Group Members
 *      description: Adding/removing group members and modifying member permissions.
 */
/**
 * @swagger
 * tags:
 *      name: Topics
 *      description: Creating, accessing, modifying, and deleting topics in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Messages
 *      description: Creating, accessing, modifying, and deleting messages within a topic in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Language
 *      description: Accessing the list of language supported by the application and translated text between them.
 */
/**
 * @swagger
 * tags:
 *      name: Events
 *      description: Creating, accessing, modifying, and deleting events within a topic in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Group Log
 *      description: Creating, accessing, and deleting logged history points in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Group Statistics
 *      description: Generating statistics that describe the group and possibly storing the current statistics as a logged history point.
 */

/**
 * @swagger
 * components:
 *     schemas:
 *          Success:
 *              type: object
 *              required:
 *                  - success
 *              properties:
 *                  success:
 *                      type: string
 *                      description: A message describing what operation was succesfully completed. The actually message can usually be ignored if all that must be known is whether the operation succeded with a 2xx status.
 *              example:
 *                  success: X succesfully created/updated.
 *          Bad Request:
 *              type: object
 *              required:
 *                  - error
 *              properties:
 *                  error:
 *                      type: string
 *                      description: A description of what part of your request was invalid.
  *              example:
 *                  error: The "X" property is required in the body.
 *          Unauthorized:
 *              type: object
 *              required:
 *                  - error
 *              properties:
 *                  error:
 *                      type: string
 *                      description: A description of what authorization check the request failed.
 *              example:
 *                  error: Invalid session. You must log in with /auth/login or /auth/signup.
 *          Server Error:
 *              type: object
 *              required:
 *                  - error
 *              properties:
 *                  error:
 *                      type: string
 *                      description: A short message indicating the server has encountered an unexpected error and failed to fulfill the request.
 *              example:
 *                  error: Server error. Please report to admin.
 */
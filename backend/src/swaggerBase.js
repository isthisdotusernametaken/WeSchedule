// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Application
// Swagger Categories and Schemas
//
// Author: Joshua Barbee
// ----------------------------------------------

/**
 * @swagger
 * tags:
 *      name: Authentication
 *      description: WS-1 (Has External Service 1) - Creating, logging into, and logging out of accounts.
 */
/**
 * @swagger
 * tags:
 *      name: Users
 *      description: WS-2 - Retrieving and modifying account data.
 */
/**
 * @swagger
 * tags:
 *      name: Groups
 *      description: WS-3 (Has Composition 1) - Creating, accessing, modifying, and deleting groups.
 */
/**
 * @swagger
 * tags:
 *      name: Group Members
 *      description: WS-4 - Adding/removing group members and modifying member permissions.
 */
/**
 * @swagger
 * tags:
 *      name: Topics
 *      description: WS-5 - Creating, accessing, modifying, and deleting topics in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Topic Members
 *      description: WS-6 - Creating, accessing, modifying, and deleting topics in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Messages
 *      description: WS-7 (Has Composition 2) - Creating, accessing, modifying, and deleting messages within a topic in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Events
 *      description: WS-8 - Creating, accessing, modifying, and deleting events within a topic in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Group Log
 *      description: WS-9 - Creating, accessing, and deleting logged history points in a group.
 */
/**
 * @swagger
 * tags:
 *      name: Language
 *      description: WS-10 (Has External Service 2) - Accessing the list of language supported by the application and translated text between them.
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          Success:
 *              type: object
 *              required:
 *                  - success
 *              properties:
 *                  success:
 *                      type: string
 *                      description: A message describing what operation was succesfully completed. The actual message can usually be ignored if all that must be known is whether the operation succeded with a 2xx status.
 *              example:
 *                  success: X succesfully updated/deleted.
 *          Created:
 *              type: object
 *              required:
 *                  - success
 *              properties:
 *                  success:
 *                      type: string
 *                      description: A brief message describing what was created. The actual message can usually be ignored if all that must be known is whether the operation succeded with a 2xx status.
 *              example:
 *                  success: X succesfully updated/deleted.
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
 *          Not Found:
 *              type: object
 *              required:
 *                  - error
 *              properties:
 *                  error:
 *                      type: string
 *                      description: A message stating that the resource could not be found.
 *              example:
 *                  error: The group does not exist, or you are not a member.
 *          Server Error:
 *              type: object
 *              required:
 *                  - error
 *              properties:
 *                  error:
 *                      type: string
 *                      description: A short message indicating the server has encountered an unexpected error and failed to fulfill the request.
 *              example:
 *                  error: Server error. Please report to global admin.
 */

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
 *      name: User
 *      description: Creating, logging into, retrieving, and modifying accounts.
 */
/**
 * @swagger
 * tags:
 *      name: Group
 *      description: Creating, accessing, modifying, and deleting groups.
 */
/**
 * @swagger
 * tags:
 *      name: Messaging
 *      description: Creating, accessing, modifying, and deleting messages within a topic in a group.
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
 *      name: Language
 *      description: Accessing the list of language supported by the application and translated text between them.
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

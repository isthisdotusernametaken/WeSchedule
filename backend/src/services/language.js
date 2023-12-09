// ----------------------------------------------
// TCSS 460: Autumn 2023
// Backend REST Service Module
// Service: /language
//
// By existing as a distinct service, the
// translation tool used for message translation
// can be incorporated by third-party frontends
// for other purposes related to facilitating
// multilingual WeSchedule groups.
//
// Author: Joshua Barbee
// ----------------------------------------------

// Create router for routes in this service
const router = require("express").Router();

// Axios for making external requests
const axios = require("axios");

// Utilities
const {
    requireHeaders, getSuccess, serverErrorNoLog, clientError, serverError
} = require("../routing");

// External URLs
const languagesUrl = "https://api.cognitive.microsofttranslator.com/languages";
const translateUrl = "https://api.cognitive.microsofttranslator.com/translate";

// Load access key from secure file
const azureKey = require("../../config/azureKey.json").key;


// ----------------------------------------------------------------------------
// (A)  Define data and behavior used by routes below.
// ----------------------------------------------------------------------------

// The list of languages accepted by the translation service.
let languages = undefined;

// Attempt to load the list of languages from the external service.
loadLanguages();
async function loadLanguages() {
    try {
        // Get the list of languages from Azure.
        const langs = (await axios.get(languagesUrl, {
            params: { "api-version": "3.0", scope: "translation" }
        })).data.translation;

        // Select only the required properties and prevent modification.
        languages = Object.freeze(Object.fromEntries(Object.entries(langs).map(
            ([code, info]) => [code, info.nativeName]
        )));
    } catch (err) {
        console.error("The list of languages could not be retrieved.");
        console.error(err);

        languages = undefined;
    }
}

// If the language is invalid, set the response information and return false;
// otherwise, return true.
function validLanguage(res, lang) {
    if (languages[lang] === undefined) {
        clientError(res, "Invalid language.");
        return false;
    }

    return true;
}

// Check that the specified langauge is valid, and attempt to translate the
// strings to the specified language.
// On failure, set the response data and return undefined; on success, return
// the translated strings and do not set the response data. 
async function translate(res, strs, lang) {
    if (!validLanguage(res, lang))
        return undefined; // Indicate failure for internal use

    try {
        // Send translation request to external service
        const data = (await axios.post(translateUrl,
            strs.map(str => ({Text: `${str}`})), // Body
            {
                params: { "api-version": "3.0", to: lang },
                headers: { "Ocp-Apim-Subscription-Key": azureKey }
            }
        )).data;

        // Return an array of only the translated strings.
        return data.map(obj => obj.translations[0].text);
    } catch (err) {
        serverError(res, err, "The text could not be translated.");
        return undefined;
    }
};

// ----------------------------------------------------------------------------
// (B)  Define routes.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// (1) Retrieve the list of valid languages.
//
// URI: http://localhost:3001/language/
/**
 * @swagger
 * /language:
 *      post:
 *          summary: Retrieve the list of valid languages.
 *          tags: [Language]
 *          responses:
 *              200:
 *                  description: List retrieved.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              additionalProperties:
 *                                  type: string
 *                                  description: The native name of the language associated with the language code of this property.
 *                              example:
 *                                  en: English
 *                                  es: Español
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
router.get('/', (req, res) => languages ?
    getSuccess(res, languages) :
    serverErrorNoLog(res, "The list of languages is unavailable.")
);

// ----------------------------------------------------------------------------
// (2) Translate the given array of strings to the specified language.
//
// URI: http://localhost:3001/language/translate/
/**
 * @swagger
 * /language/translate/:
 *      post:
 *          summary: Translate the given array of strings to the specified language.
 *          tags: [Language]
 *          parameters:
 *              - in: header
 *                name: destLang
 *                description: The language to translate the text to
 *                schema:
 *                      type: string
 *                required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: string
 *                              description: Some text to translate.
 *                          example:
 *                              ["Some text.", "Some other text."]
 *          responses:
 *              200:
 *                  description: Strings succesfully translated.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  description: Translated text corresponding to the element with the same index in the request body.
 *                              example:
 *                                  ["Algo de texto.", "Algún otro texto."]
 *              400:
 *                  description: The destLang header is missing or invalid, or the body cannot be interpreted as an array of strings. See the error message.
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
router.post('/translate', async (req, res) => {
    if (requireHeaders(req, res, "destLang"))
        return;

    // Require the body to be an array of strings or items that can be
    // unambiguously coereced to strings.
    if (!Array.isArray(req.body) ||
        req.body.some(elem => typeof elem === "object" || elem == null)) {
        return clientError(res, "The body must be a list of strings.");
    }

    // Attempt to translate strings
    const translations = await translate(res, req.body, req.get("destLang"));
    if (translations !== undefined) // Return translated strings on success
        getSuccess(res, translations);
});


// The features of this service are included in the exports so that this
// service can be used internally without HTTP.
// 
// I confirmed with the professor via email on 6 December that internal use
// (without HTTP) of a custom service can count as part of a service
// composition, and this service is composed with the /users service for a
// route in /groups/{group}/topics/{topic}/messages
module.exports = Object.freeze({ router, languages, validLanguage, translate });

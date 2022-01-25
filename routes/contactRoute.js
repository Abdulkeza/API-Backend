import { Router } from "express";

import { auth as verify } from "./verifyToken.js";

import {
  allMessage,
  createMessage,
  messageDetails,
  deleteMessage,
} from "../controllers/contactController.js";

const router = Router();

/**
 * @openapi
 * tags:
 *  name: Contact
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Contact:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - message
 *      properties:
 *        name:
 *          type: string
 *          description: Every message should have a name for sender
 *        email:
 *          type: string
 *          description: Every message should have an email for sender
 *        message:
 *          type: string
 *          description: content should be included to be sent
 *      example:
 *        name: your name
 *        email: me@gmail.com
 *        message: your message
 */

/**
 * @swagger
 * /api/v1/contacts:
 *  get:
 *    summary: This route returns a list of messages
 *    responses:
 *      200:
 *        description: Success
 *      204:
 *        description: No content found
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Contact'
 */

//!!get All messages
router.get("/", allMessage);

/**
 * @swagger
 * /api/v1/contacts/contactUs:
 *  post:
 *    summary: a user can send a question or comment
 *    description: both name, email and message must be filled
 *    tags:
 *      - Contact
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Contact'
 *    responses:
 *      200:
 *        description: Successfully Sent
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Contact'
 *      400:
 *        description: Invalid user input!
 *      500:
 *        description: Internal server error!
 */

//!!Posting new message
router.post("/contactUs", createMessage);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *  get:
 *    summary: This route returns the details of a specfic message
 *    description: The response should be formated in Json object
 *    tags:
 *      - Contact
 *    parameters:
 *      - in: id
 *        name: id
 *        required: true
 *        description: This should be a valid message Id
 *    responses:
 *      200:
 *        description: a Message Found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Contact'
 *      404:
 *        description: Not found!
 *      500:
 *        description: Internal Server Error
 */

//!!get one message
router.get("/:id", messageDetails);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *  delete:
 *    security:
 *      - Token: []
 *    summary: This route Allow user to delete an existing message
 *    description: a Token is required to Delete a message
 *    tags:
 *      - Contact
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: you have to provide a valid message Id
 *        schema:
 *          $ref: '#/components/schemas/Contact'
 *    responses:
 *      200:
 *        description: a message Deleted
 *      204:
 *        description: Message not found
 *      401:
 *        description: Access denied!
 */

//!!Delete a Message
router.delete("/:id", verify, deleteMessage);

export { router };

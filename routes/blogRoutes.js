import { Router } from "express";

import {
  blog_index,
  blog_create_post,
  blog_details,
  blog_delete,
  blogUpdate,
} from "../controllers/BlogController.js";
import { auth as verify } from "./verifyToken.js";

const router = Router();

/**
 * @openapi
 * tags:
 *  name: Blog
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Blog:
 *      type: object
 *      required:
 *        - title
 *        - author
 *        - body
 *      properties:
 *        title:
 *          type: string
 *          description: Every post must have title
 *        author:
 *          type: string
 *          description: This should be the author of post.
 *        body:
 *          type: string
 *          description: This holds the content of the post.
 *      example:
 *        title: My post
 *        author: I am author
 *        body: This is content of my post
 */

/**
 * @swagger
 * /api/v1/blogs:
 *  get:
 *    summary: This route returns a list of all blogs
 *    responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Blog'
 */

router.get("/", blog_index);

/**
 * @swagger
 * /api/v1/blogs:
 *  post:
 *    security:
 *      - Token: []
 *    summary: This route allow a user to create a new blog post
 *    description: A user must have a Token to create a post
 *    tags:
 *      - Blog
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Blog'
 *    responses:
 *      200:
 *        description: Successfully Added
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      400:
 *        description: Invalid user input!
 *      500:
 *        description: Internal server error!
 *      401:
 *        description: Access denied!
 */

// router.get("/add-blog", blog_create_get);

router.post("/", verify, blog_create_post);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *  get:
 *    summary: This route returns the details of a specfic post
 *    description: The response should be formated in Json object
 *    tags:
 *      - Blog
 *    parameters:
 *      - in: id
 *        name: id
 *        required: true
 *        description: This should be a valid post Id
 *    responses:
 *      200:
 *        description: a post Found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      500:
 *        description: Internal Server Error
 *      404:
 *        description: Not found!
 */
router.get("/:id", blog_details);

//!! Update

/**
 * @swagger
 *  /api/v1/blogs/{id}:
 *    put:
 *      security:
 *        - Token: []
 *      summary: This route update an existing blog post
 *      description: a Token is required to update a post
 *      tags:
 *        - Blog
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: you have to provide a valid post Id
 *          schema:
 *            $ref: '#/components/schemas/Blog'
 *      responses:
 *        200:
 *          description: Successfully updated.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Blog'
 *        404:
 *          description: invalid request!
 *        500:
 *          description: Internal server error
 *        401:
 *          description: Access denied!
 */
router.put("/:id", verify, blogUpdate);

//!! Handling DELETE request
/**
 * @swagger
 * /api/v1/blogs/{id}:
 *    delete:
 *      security:
 *        - Token: []
 *      summary: This route Allow user to delete an existing post
 *      description: a Token is required to Delete a post
 *      tags:
 *        - Blog
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: you have to provide a valid post Id
 *          schema:
 *            $ref: '#/components/schemas/Blog'
 *      responses:
 *        200:
 *          description: Delete a post
 *        204:
 *          description: Post not found!
 *        401:
 *          description: Access denied!
 */
router.delete("/:id", verify, blog_delete);

export { router };

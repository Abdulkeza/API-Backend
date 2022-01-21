import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../model/User.js";
import { registerValidation, loginValidation } from "../validation.js";
import { auth as verify } from "./verifyToken.js";

//!!VALIDATION

const router = Router();

/**
 * @openapi
 * tags:
 *  name: User
 *  description: APIs for the user
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        name:
 *          type: string
 *          description: Every user must provide a name
 *        email:
 *          type: string
 *          description: email must be provided
 *        password:
 *          type: string
 *          description: Also provide your password.
 *      example:
 *        name: Me
 *        email: me@gmail.com
 *        password: me123
 */

/**
 * @swagger
 * components:
 *  responses:
 *    UnauthorizedError:
 *      description: Access need Token
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    Token:
 *      type: http
 *      scheme: Bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      LoginInfo:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: an email must be valid
 *              password:
 *                  type: string
 *                  description: password required.
 *          example:
 *            email: u@gmail.com
 *            password: u123
 */

/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *    summary: A user can make registration
 *    description: both name, email and password must be provided
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *
 *    responses:
 *      200:
 *        description: Successfully registered.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      400:
 *        description: Invalid input or Bad formated input
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                code:
 *                  type: number
 */

router.post("/register", async (req, res) => {
  //VALIDATING THE DATA BEFORE USER CREATED
  const { error } = registerValidation(req.body);
  console.log(error, !!error);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  //checking if the user is already in the database
  const emailExist = await User.findOne({
    email: req.body.email,
  });
  if (emailExist)
    return res.status(400).json({ message: "Email already exists." });

  //encrypting password (Hash pswds)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Creating a new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  //!!saving a user to database
  try {
    const savedUser = await user.save();
    // res.send(savedUser);
    res.json({
      user: user._id,
    });
  } catch (error) {
    return res.status(400);
  }
});

//!!LOGIN

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *    summary: A user must sign-in with his/her credentials
 *    description: A user must provide a valid email and password to login
 *    tags:
 *      - User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginInfo'
 *    responses:
 *      200:
 *        description: Logged-in successfully!, keep your Token
 *      400:
 *        description: Invalid userName or password!
 *      404:
 *        description: Email is not found!
 */

router.post("/login", async (req, res) => {
  //Validating data before the user Logged In
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  //checking is the userEmail exist in db
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(404).json({message: "Invalid credentials!"});

  //Checking if password is valid
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({message: "Invalid userName or password"});

  //Create and assign a token to the legged user
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.status(200).json({ "auth-token": token }); // adding token to the header to the user'

  // res.send("\nLogged In!");
});

//UPDATE A USER

/**
 * @swagger
 * /api/v1/user/{id}:
 *  put:
 *    security:
 *      - Token: []
 *    summary: you can update your profile
 *    description: you need a valid Token to update your profile
 *    tags:
 *      - User
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: use a Valid Id
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Successfully updated
 *      500:
 *        description: Internal error!
 */
router.put("/:id", verify, async (req, res) => {
  const id = req.params.id;
  console.log(id);
  // if(!id) return res.status(400).json({message: "User not found!"});

  try {
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ name: req.body.name, email: req.body.email });
    console.log("User updated!");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

export { router };

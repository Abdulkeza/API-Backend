import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../model/User.js";
import { registerValidation, loginValidation } from "../validation.js";

//!!VALIDATION

const router = Router();
// const jwt = jsonwebtoken;

router.post("/register", async (req, res) => {
  //VALIDATING THE DATA BEFORE USER CREATED
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //checking if the user is already in the database
  const emailExist = await User.findOne({
    email: req.body.email,
  });
  if (emailExist) return res.status(400).send("Email already exists.");

  //encrypting password (Hash pswds)
  const salt = await bcrypt.genSalt(10); //this represent the complicity of pswd
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Creating a new User According to userSchema
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    // password: req.body.password,
  });

  //!!saving a user to database
  try {
    const savedUser = await user.save();
    // res.send(savedUser);  //this send back All staff for user like names, email, pswd
    res.json({
      user: user._id,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//!!LOGIN

router.post("/login", async (req, res) => {
  //Validating data before the user Logged In
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //checking is the userEmail exist in db
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("Email is not found!.");

  //Checking if password is valid
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //Create and assign a token to the legged user
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.status(200).json({ "auth-token": token }); // adding token to the header to the user'

  // res.send("\nLogged In!");
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  // console.log(req.body)
  res.json({
    message: "User update",
  });
});

export { router };

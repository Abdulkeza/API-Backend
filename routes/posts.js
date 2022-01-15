import { Router } from "express";
import { User } from "../model/User.js";

import { auth } from "./verifyToken.js"

const router = Router();
const verify =  auth;

router.get("/", verify , (req, res) => {
  res.json({
    post: {
      title: "My first post",
      body: "you only allowed to access me when you have a Token",
    },
  });

  // res.send(req.user);

});

export { router };

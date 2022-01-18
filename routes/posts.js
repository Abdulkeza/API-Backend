import { Router } from "express";
import { User } from "../model/User.js";

import { auth as verify } from "./verifyToken.js"

const router = Router();


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

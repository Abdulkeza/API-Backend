import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import mongoose from "mongoose";

//Import Routes
import { router as authRoute } from "./routes/auth.js";
import { router as postRoute } from "./routes/posts.js";

const app = express();

//connect to DB
const dbURI = process.env.DB_CONNECT;
mongoose.connect(dbURI, () => {
  console.log("Connected to db! ");
});

//!!Middleware
//bellow line used to recognize the incoming Request Object as a JSON Object
app.use(express.json());

//!!Route Middlewares

app.use("/api/user", authRoute); //means everthing in router's file must have "/api/user" as prefix.
app.use("/api/posts", postRoute);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

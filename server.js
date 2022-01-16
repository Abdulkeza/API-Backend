import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import mongoose from "mongoose";

//blog import
import morgan from "morgan";

import {router as blogRoutes} from "./routes/blogRoutes.js";

//Import Routes
import { router as authRoute } from "./routes/auth.js";
import { router as postRoute } from "./routes/posts.js";

const app = express();

//connect to blog db
// const dbUrlBlog =
//   "mongodb+srv://ME:me12@adeoapp.ptq5s.mongodb.net/adeoDb?retryWrites=true&w=majority";
// mongoose
//   .connect(dbUrlBlog, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((result) => {
//     // app.listen(5000, ()=>{console.log(`listenning on 5000`)});

//     console.log("Blog DB connected");
//   })

//connect to DB
const dbURI = process.env.DB_CONNECT;
mongoose.connect(dbURI, () => {
  console.log("Connected to db! ");
});

//!!Middleware
//bellow line used to recognize the incoming Request Object as a JSON Object
app.use(express.json());

//Blog middleware
// !!middleware for every single request && Static files
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//!!Route Middlewares
app.use("/api/user", authRoute); //means everthing in router's file must have "/api/user" as prefix.
app.use("/api/posts", postRoute);

//!!Blog request
//!!Responding to the request
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

//!!About page
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//!! ROUTES (Displaying All blogs)
app.use("/blogs", blogRoutes);

//!!404  page
app.use("/*",(req, res) => {
  res.status(404).json({
    status: 'fail',
    message: "Not found"
  });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

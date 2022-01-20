import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
// import swaggerDocument from "swagger-jsdoc";

import { router as blogRoutes } from "./routes/blogRoutes.js";
//Import Routes
import { router as authRoute } from "./routes/auth.js";
import { swaggerOptions } from "./swagger.js";

dotenv.config();
const app = express();

//connect to DB
const dbURI = process.env.DB_CONNECT;
mongoose.connect(dbURI, () => {
  console.log("Connected to db! ");
});

//!!Middleware
//bellow line used to recognize the incoming Request Object as a JSON Object
app.use(express.json());

//Blog middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//!!Route Middleware
const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/user", authRoute);


app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//!! ROUTES (Displaying All blogs)
app.use("/blogs", blogRoutes);

//!!404  page
app.use("/*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Not found",
  });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

export default app;
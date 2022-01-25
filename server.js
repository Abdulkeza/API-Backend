import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

//!!Router
import { router as blogRoutes } from "./routes/blogRoutes.js";
import { router as authRoute } from "./routes/auth.js";
import { router as contactRoute } from "./routes/contactRoute.js";
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

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//!!Route Middleware
const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/users", authRoute);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/contacts", contactRoute);

app.get("/", (req, res) => {
  return res.redirect("/api-docs");
});

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

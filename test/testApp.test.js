import app from "../server.js";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import Blog from "../model/blog.js";
import { User } from "../model/User.js";

let should = chai.should();

chai.use(chaiHttp);

var Token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWUxMzk5MDkwNTEzOWU0MDIyZTMwODQiLCJpYXQiOjE2NDI2NjkxMDh9.TMAyvdA4x6OD9hjGqDu5FLBddXA0Ua3cviiVtUFYvXg";

describe("blogs", async () => {
  before(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    console.log("Post deleted");
  });

  //Get all blogs
  describe("get a list of blogs ", () => {
    it("It should return a list of blogs", async () => {
      const getAll = await chai.request(app).get("/api/v1/blogs");

      getAll.should.have.status(200);
      getAll.body.should.be.a("object");
      // console.log(res.body);
    });
    //Test the Post route
    describe("POST blog", () => {
      let blog = {
        title: "I am testing",
        snippet: "can i pass",
        body: "Testing ",
      };

      it("It should POST a post with valid fields", async () => {
        const createRequest = await chai
          .request(app)
          .post("/api/v1/blogs")
          .send(blog)
          .set("Authorization", "Bearer " + Token);
        console.log(createRequest.body);
        console.log("we were here");

        createRequest.should.have.status(201);
        createRequest.body.should.be.a("object");
        createRequest.body.should.have.property("title");
        createRequest.body.should.have.property("snippet");
        createRequest.body.should.have.property("body");
      });
    });
  });

  //Get for one post
  describe("GET/:id blog", () => {
    it("it should GET a blog by the given id", async () => {
      let blog = await Blog.create({
        title: "test GET for one blog",
        snippet: "this is me back",
        body: "Lemme check ",
      });

      const onePost = await chai
        .request(app)
        .get("/api/v1/blogs/" + blog.id)
        .send(blog);

      onePost.should.have.status(200);
      onePost.body.should.be.a("object");
    });
  });

  //Test UPDATE
  describe("This will Update an exsting post", async () => {
    it("it should UPDATE a blog by the given id and must be Authorized ", async () => {
      let blog = await Blog.create({
        title: "test PUT for one blog",
        snippet: "this is me back",
        body: "Lemme check ",
      });
      const newPost = await chai
        .request(app)
        .put("/api/v1/blogs/" + blog.id)
        .send({
          title: "This staff is not working!",
          snippet: "This is the last !!!!",
          body: "Lemme check ",
        })
        .set("Authorization", "Bearer " + Token);

      newPost.should.have.status(200);
      newPost.body.should.be.a("object");
    });
  });

  //Test DELETE
  describe("DELETE/:id Blog post", () => {
    it("it should DELETE a blog given the id and must be Authorized", async () => {
      let blog = await Blog.create({
        title: "plz before delete..",
        snippet: "Delete a post",
        body: "lemme se if i can delete",
      });

      const deletePost = await chai
        .request(app)
        .delete("/api/v1/blogs/" + blog._id)
        .set("Authorization", "Bearer " + Token);

      deletePost.should.have.status(200);
      deletePost.body.should.be.a("object");
      deletePost.body.should.have.property("message");
    });
  });
});

//Authentications Test

describe("User Authentication", async () => {
  describe("User", () => {
    before(async () => {
      User.deleteOne({}, (error) => {});
    });
  });

  //register
  describe("POST New user", async () => {
    let newUser = {
      name: "abdul",
      email: "abdul11@gmail.com",
      password: "123@Abudl",
    };

    let userToken = Token;
    it("It should Create a new user with valid inputs", async () => {
      const register = await chai
        .request(app)
        .post("/api/v1/user/register")
        .send(newUser);
      // console.log(register.body);

      register.should.have.status(200);
      register.body.should.be.a("object");
      register.body.should.have.property("user");
    });
  });

  //Login
  describe("/POST Login for registered user", async () => {
    it("It should return a Token for Logged-in user", async () => {
      const login = await chai.request(app).post("/api/v1/user/login").send({
        email: "abdul11@gmail.com",
        password: "123@Abudl"
      });

      console.log(login.body);

      login.should.have.status(200);
      login.body.should.be.a("object");
      login.body.should.have.property("auth-token");
    });
  });
});

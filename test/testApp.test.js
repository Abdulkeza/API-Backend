import app from "../server.js";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import Blog from "../model/blog.js";
import { User } from "../model/User.js";
import { Contact } from "../model/contactUs.js"

let should = chai.should();

chai.use(chaiHttp);

var Token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWVkYzI4OGUwZjFiOTkzOGMzNDBkNWIiLCJpYXQiOjE2NDMxMDQzNTV9.muuNhvpTEUSM4AtZOUVZ-eJBlzirrQwpto1fvwJNP8A";

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
   
    it("It should Create a new user with valid inputs", async () => {
      let newUser = {
        name: "abdul",
        email: "me12@gmail.com",
        password: "123@Abudl",
      };
  
      let userToken = Token;

      const register = await chai
        .request(app)
        .post("/api/v1/users/register")
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
      const login = await chai.request(app).post("/api/v1/users/login").send({
        email: "me12@gmail.com",
        password: "123@Abudl"
      });

      console.log(login.body);

      login.should.have.status(200);
      login.body.should.be.a("object");
      login.body.should.have.property("auth-token");
    });
  });
});


//!!Contact-us test

describe("CONTACT-US", async ()=>{
 //Get all Messages
 describe("get a list of messages ", () => {
  it("It should return a list of messages", async () => {
    const getAll = await chai.request(app).get("/api/v1/contacts");

    getAll.should.have.status(200);
    getAll.body.should.be.a("object");
    // console.log(res.body);
  });
  //Test the Post route
  describe("POST contact", () => {

    it("It should POST a post with valid fields and all is required", async () => {
      
      let contact = {
        name: "me Abdul",
        email: "me1@gmail.com",
        message: "Testing my contact",
      };

      const createRequest = await chai
        .request(app)
        .post("/api/v1/contacts/contactUs")
        .send(contact)
      console.log(createRequest.body);
      // console.log("we were here");

      createRequest.should.have.status(200);
      createRequest.body.should.be.a("object");
      createRequest.body.should.have.property("name");
      createRequest.body.should.have.property("email");
      createRequest.body.should.have.property("message");
    });
  });
});

})
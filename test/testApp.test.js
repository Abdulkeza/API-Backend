import app from "../server.js";
import chai from "chai";
import chaiHttp from "chai-http";
import Blog from "../model/blog.js";

let should = chai.should();

chai.use(chaiHttp);

describe("blogs", () => {
  //Get all blogs
  describe("get a list of blogs ", () => {
    it("It should return a list of blogs", async () => {
      chai
        .request(app)
        .get("/blogs")
        .end((error, res) => {
          res.should.have.status(200);
        });
    });
  });

  //Test the Post route
  describe("/POST blog", () => {
    let blog = {
      title: "I am testing",
      snippet: "can i pass",
      body: "Testing ",
    };

    it("It should POST a post with valid fields", async () => {
      chai
        .request(app)
        .post("/blogs/add-blog")
        .send(blog)
        .end((error, res) => {
          if (error) res.should.have.status(400);

          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Post successfully added");
          res.body.blog.should.have.property("title");
          res.body.blog.should.have.property("snippet");
          res.body.blog.should.have.property("body");
        });
    });
  });

  //Get for one post
  describe("/GET/:id blog", () => {
    it("it should GET a blog by the given id", async () => {
      let blog = new Blog({
        title: "test GET for one blog",
        snippet: "this is me back",
        body: "Lemme check ",
      });
      blog.save((err, blog) => {
        chai
          .request(app)
          .get("/blogs/" + blog.id)
          .send(blog)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
          });
      });
    });
  });

  //Test UPDATE
  describe("/PUT/:id blog", () => {
    it("it should UPDATE a blog by the given id", async () => {
      let blog = new Blog({
        title: "test PUT for one blog",
        snippet: "this is me back",
        body: "Lemme check ",
      });
      blog.save((err, blog) => {
        chai
          .request(app)
          .put("/blogs/" + blog.id)
          .send({
            title: "This staff is not working!",
            snippet: "This is the last !!!!",
            body: "Lemme check ",
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Blog updated");
            res.body.blog.should.have
              .property("title")
              .eql("This staff is not working!");
          });
      });
    });
  });

  //Test DELETE
  describe("/DELETE/:id book", () => {
    it("it should DELETE a blog given the id", async () => {
      let blog = new Blog({
        title: "plz before delete..",
        snippet: "Delete a post",
        body: "lemme se if i can delete",
      });
      blog.save((err, blog) => {
        chai
          .request(app)
          .delete("/blogs/" + blog.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("blog successfully deleted!");
            res.body.result.should.have.property("ok").eql(1);
          });
      });
    });
  });
});

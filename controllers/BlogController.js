import Blog from "../model/blog.js";
import { blogValidation } from "../validation.js";

//blog_index, blog_details, blog_create_get, blog_create_post, blog_delete, blogUpdate, blogDelete

//DISPLAYING ALL BLOGS
export const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      //   res.render("index", { title: "All Blogs", blogs: result });
      res.json({ title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

//DISPLAYING ONE POST
export const blog_details = (req, res) => {
  const id = req.params.id;
  // console.log(id);
  Blog.findById(id) //find a specfic blog by ID
    .then((result) => {
      //   res.render("details", { blog: result, title: "Blog Details" });
      res.json({ title: "Blog Details", blog: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const blog_create_get = (req, res) => {
  //   res.render("add-blog", { title: "Create_new" });
  res.json({ Title: "hey! This is the form to Create new post!" });
};

//CREATING A POST
export const blog_create_post = async (req, res) => {
  const blog = new Blog(req.body); //this is the insitance of Blog ---in blog.js

  //check an empty submission or invalid
  const { error } = blogValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //save  post
  try {
    blog.save().then((result) => {
      res.redirect("/blogs");

      console.log("Hy! new post Added.");
    });
  } catch (error) {
    return res.json({ message: "Make sure all fields are not empty!" });
  }
};

//UPDATE POST
export const blogUpdate = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.json({ message: "missing id" });

  //   let title = req.body.title;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.json(updatedBlog);
  } catch (error) {
    return res.json(error);
  }
};

//DELETE POST
export const blog_delete = (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      if (!result) return res.status(404).json({ message: `post Not found!` });
      else return res.json({ message: "post deleted" }); //typical response to an API
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
};

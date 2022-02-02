import Blog from "../model/blog.js";
import { blogValidation } from "../validation.js";

//blog_index, blog_details, blog_create_get, blog_create_post, blog_delete, blogUpdate, blogDelete

//DISPLAYING ALL BLOGS
export const blog_index = async (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      return res.status(200).json({status: 200, title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
};

//DISPLAYING ONE POST
export const blog_details = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Blog.findById(id);
    if (!result) return res.status(404).json({status: 404, message: "post not found" });
  
    return res.json({ title: "Blog Details", blog: result });
    
  } catch (error) {
    // console.log(error)
    return res.status(500).json({status: 500, message: "Internal server error" });
  }
};

//CREATING A POST
export const blog_create_post = async (req, res) => {
  //check an empty submission or invalid
  const { error } = blogValidation(req.body);
  if (error) return res.status(400).json({status: 400, message: error.details[0].message });

  //save  post
  try {
    const blog = await Blog.create(req.body);
    return res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({status: 500, message: "Internal server error" });
  }
};

//UPDATE POST
export const blogUpdate = async (req, res) => {
  const id = await req.params.id;
  console.log(id.length)

  if(id.length != 24) return res.status(400).json({status: 400, message: "Invalid id detected"})

  try {
  const result = await Blog.findById(id);
  if (!result) return res.status(404).json({status: 404, message: "Post not found" });

  //   let title = req.body.title;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.json(updatedBlog);
  } catch (error) {
    return res.status(500).json({status: 500, message: "Internal server error" });
    
  }
};

//DELETE POST
export const blog_delete = async (req, res) => {
  const id = req.params.id;

  const result = await Blog.findById(id);

  if (!result) return res.status(404).json({status: 404, message: `post Not found!` });

  const postDelete = await result.delete();
  console.log(postDelete)

  if (postDelete) return res.status(200).json({status: 200, message: "post deleted" });

  return res.status(500).json({status: 500, message: "Internal server error!" });
};

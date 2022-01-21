import Blog from "../model/blog.js";
import { blogValidation } from "../validation.js";

//blog_index, blog_details, blog_create_get, blog_create_post, blog_delete, blogUpdate, blogDelete

//DISPLAYING ALL BLOGS
export const blog_index = async (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {

      res.status(200).json({ title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500)
    });
};

//DISPLAYING ONE POST
export const blog_details = async (req, res) => {
  const id = req.params.id;
  if(!id) return res.status(404).json({message: "post not found!"});

  Blog.findById(id) 
    .then((result) => {
      res.json({ title: "Blog Details", blog: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({message: 'Internal server error'})
    });
};


//CREATING A POST
export const blog_create_post = async (req, res) => {
  

  //check an empty submission or invalid
  const { error } = blogValidation(req.body);
  if (error) return res.status(400).json({message: error.details[0].message});

  //save  post
  try {
    const blog = await Blog.create(req.body)
   return res.status(201).json(blog)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Internal server error'})
  }
};

//UPDATE POST
export const blogUpdate = async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(404).json({ message: "missing id" });

  //   let title = req.body.title;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true,});
    return res.json(updatedBlog);
  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
    console.log(error)
  }
};

//DELETE POST
export const blog_delete = (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      if (!result) return res.status(204).json({ message: `post Not found!` });
      else return res.json({ message: "post deleted" });
    })
    .catch((err) => {
      // console.log(err);
      return res.status(500).json({message: "Internal server error!"});
    });
};

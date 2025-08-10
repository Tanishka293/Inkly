const express = require("express");
const jwt = require("jsonwebtoken");
const Blog = require("../models/Blog");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Token Error:", err.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Create blog
router.post("/blogs", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({ title, content, author: req.userId });
    await blog.save();
    res.json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error("Create Blog Error:", err.message);
    res.status(500).json({ message: "Error creating blog" });
  }
});

// Get all blogs
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

// Get single blog by ID
router.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err.message);
    res.status(500).json({ message: "Error fetching blog" });
  }
});

// Add comment to blog
router.post("/blogs/:id/comments", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ text, user: req.userId });
    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id)
      .populate("comments.user", "name");

    res.json({ message: "Comment added", comments: updatedBlog.comments });
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: "Error adding comment" });
  }
});

// Like a blog
router.post("/blogs/:id/like", verifyToken, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const index = blog.likes.indexOf(req.userId);
  if (index === -1) {
    blog.likes.push(req.userId);
  } else {
    blog.likes.splice(index, 1);
  }
  await blog.save();
  res.json({ message: "Blog like updated", likes: blog.likes.length });
});

// Like a comment
router.post("/blogs/:id/comments/:commentId/like", verifyToken, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const comment = blog.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  const index = comment.likes.indexOf(req.userId);
  if (index === -1) {
    comment.likes.push(req.userId);
  } else {
    comment.likes.splice(index, 1);
  }

  await blog.save();
  res.json({ message: "Comment like updated", likes: comment.likes.length });
});

// Reply to a comment
router.post("/blogs/:id/comments/:commentId/reply", verifyToken, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const comment = blog.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  comment.replies.push({ text: req.body.text, user: req.userId });
  await blog.save();
  res.json({ message: "Reply added", replies: comment.replies });
});

// Get blogs of the logged-in user (for MyBlogs.js)
router.get("/blogs/myblogs", verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId }).populate("author", "name email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your blogs" });
  }
});

// Delete a blog (only if user is the author)
router.delete("/blogs/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

// Update blog (only if user is the author)
router.put("/blogs/:id", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();

    res.json({ message: "Blog updated successfully", blog });
  } catch (err) {
    res.status(500).json({ message: "Error updating blog" });
  }
});

module.exports = router;

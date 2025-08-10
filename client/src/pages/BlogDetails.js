import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BlogDetails.css";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`https://inkly-gj74.onrender.com/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://inkly-gj74.onrender.com/blogs/${id}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setBlog({ ...blog, comments: res.data.comments });
      setComment("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding comment");
    }
  };

  const handleBlogLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login to like blogs");
    try {
      const res = await axios.post(
        `https://inkly-gj74.onrender.com/blogs/${blog._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);

      // Refresh blog data
      const updated = await axios.get(`https://inkly-gj74.onrender.com/blogs/${id}`);
      setBlog(updated.data);
    } catch (err) {
      alert("Error liking blog");
    }
  };

  const handleCommentLike = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login to like comments");
    try {
      const res = await axios.post(
        `https://inkly-gj74.onrender.com/blogs/${blog._id}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);

      // Refresh blog data
      const updated = await axios.get(`https://inkly-gj74.onrender.com/blogs/${id}`);
      setBlog(updated.data);
    } catch (err) {
      alert("Error liking comment");
    }
  };

  const handleReply = async (commentId) => {
    const replyText = prompt("Enter your reply:");
    if (!replyText) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Login to reply");
    try {
      await axios.post(
        `https://inkly-gj74.onrender.com/blogs/${blog._id}/comments/${commentId}/reply`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Reply added!");
      
      // Refresh blog data
      const updated = await axios.get(`https://inkly-gj74.onrender.com/blogs/${id}`);
      setBlog(updated.data);
    } catch (err) {
      alert("Error adding reply");
    }
  };

  if (!blog) return <h3 className="text-center mt-5">Loading blog...</h3>;

  return (
  <div className="blog-details-page">
    <div className="blog-details-container">
      
      {/* ✅ Back Button */}
      <button className="back-btn"
        onClick={() => navigate("/home")}
      >
        ← Back to All Blogs
      </button>

      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-content">{blog.content}</p>

      {/* ✅ Blog Like */}
      <button  className="like-btn" onClick={handleBlogLike}>
        👍 Like ({blog.likes?.length || 0})
      </button>

      <p className="text-muted blog-meta">
        By {blog.author?.name || "Unknown"} on{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      <hr />
      <h4 className="comments-title">Comments</h4>
      {blog.comments?.length === 0 && <p>No comments yet</p>}

      <ul className="list-group mb-3 comment-list">
        {blog.comments?.map((c, i) => (
          <li key={i} className="list-group-item comment-item">
            <strong>{c.user?.name || "Anonymous"}:</strong> {c.text}
            <div className="mt-1">
              <button  className="liked-btn"
                onClick={() => handleCommentLike(c._id)}
              >
                👍 {c.likes?.length || 0}
              </button>
              <button className="reply-btn"
                onClick={() => handleReply(c._id)}
              >
                ↩ Reply
              </button>
            </div>

            {c.replies?.length > 0 && (
              <ul className="mt-2 ps-3 replies-list">
                {c.replies.map((r, j) => (
                  <li key={j}>
                    <strong>{r.user?.name || "Anonymous"}:</strong> {r.text}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {localStorage.getItem("token") ? (
        <form onSubmit={handleComment} className="comment-form">
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button className="comment-btn" type="submit" >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-muted">Login to add a comment.</p>
      )}

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  </div>
);

}
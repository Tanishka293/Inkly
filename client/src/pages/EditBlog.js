import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditBlog.css";


export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`https://inkly-gj74.onrender.com/blogs/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        setMessage("Error fetching blog");
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://inkly-gj74.onrender.com/blogs/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      navigate("/my-blogs"); // ✅ Redirect to My Blogs
    } catch (err) {
      setMessage("Error updating blog");
    }
  };

  return (
    <div className="edit-blog-page">
      <h2 className="text-center mb-4">Edit Blog</h2>
      {message && <p className="text-danger text-center">{message}</p>}

      <form onSubmit={handleUpdate} className="edit-blog-form">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Update Blog
        </button>
      </form>
    </div>
);
}
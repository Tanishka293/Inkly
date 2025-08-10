
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/MyBlogs.css";

export default function MyBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://inkly-gj74.onrender.com/my-blogs", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBlogs(res.data);
            } catch (err) {
                setMessage("Error fetching your blogs");
            }
        };
        fetchMyBlogs();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://inkly-gj74.onrender.com/blogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(blogs.filter((blog) => blog._id !== id));
        } catch (err) {
            alert("Error deleting blog");
        }
    };

   return (
    <div className="my-blogs-page">
        <h2 className="my-blogs-title">My Blogs</h2>
        
        {message && <p className="my-blogs-message text-danger">{message}</p>}

        {blogs.length === 0 ? (
            <p className="my-blogs-empty">No blogs found.</p>
        ) : (
            blogs.map((blog) => (
                <div key={blog._id} className="my-blog-card">
                    <h4 className="my-blog-title">{blog.title}</h4>
                    <p className="my-blog-content">{blog.content}</p>
                    <div className="my-blog-actions">
                        <Link to={`/blogs/${blog._id}`} className="btn btn-sm btn-primary me-2">
                            View
                        </Link>
                        <Link to={`/edit-blog/${blog._id}`} className="btn btn-sm btn-warning me-2">
                            Edit
                        </Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(blog._id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))
        )}
    </div>
);

}
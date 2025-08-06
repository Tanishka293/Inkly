import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css"; 

export default function Home() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/blogs");
                setBlogs(res.data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="home-container">
            <div className="home-inner">
                <h1 className="home-title">All Blogs ✍️</h1>

                {blogs.length === 0 ? (
                    <h4 className="no-blogs-text">No blogs available</h4>
                ) : (
                    <div className="blogs-grid">
                        {blogs.map((blog) => (
                            <div className="blog-card" key={blog._id}>
                                <h4 className="blog-title">{blog.title}</h4>
                                <p className="blog-meta">
                                    By {blog.author?.name || "Unknown"} |{" "}
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                                <p className="blog-preview">{blog.content.slice(0, 100)}...</p>
                                <Link to={`/blogs/${blog._id}`} className="read-more-btn">
                                    Read More →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

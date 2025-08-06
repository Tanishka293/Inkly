import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreateBlog.css";

export default function CreateBlog() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/blogs", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(res.data.message);
            setSuccess(true);
            setFormData({ title: "", content: "" });

            // Auto redirect after 2 seconds
            setTimeout(() => navigate("/home"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error creating blog");
            setSuccess(false);
        }
    };

    return (
        <div className="create-blog-page">
            <h2 className="create-blog-title">Create Blog</h2>

            {message && (
                <div className={`alert ${success ? "alert-success" : "alert-danger"}`}>
                    {message}
                </div>
            )}

            {success && (
                <button
                    className="btn btn-success view-blogs-btn"
                    onClick={() => navigate("/home")}
                >
                    View All Blogs
                </button>
            )}

            {!success && (
                <form className="create-blog-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control blog-title-input"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Content</label>
                        <textarea
                            name="content"
                            className="form-control blog-content-input"
                            rows="4"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary submit-blog-btn">
                        Post Blog
                    </button>
                </form>
            )}
        </div>
    );

}

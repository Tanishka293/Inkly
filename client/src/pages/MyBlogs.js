import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://inkly-gj74.onrender.com/blogs/myblogs", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Default archived field to false if it's missing
                const fixedBlogs = res.data.map((blog) => ({
                    ...blog,
                    archived: blog.archived ?? false,
                }));

                // Only show unarchived blogs
                const unarchivedBlogs = fixedBlogs.filter((blog) => !blog.archived);

                setBlogs(unarchivedBlogs);
            } catch (err) {
                alert("Error fetching your blogs");
            }
        };

        fetchMyBlogs();
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://inkly-gj74.onrender.com/blogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        } catch (err) {
            alert("Error deleting blog");
        }
    };

    const handleArchive = async (id, currentArchivedStatus) => {
        try {
            const token = localStorage.getItem("token");
            const endpoint = currentArchivedStatus ? "unarchive" : "archive";

            const res = await axios.put(
                `https://inkly-gj74.onrender.com/blogs/${id}/${endpoint}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedBlog = res.data.blog;

            // Only keep unarchived blogs in the list
            setBlogs((prevBlogs) =>
                prevBlogs
                    .map((blog) =>
                        blog._id === id
                            ? { ...blog, archived: updatedBlog.archived }
                            : blog
                    )
                    .filter((blog) => !blog.archived) // Filter out archived blogs
            );
        } catch (err) {
            alert("Error archiving/unarchiving blog");
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <h2 className="text-3xl font-bold mb-6">My Blogs</h2>
            {blogs.length === 0 ? (
                <p className="text-gray-500">No blogs found.</p>
            ) : (
                blogs.map((blog) => (
                    <div
                        key={blog._id}
                        className="border rounded-lg p-4 mb-4 shadow-md bg-white"
                    >
                        <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                        <p className="text-gray-700 mb-2">{blog.description}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(blog._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(blog._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() =>
                                    handleArchive(blog._id, blog.archived)
                                }
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                                {blog.archived ? "Unarchive" : "Archive"}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyBlogs;

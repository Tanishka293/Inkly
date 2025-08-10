import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await axios.get("https://inkly-gj74.onrender.com/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("User response:", res.data); 
                setUserName(res.data.name || "Guest");
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2">
            <div className="container-fluid d-flex justify-content-between align-items-center">

                {/* Left Side - Logo + Username */}
                <div className="d-flex align-items-center">
                    <Link className="navbar-brand fw-bold" to="/home">
                        ✒️ Inkly
                    </Link>
                    {isLoggedIn && <span className="ms-3 text-light fw-bold">Hi, {userName}</span>}
                </div>

                {/* Right Side - Buttons */}
                <div>
                    {isLoggedIn ? (
                        <>
                            <Link className="btn btn-warning me-2" to="/home">Home</Link>
                            <Link className="btn btn-warning me-2" to="/my-blogs">My Blogs</Link>
                            <Link className="btn btn-warning me-2" to="/create-blog">New Blog</Link>
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                            <Link className="btn btn-outline-light me-2" to="/signup">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
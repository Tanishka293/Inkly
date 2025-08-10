import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css";

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://inkly-gj74.onrender.com/signup", formData);
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error signing up");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                
                <div className="text-center mb-3">
                    <div className="emoji-logo">🖋️ Inkly</div>
                    <h2 className="mt-2">Create an Account</h2>
                </div>

                {message && (
                    <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Full Name"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-gradient w-100">Sign Up</button>
                </form>

                <p className="text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="login-link">Login</Link>
                </p>
            </div>
        </div>
    );
}
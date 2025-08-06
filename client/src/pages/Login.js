import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css"; 

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/login", formData);
            localStorage.setItem("token", res.data.token);
            setMessage("Login successful!");
            setTimeout(() => navigate("/home"), 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error logging in");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                
                <div className="text-center mb-3">
                    <div className="emoji-logo">🖋️ Inkly</div>
                    <h2 className="mt-2">Sign In</h2>
                </div>

                {message && (
                    <div className={`alert ${message.includes("success") || message.includes("Login") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-gradient w-100">Sign In</button>
                </form>

                <p className="text-center mt-3">
                    Don't have an account?{" "}
                    <Link to="/signup" className="login-link">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

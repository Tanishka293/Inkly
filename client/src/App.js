import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";

import MyBlogs from "./pages/MyBlogs";
import Navbar from "./components/Navbar";
import EditBlog from "./pages/EditBlog";
import './App.css';



function Layout({ children }) {
  const location = useLocation();
  const hideNavbarOn = ["/", "/signup", "/login"]; 
  const hideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* ✅ Default page = Signup */}
          <Route path="/" element={<Signup />} /> 
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} /> {/* Blogs page */}
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />

        </Routes>
      </Layout>
    </Router>
  );
}
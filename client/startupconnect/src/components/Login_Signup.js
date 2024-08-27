import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Login_Signup.css";
import Swal from "sweetalert2";
import axios from "axios";
import logo from "../images/logo.png";
import idea from "../images/idea5.png";

const HomePage = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phonenumber: "",
  });
  const textLines = [
    "Experience a way to bring your Startup To life!",
    "Finds Investors and Companies to connect to them!",
    "Find a place to execute your plan with the incubators!",
  ];

  // Separate state for password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showAdminLoginPassword, setShowAdminLoginPassword] = useState(false);

  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const toggleAdminLoginPasswordVisibility = () => {
    setShowAdminLoginPassword(!showAdminLoginPassword);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % textLines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [textLines.length]);

  const handleExperienceNowClick = () => {
    setShowForm(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://startup-connect-dun.vercel.app/user/signup",   //https://startup-connect-dun.vercel.app/
        
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User created: ", response.data);
      Swal.fire({
        title: "Great 🥳!",
        text: "Signed up successfully!",
        icon: "success",
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        location: "",
        phonenumber: "",
      });
      setShowForm(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The password you entered already exists. Also, the password must be at least 8 characters long and contain uppercase, lowercase, and special characters. Please try again!",
      });
      console.error(
        "Failed to create a new user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const [showLoginForm, setLoginForm] = useState(false);
  const [LoginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [showAdminLoginForm, setAdminLoginForm] = useState(false);
  const [adminLoginFormData, setAdminLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleLoginClick = () => {
    setLoginForm(true);
  };

  const handleAdminLoginClick = () => {
    setAdminLoginForm(true);
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange3 = (e) => {
    const { name, value } = e.target;
    setAdminLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        LoginFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("User logged in", response.data.foundUser._id);
      const userId = response.data.foundUser._id;
      setLoginFormData({
        email: "",
        password: "",
      });
      navigate("/", { state: { userId } }); // general-profile
    } catch (error) {
      console.error(
        "Failed to log in:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The email id or the password is incorrect.",
      });
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/user/adminlogin",
        adminLoginFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Admin logged in", response.data.foundAdmin._id);

      const userId = response.data.foundAdmin._id || "admin";
      setAdminLoginFormData({
        email: "",
        password: "",
      });
      navigate("/adminView", { state: { userId } });
    } catch (error) {
      console.error(
        "Failed to log in:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The email id or the password is incorrect.",
      });
    }
  };

  return (
    <div className="homepage-container">
      <div className="content">
        <div className="logo-container">
          <img src={logo} alt="StartupConnect Logo" className="logo" />
          <span className="title">StartupConnect</span>
        </div>
        <div className="text-content">
          <div className="text-wrapper">
            {textLines.map((line, index) => (
              <p
                key={index}
                className={index === textIndex ? "active" : "hidden"}
              >
                {line}
              </p>
            ))}
          </div>
          <div className="nav-buttons">
            <button
              className="experience-now"
              onClick={handleExperienceNowClick}
            >
              Experience Now / Signup
            </button>
            <button className="login" onClick={handleLoginClick}>
              Login as a User
            </button>
            <button className="adminLogin" onClick={handleAdminLoginClick}>
              Login as an Admin
            </button>
          </div>
        </div>
      </div>
      <div className="image-content">
        <img src={idea} alt="Networking Illustration" />
        <div className="image-text">Investing in Tomorrow's Breakthroughs!</div>
      </div>

      {showForm && (
        <div className="formContainer">
          <form onSubmit={handleSubmit} className="signup-form">
            <h2>Sign up</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="password"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location e.g. city, Country"
            />
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <button type="submit">Submit</button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
              }}
            >
              Close
            </button>
          </form>
        </div>
      )}

      {showLoginForm && (
        <div className="formContainer">
          <form onSubmit={handleLoginSubmit} className="login-form">
            <h2>Login</h2>
            <input
              type="email"
              name="email"
              value={LoginFormData.email}
              onChange={handleInputChange2}
              placeholder="email"
              required
            />
            <input
              type={showLoginPassword ? "text" : "password"}
              name="password"
              value={LoginFormData.password}
              onChange={handleInputChange2}
              placeholder="Password"
              required
            />
            <button type="button" onClick={toggleLoginPasswordVisibility}>
              {showLoginPassword ? "Hide" : "Show"} Password
            </button>
            <button type="submit">Login</button>
            <button
              type="button"
              onClick={() => {
                setLoginForm(false);
              }}
            >
              Close
            </button>
          </form>
        </div>
      )}

      {showAdminLoginForm && (
        <div className="formContainer">
          <form onSubmit={handleAdminLoginSubmit} className="login-form">
            <h2>Admin Login</h2>
            <input
              type="email"
              name="email"
              value={adminLoginFormData.email}
              onChange={handleInputChange3}
              placeholder="email"
              required
            />
            <input
              type={showAdminLoginPassword ? "text" : "password"}
              name="password"
              value={adminLoginFormData.password}
              onChange={handleInputChange3} // Ensure password input change is handled
              placeholder="Password"
              required
            />
            <button type="button" onClick={toggleAdminLoginPasswordVisibility}>
              {showAdminLoginPassword ? "Hide" : "Show"} Password
            </button>
            <button type="submit">Login</button>
            <button
              type="button"
              onClick={() => {
                setAdminLoginForm(false);
              }}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;

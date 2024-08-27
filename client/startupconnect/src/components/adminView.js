import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Swal from "sweetalert2";
import "../styling/adminView.css";

const AdminView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    role: "admin",
  });
  const [formData, setFormData] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [check, setCheck] = useState("Admin Profile");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios("http://localhost:3000/user/getAllUsers");
        setUserData(response.data);
      } catch (error) {
        console.log("Error fetching User Data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios("http://localhost:3000/user/getAdmin");
        console.log(response.data);
        setAdminData(response.data.admin);
        console.log(
          "Admin data that is get in useEffect: " +
            response.data.email +
            "---" +
            response.data.password
        );
      } catch (error) {
        console.log("Error fetching Admin Data:", error);
      }
    };
    fetchAdminData();
  }, []);

  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const handleSettings = () => {
    setFormData(true);
  };

  const closeForm = () => {
    setFormData(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("this is adminData: " + adminData.email);
    console.log(adminData.password);
    const payload = {
      email: adminData.email,
      password: adminData.password,
    };
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/user/adminUpdate/${adminData._id}`,
        payload
      );
      console.log("Admin credentials updated successfully!", response.data);
      setFormData(false);
      Swal.fire({
        title: "Great 🥳!",
        text: "Admin Credentials updated successfully!",
        icon: "success",
      });
    } catch (error) {
      console.log("Admin credentials could not be updated", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The password you entered already exists. Also, the password must be at least 8 characters long and contain uppercase, lowercase, and special characters. Please try again!",
      });
    }
  };

  const handleStartupView = async (userId) => {
    try {
      let response = await axios.get(
        `http://localhost:3000/startup/getStartupByUserId/${userId}`
      );
      let data = response.data;
      let id = data._id;
      console.log("@@@@"+check)
      navigate("/startupPage", { state: { id, check } });
    } catch (error) {
      console.log("Error fetching startup data:", error);
    }
  };

  const handleInvestorView = async (userId) => {
    try {
      let response = await axios.get(
        `http://localhost:3000/investor/getInvestorByUserId/${userId}`
      );
      let data = response.data.Investor;
      let id = data._id;
      console.log("@@@@@@"+check)
      navigate("/investorPage", { state: { id: data._id, check } });
    } catch (error) {
      console.log("Error fetching investor data:", error);
    }
  };

  return (
    <div className="admin-container">
      <Navbar check={"Admin Profile"} />
      <div className="side-bar">
        <button type="button" onClick={handleSettings}>
          Settings
        </button>
      </div>
      <div className="user-details">
        <h1 className="userTitle">All registered Users Data</h1>
        {userData.length > 0 ? (
          userData.map((user, index) => (
            <div key={index}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Location: {user.location}</p>
              <p>Phone Number: {user.phonenumber}</p>
              <button type="button" onClick={() => handleStartupView(user._id)}>
                View Startup
              </button>
              <button
                type="button"
                onClick={() => handleInvestorView(user._id)}
              >
                View Investor
              </button>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
      {formData && (
        <div className="form-container">
          <h1>Change Email or Password</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={adminData.email}
              onChange={handleInputChange}
              placeholder="email"
              required
            />

            <input
              type={showLoginPassword ? "text" : "password"} // Toggle between text and password
              name="password"
              value={adminData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
            <button type="button" onClick={toggleLoginPasswordVisibility}>
              {showLoginPassword ? "Hide" : "Show"} Password
            </button>
            <button type="submit">Submit</button>
            <button type="button" onClick={closeForm}>
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminView;

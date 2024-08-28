import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import more from "../images/more.png";
import home from "../images/home.png";
import "../styling/navbar.css";

export default function Navbar(props) {
  const [showMoreBar, setShowMoreBar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userData, setuserData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phonenumber: "",
    role: "user",
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get(
          `http://localhost:3000/user/getSpecificUser/${props.userId}`
        );
        let data = response.data;
        console.log("USER DATA IS:", data);
        setuserData(data);
        setFormData({
          name: data.name,
          email: data.email,
          password: data.password,
          location: data.location,
          phonenumber: data.phonenumber,
          role: data.role
        })
        
        console.log("User fetched in the navbar component successfully!");
      } catch (error) {
        console.error(
          "Error in fetching the user:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [props.userId]);
  const handleBackClick = () => {
    navigate("/", { state: { userId: props.userId } }); // Navigate to the home page
  };
  const handleViewStartupUserProfile = () => {
    navigate("/StartupUserProfile", { state: { userId: props.userId } }); // Navigate to profile page
  };
  const handleViewInvestorUserProfile = () => {
    navigate("/InvestorUserProfile", { state: { userId: props.userId } }); // Navigate to profile page
  };
  const NavigateToLoginSignupPage = () => {
    navigate("/Login_Signup");
  };
  const handleSignUpLogin = () => {
    navigate("/Login_Signup"); // Navigate to profile page
  };
  const handleMoreClick = () => {
    setShowMoreBar(!showMoreBar); // Toggle the bar visibility
  };
  const handleChangeUserInfo = () => {
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
    
    const updatedFields = {};
    // Only add fields to updatedFields if they are different from userData
    for (const key in formData) {
      if (formData[key] !== userData[key]) {
        updatedFields[key] = formData[key];
      }
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/user/updateSignupInfo/${props.userId}`,
        updatedFields
      );
      if (response) {
        console.log("User sign up info updated successfully!");
      }
      Swal.fire({
        title: "Great 🥳!",
        text: "Signed up successfully!",
        icon: "success",
      });
      setShowForm(false);
    } catch (error) {
      console.log("Error updating user: ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Either the email exists or the password you entered already exists. Also, the password must be at least 8 characters long and contain uppercase, lowercase, and special characters. Please try again!!",
      });
    }
  };
  

  return (
    <div className="navbar">
      {props.check !== "Admin Profile" && (
        <>
          {props.check === "Startup Profile" && (
            <div className="centered-title">My Startup Profile</div>
          )}
          {props.check == "Investor Profile" && (
            <div className="centered-title">My Investor Profile</div>
          )}
          {props.check == "Startup Profile1" && (
            <div className="centered-title">Startup User Proile</div>
          )}
          {props.check == "Investor Profile1" && (
            <div className="centered-title">Investor User Proile</div>
          )}

          <div className="iconsContainer">
            <div>
              <img
                className="iconsimage"
                src={home}
                alt="Home"
                onClick={handleBackClick}
              />
              <label>Home</label>
            </div>
            <div>
              <img
                className="iconsimage"
                src={more}
                alt="More"
                onClick={handleMoreClick}
              />
              <label>More</label>
            </div>
            {showMoreBar && (
              <div className="moreBar-navbar">
                <button
                  className="b"
                  onClick={() => {
                    if (!props.userId) {
                      Swal.fire({
                        icon: "warning",
                        title: "Not yet Signed up?",
                        text: "Sign up to register your Startup!",
                      });
                    } else {
                      handleViewStartupUserProfile();
                    }
                  }}
                >
                  Create/View your Startup
                </button>
                <button
                  className="b"
                  onClick={() => {
                    if (!props.userId) {
                      Swal.fire({
                        icon: "warning",
                        title: "Not yet Signed up?",
                        text: "Sign up to register as an Investor!",
                      });
                    } else {
                      handleViewInvestorUserProfile();
                    }
                  }}
                >
                  Create/View your Investor
                </button>
                <button
                  className="b"
                  onClick={() => {
                    if (!props.userId) {
                      Swal.fire({
                        icon: "warning",
                        title: "Not yet Signed up?",
                        text: "Sign up to modify!",
                      });
                    } else {
                      handleChangeUserInfo();
                    }
                  }}
                >
                  Change Signup Information
                </button>
                <button className="b" onClick={handleSignUpLogin}>
                  Sign In / Login
                </button>
                <button
                  className="b"
                  onClick={() => {
                    if (!props.userId) {
                      Swal.fire({
                        icon: "warning",
                        title: "Not yet Signed up?",
                        text: "Sign up to proceed accordingly!",
                      });
                    } else {
                      handleSignUpLogin();
                    }
                  }}
                >
                  Logout
                </button>

                {showForm && (
        <div className="formContainer">
          <form onSubmit={handleSubmit} className="signup-form">
            <h2>Update Info</h2>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              placeholder="Email"
            />
           <label>Password (If you want to change your password, enter a new one in plain text. Otherwise, leave this field as is; the old password is stored securely in hashed form.)</label>
           <input
  type={showLoginPassword ? "text" : "password"}
  name="password"
  value={formData.password || ""}  // Keep it empty by default
  onChange={handleInputChange}
  placeholder="Enter new password (Leave blank to keep existing)"
/>

<button
  type="button"
  onClick={toggleLoginPasswordVisibility}
>
  {showLoginPassword ? "Hide" : "Show"} Password
</button>

            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              placeholder="Location"
            />
            <label>Phone Number</label>
            <input
              type="number"
              name="phonenumber"
              value={formData.phonenumber || ""}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <button type="submit">Update</button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </form>
        </div>
      )}
              </div>
            )}
          </div>
        </>
      )}
      {props.check === "Admin Profile" && (
        <>
          <div className="admin-greeting">Hi Aminah 👋🏻!</div>
          <div className="centered-title">Admin Portal</div>
          <button
            className="logout-button"
            type="button"
            onClick={NavigateToLoginSignupPage}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

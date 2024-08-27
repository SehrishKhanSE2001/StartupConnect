import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styling/investorUserProfile.css";
import Swal from "sweetalert2";

import Navbar from "../components/navbar";

import investor from "../images/investment.png";

import camera from "../images/camera.png";
import axios from "axios";

const InvestorUserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  const [investorFormData, setInvestorFormData] = useState({
    investorName: "",
    logo: "",
    investorType: "",
    summaryOfInvestment: [],
    totalInvestmentsMade: 0,
    totalAmountInvested: 0,
    totalReturns: 0,
    startupsApproached: [],
    recentActivity: "",
    receiveMessage: "",
    user: userId,
  });
  const [investorId, setInvestorId] = useState(0);
  const [showInvestorFormData, setShowInvestorFormData] = useState(false);
  const [showinvestorDetails, setInvestorDetails] = useState(false);
  const [startups, setStartups] = useState([]); // Initialize as an empty array
  const [showMoreBar, setShowMoreBar] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState("");
  const [amount, setAmount] = useState("");
  const [startupsApproached, setstartupsApproached] = useState([]);

  useEffect(() => {
    console.log("This is the useEffect that fetches all the startups");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://startup-connect-backend.vercel.app/startup/getAllStartups`
        );
        const data = response.data;
        setStartups(data); // Directly set the data as an array
      } catch (error) {
        console.log("Error fetching the startups data", error);
      }
    };
    fetchData();
  }, []); // Add an empty dependency array to run this effect only once

  useEffect(() => {
    console.log("Hello from useEffect");
    console.log("useEffect triggered with userId:", userId);
    console.log("useEffect triggered with investorId:", investorId);

    const fetchData = async () => {
      console.log("Fetching data for userId:", userId);
      try {
        const response = await axios.get(
          `https://startup-connect-backend.vercel.app/investor/getInvestorByUserId/${userId}`
        );
        const data = response.data.Investor;
        console.log("Fetched data:", data);
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" + data._id);
        setInvestorId(data._id);

        setInvestorFormData({
          investorName: data.investorName || "",
          logo: data.logo || "",
          investorType: data.investorType || "",
          summaryOfInvestment: data.summaryOfInvestment || [],
          totalInvestmentsMade: data.totalInvestmentsMade || 0,
          totalAmountInvested: data.totalAmountInvested || 0,
          totalReturns: data.totalReturns || 0,
          startupsApproached: data.startupsApproached || [],
          recentActivity: data.recentActivity || "",
          receiveMessage: data.receiveMessage || "",
          user: data.user || "",
        });

        setstartupsApproached(data.startupsApproached);
      } catch (error) {
        console.error("Error fetching investor data:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, investorId]); //userId, investorId

  const handleHomeClick = () => {
    navigate("/home", { state: { userId, investorId } });
  };

  const handleMoreClick = () => {
    setShowMoreBar(!showMoreBar); // Toggle the bar visibility
  };

  const handleViewProfile = (id) => {
    navigate("/startupPage", {
      state: { id: id, userId, investorId: investorId },
    }); // Navigate to profile page
  };

  const handleNavigate = (startupId) => {
    navigate("/startupPage", {
      state: {
        id: startupId,
        userId,
       // check: "InvestorUserProfile",
        investorId: investorFormData._id,
      },
    });
  };

  const handleOnClick = () => {
    setShowInvestorFormData(true);
  };

  const ViewInvestorDetails = () => {
    setInvestorDetails(true);
    console.log("{{" + showinvestorDetails);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvestorFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleStartupChange = (e) => {
    const value = e.target.value;
    setSelectedStartup(value);
  };

  const handleAddStartup = () => {
    if (
      selectedStartup &&
      !investorFormData.summaryOfInvestment.some(
        (item) => item.startupsId === selectedStartup
      )
    ) {
      setInvestorFormData((prevFormData) => ({
        ...prevFormData,
        summaryOfInvestment: [
          ...prevFormData.summaryOfInvestment,
          { startupsId: selectedStartup },
        ],
      }));
      setSelectedStartup("");
    }
  };

  const handleRemoveStartup = (startupToRemove) => {
    setInvestorFormData((prevFormData) => ({
      ...prevFormData,
      summaryOfInvestment: prevFormData.summaryOfInvestment.filter(
        (startup) => startup.selectedStartup !== startupToRemove.selectedStartup
      ),
    }));
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this investor?")) {
      try {
        await axios.delete(
          `https://startup-connect-backend.vercel.app/investor/deleteInvestor/${investorId}`
        );
        {
          Swal.fire({
            title: "Deleted!",
            text: "Investor Deleted!",
            icon: "success",
          });
        }
      } catch (error) {
        console.log("Error deleting investor");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while deleting the investor. Please try again!",
        });
      }
    }
  };

  const handleAddLogo = () => {
    const logoInput = document.getElementById("logoUpload");
    logoInput.click();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    console.log("this is e.target.files[0] : " + file);
    if (file) {
      const confirmed = window.confirm(
        "Are you sure you want to add this logo?"
      );
      if (confirmed) {
        const formData = new FormData();
        formData.append("logo", file);
        formData.append("user", userId);

        try {
          let response;
          if (investorId) {
            response = await axios.put(
              `https://startup-connect-backend.vercel.app/investor/updateInvestor/${investorId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } else {
            response = await axios.post(
              "https://startup-connect-backend.vercel.app/investor/addInvestor",
              formData
            );

            // Save the ID of the newly created investor
            setInvestorId(response.data._id);
          }

          // Update the logo with the path returned by the server
          setInvestorFormData((prevFormData) => ({
            ...prevFormData,
            logo: response.data.logo, // Assuming the server returns the logo path in the response
          }));

          {
            Swal.fire({
              title: "Great 🥳!",
              text: "Logo added successfully!",
              icon: "success",
            });
          }
        } catch (error) {
          console.error("Error updating logo:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while adding logo. Please try again!",
          });
        }
      }
    }
  };

  const closeForm = () => {
    setShowInvestorFormData(false);
  };
  const closeDetailsForm = () => {
    setInvestorDetails(false);
  };

  const handleStartupApproachedChanged = (startupId) => {
    console.log("you are in handleStartupApproached function");

    setstartupsApproached((prev = []) => {
      console.log("this is prev: ", prev);

      const updatedStartups = prev.map((startup) => {
        if (startup._id === startupId) {
          return { ...startup, status: "Contacted" };
        }
        return startup;
      });

      // Add the startup to the array if it doesn't exist
      if (!updatedStartups.find((startup) => startup._id === startupId)) {
        updatedStartups.push({ _id: startupId, status: "Contacted" });
      }

      // Update the investorFormData state
      setInvestorFormData((prevFormData) => ({
        ...prevFormData,
        startupsApproached: updatedStartups,
      }));
    });
  };

  const updateStartupsApproached = async () => {
    console.log("you are in updateStartupsApproached function");
    console.log("startupsApproached:" + startupsApproached);
    const payload = {
      investorName: investorFormData.investorName,
      logo: investorFormData.logo,
      investorType: investorFormData.investorType,
      summaryOfInvestment: investorFormData.summaryOfInvestment,
      totalInvestmentsMade: investorFormData.totalInvestmentsMade,
      totalAmountInvested: investorFormData.totalAmountInvested,
      totalReturns: investorFormData.totalReturns,
      startupsApproached: investorFormData.startupsApproached,
      recentActivity: investorFormData.recentActivity,
      receiveMessage: investorFormData.receiveMessage,
      user: userId,
    };
    try {
      const response = await axios.put(
        `https://startup-connect-backend.vercel.app/investor/updateInvestor/${investorId}`,
        payload
      );
      Swal.fire({
        title: "Good job!",
        text: "Contact List updated 🥳!",
        icon: "success",
      });
    } catch (error) {
      console.log(
        "error while updating startupsApproached status to approached",
        error
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while updating. Please try again!",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      investorName: investorFormData.investorName,
      logo: investorFormData.logo,
      investorType: investorFormData.investorType,
      summaryOfInvestment: investorFormData.summaryOfInvestment,
      totalInvestmentsMade: investorFormData.totalInvestmentsMade,
      totalAmountInvested: investorFormData.totalAmountInvested,
      totalReturns: investorFormData.totalReturns,
      startupsApproached: investorFormData.startupsApproached,
      recentActivity: investorFormData.recentActivity,
      receiveMessage: investorFormData.receiveMessage,
      user: userId,
    };

    console.log("Payload:", JSON.stringify(payload, null, 2));
    try {
      let response;
      if (investorId) {
        console.log("Updating existing investorId:", investorId);
        response = await axios.put(
          `https://startup-connect-backend.vercel.app/investor/updateInvestor/${investorId}`,
          payload
        );
      } else {
        console.log("Registering new investor");
        response = await axios.post(
          "https://startup-connect-backend.vercel.app/investor/addInvestor",
          payload
        );
        console.log("++++++++++++++++++++++++++++++++++++++" + response.data);
        setInvestorId(response.data._id); // Save the ID of the newly created investor

        // Wait for the state update to be processed
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      console.log("Response:", response.data);
      {
        Swal.fire({
          title: "Great 🥳!",
          text: "Investor Information Updated Successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error details:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("General Error:", error.message);
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while submitting the form . Please re-check the details added and try again!",
      });
    }
  };

  return (
    <div className="investorUserProfile-container">
      <Navbar userId={userId} check={"Investor Profile"} />

      <div className="investor-inner-container">
        <div className="investorLogo" style={{ backgroundColor: "white" }}>
          <img
            src={camera}
            alt="Upload Logo"
            onClick={handleAddLogo}
            style={{
              width: "30px",
              height: "30px",
              position: "absolute",
              top: "300px",
              left: "20%",
              transform: "translateX(-50%)",
              cursor: "pointer",
              zIndex: 1,
            }}
          />

          <img
            src={
              investorFormData.logo
                ? `https://startup-connect-backend.vercel.app/${investorFormData.logo}`
                : ""
            }
            alt="Investor Logo"
          />
          <input
            type="file"
            id="logoUpload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>

        <div className="investorButtons-row">
          <div className="actions">
            <div className="actions-investorButtons">
              <button className="investorButton" onClick={handleOnClick}>
                <div className="image">
                  <img src={investor} alt="Startup" width="20" />
                </div>
                <span>Add/Edit Your Investor Details</span>
              </button>
              <button className="investorButton" onClick={ViewInvestorDetails}>
                <div className="image">
                  <img src={investor} alt="Startup" width="20" />
                </div>
                <span>View your Investor Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showInvestorFormData && (
        <div
          className={`investorFormContainer ${
            showInvestorFormData ? "active" : ""
          }`}
        >
          <form onSubmit={handleSubmit} className="investor-form">
            <h2>Fill up the Investor Information</h2>
            <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
              Investor Name:
            </label>
            <input
              type="text"
              name="investorName"
              value={investorFormData.investorName}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <div className="select-button-container">
              <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
                Investor Type:
              </label>
              <select
                name="investorType"
                value={investorFormData.investorType}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select your investor Type
                </option>
                <option value="Individual">Individual</option>
                <option value="Venture Capital Firm">
                  Venture Capital Firm
                </option>
                <option value="Private Equity Firm">Private Equity Firm</option>
                <option value="Corporation">Corporation</option>
                <option value="Government Agency">Government Agency</option>
                <option value="Crowdfunding">Crowdfunding</option>
                <option value="Institutional Investor">
                  Institutional Investor
                </option>
              </select>
              <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
                Invested in Startups:
              </label>
              <select
                name="summaryOfInvestment"
                value={selectedStartup}
                onChange={handleStartupChange}
              >
                <option value="" disabled>
                  Select your invested startups
                </option>
                {startups.map((startup, index) => (
                  <option key={index} value={startup._id}>
                    {startup.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="addStartup"
                onClick={handleAddStartup}
                style={{
                  width: "150px",
                  padding: "8px",
                  marginLeft: "810px",
                  fontSize: "0.9em",
                }}
              >
                Add Startup
              </button>
              <div>
                {investorFormData.summaryOfInvestment.length > 0 && (
                  <div>
                    <h4>Selected Startups:</h4>
                    <ul>
                      {investorFormData.summaryOfInvestment.map(
                        (investment, index) => {
                          // Extract the startup ID from the investment object
                          const startupId = investment.startupsId;
                          // Find the startup by ID
                          const startup = startups.find(
                            (s) => s._id === startupId
                          );

                          return (
                            <li key={index}>
                              <p
                                onClick={() => handleNavigate(startupId)}
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                {startup ? startup.name : "Unknown Startup"}
                              </p>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <label className="number-description-item">
              <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
                Total Investments made untill now:
              </label>
            </label>
            <input
              type="number"
              name="totalInvestmentsMade"
              value={investorFormData.totalInvestmentsMade}
              onChange={handleInputChange}
              placeholder="Total investments made"
              required
            />
            <label className="number-description-item">
              <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
                Total Amount Invested untill now:
              </label>
            </label>
            <input
              type="number"
              name="totalAmountInvested"
              value={investorFormData.totalAmountInvested}
              onChange={handleInputChange}
              placeholder="Total amount invested"
              required
            />
            <label className="number-description-item">
              <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
                Total returns gained untill now:
              </label>
            </label>
            <input
              type="number"
              name="totalReturns"
              value={investorFormData.totalReturns}
              onChange={handleInputChange}
              placeholder="Total returns"
              required
            />
            <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
              Recent Activity:
            </label>
            <input
              type="text"
              name="recentActivity"
              value={investorFormData.recentActivity}
              onChange={handleInputChange}
              placeholder="Recent Activity"
              required
            />
            <button type="submit">Submit</button>
            <button
              type="button"
              className="delete-investor"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="close-investor-details"
              onClick={closeForm}
            >
              Close
            </button>
          </form>
        </div>
      )}

      {showinvestorDetails && (
        <div className="investor-details">
          <div className="investorDetailsImage">
            <img src={investor} alt="Investor" width="90" />
          </div>
          <h2 className="investor-title">Investor Details</h2>
          <p>
            <strong>Name:</strong> {investorFormData.investorName}
          </p>
          <p>
            <strong>Investor Type:</strong> {investorFormData.investorType}
          </p>

          <p>
            <strong>Startups you have invested in so far:</strong>
          </p>
          <ul>
            {investorFormData.summaryOfInvestment.map((investment, index) => {
              // Extract the startup ID from the investment object
              const startupId = investment.startupsId;
              // Find the startup by ID
              const startup = startups.find((s) => s._id === startupId);

              return (
                <li key={index}>
                  <p
                    onClick={() => handleNavigate(startupId)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {startup ? startup.name : "Unknown Startup"}
                  </p>
                </li>
              );
            })}
          </ul>

          <p>
            <strong>Total Investments Made:</strong>{" "}
            {investorFormData.totalInvestmentsMade}
          </p>
          <p>
            <strong>Total Returns obtained:</strong>{" "}
            {investorFormData.totalReturns}
          </p>
          <p>
            <strong>Startups you have reached out to:</strong>{" "}
            {investorFormData.startupsApproached.length}
            <ul>
              {investorFormData.startupsApproached.map((investment, index) => {
                console.log("Investment at index", index, ":", investment);

                const startupId = investment._id?.toString(); // Convert to string if it's not already

                if (!startupId) {
                  console.warn(
                    `Investment at index ${index} does not have a valid startup ID.`
                  );
                  return null;
                }

                const startup = startups.find(
                  (s) => s._id?.toString() === startupId
                );

                return (
                  <li key={index}>
                    <p
                      onClick={() => handleNavigate(startupId)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      Startup Name:{startup ? startup.name : "Unknown Startup"}
                    </p>
                    <p>
                      {"Number of times reached out to the startup:" +
                        investment.count}
                    </p>
                    <p>{"Status of your interest:" + investment.status}</p>
                    <input
                      type="checkbox"
                      onChange={() => {
                        handleStartupApproachedChanged(startup._id);
                      }}
                    />
                    <label>Contacted</label>
                  </li>
                );
              })}
            </ul>
            <button onClick={updateStartupsApproached}>Submit</button>
          </p>

          <button className="close-investorDetails" onClick={closeDetailsForm}>
            Close
          </button>
        </div>
      )}

      {showMoreBar && (
        <div className="moreBar">
          <div className="moreBarContent">
            <button onClick={handleViewProfile}>Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default InvestorUserProfile;

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../styling/startupPage.css";
import axios from "axios";
import phone from "../images/phone.png";
import email from "../images/email.png";
import location1 from "../images/location.png";
import Navbar from "../components/navbar"; // Import Navbar component

export default function StartupPage() {
  const location = useLocation();
  const { id, userId } = location.state || {}; // Extract id from location.state

  let [check, setCheck] = useState("");

  // React.useEffect(() => {
  //   if (location.state) {
  //     setCheck(location.state.check || "Investor Profile1");
  //   }
  // }, [location.state]);

  React.useEffect(() => {
    if (location.state) {
      setCheck(location.state.check === "Admin Profile" ? "Admin Profile" : "Investor Profile1");
    }
  }, [location.state]);
  

  const [investorsInfo, setInvestorsInfo] = useState({
    investorName: "",
    logo: null,
    investorType: "",
    summaryOfInvestment: [],
    totalInvestmentsMade: 0,
    totalAmountInvested: 0,
    totalReturns: 0,
    startupsApproached: [],
    recentActivity: "",
    recieveMessage: null,
    user: "",
  });
  const [startups, setStartups] = useState([
    {
      name: "",
      founders: "",
      aim: "",
      overview: "",
      businessPlan: "",
      projections: "",
      products: [],
      logo: null,
      teamImage: null,
      interestedInvestors: [],
      summaryOfInvestment: [],
    },
  ]);
  const [userId1, setUserId1] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    Date: "",
    Description: "",
    phonenumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("THIS IS INVESTOR-ID : " + id);
        const response = await axios.get(
          `https://startup-connect-backend.vercel.app/investor/getInvestorById/${id}`
        );
        const data = response.data.foundInvestor;
        console.log("DATA: " + data);
        console.log("Fetched investor data:", data);
        setUserId1(data.user); // Update userId1 here

        setInvestorsInfo({
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
          user: data.userId || "",
        });
        console.log("summaryOfInvestment:", data.summaryOfInvestment);
      } catch (err) {
        console.error("Error fetching investor data:", err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (investorsInfo.summaryOfInvestment.length > 0) {
      const fetchStartupsData = async () => {
        try {
          // Fetch startup data using startupsId
          const responses = await Promise.all(
            investorsInfo.summaryOfInvestment.map(async (investment) => {
              const response = await axios.get(
                `https://startup-connect-backend.vercel.app/startup/getStartupId/${investment.startupsId}`
              );
              return response.data; // Assuming response.data contains the startup data
            })
          );

          // Set startups state with the fetched data
          setStartups(responses);
        } catch (error) {
          console.error("Error fetching startup data:", error);
        }
      };

      fetchStartupsData();
    }
  }, [investorsInfo]); // Run this effect when investorsInfo changes

  useEffect(() => {
    if (userId1) {
      const fetchData2 = async () => {
        try {
          const response = await axios.get(
            `https://startup-connect-backend.vercel.app/user/getSpecificUser/${userId1}`
          );
          const data = response.data;
          console.log("Fetched user data:", data);
          setUserInfo({
            name: data.name || "",
            email: data.email || "",
            password: data.password || "",
            location: data.location || "",
            Date: data.Date || "",
            Description: data.Description || "",
            phonenumber: data.phonenumber || "",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData2();
    }
  }, [userId1]); // Run this effect when userId1 changes

  useEffect(() => {
    // Check if summaryOfInvestment has startup IDs
    if (investorsInfo.summaryOfInvestment.length > 0) {
      const fetchStartupsData = async () => {
        try {
          // Map over each startup ID and fetch the corresponding data
          const responses = await Promise.all(
            investorsInfo.summaryOfInvestment.map(async (startupId) => {
              const response = await axios.get(
                `https://startup-connect-backend.vercel.app/startup/getStartupId/${startupId}`
              );
              return response.data; // Assuming response.data contains the startup data
            })
          );

          // Set the startups state with the fetched data
          setStartups(responses);
        } catch (error) {
          console.error("Error fetching startup data:", error);
        }
      };

      fetchStartupsData();
    }
  }, [investorsInfo]); // Run this effect when investorsInfo changes

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
  }, []);

  const handleStartupClick = (startupId1) => {
    navigate("/startupPage", {
      state: { id: startupId1, userId, investorId: id , check },
    });
  };
  return (
    <div className="startupPage-container">
      <Navbar userId={userId} check={check} />{" "}
      {/* Include Navbar here * Investor Profile1*/}
      <div className="startupImages">
        {investorsInfo.logo && (
          <img
            className="investorPage-logo"
            src={investorsInfo.logo}
            alt="Logo"
          />
        )}
      </div>
      <div className="userInfo">
        <img className="phoneNumber" src={phone} alt="Phone Number" />
        <h3>{userInfo.phonenumber}</h3>
        <img className="email" src={email} alt="Email" />
        <a href={`mailto:${userInfo.email}`} className="email-link">
          <h3>{userInfo.email}</h3>
        </a>
        <img className="location" src={location1} alt="Location" />
        <h3>{userInfo.location}</h3>
      </div>
      <div className="UserDescriptiveInfo">
        <h2 className="info-heading">Investor Information</h2>
        <div className="UserDescriptiveInfo123">
          <div className="info-item">
            <h3 className="info-title">Name:</h3>
            <p className="info-detail">{investorsInfo.investorName}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Investor Type:</h3>
            <p className="info-detail">{investorsInfo.investorType}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">
              Startups the investor has invested in so far:
            </h3>
            <div className="info-detail">
              {startups.length > 0 ? (
                startups.map((startup) => {
                  return (
                    <div key={startup._id}>
                      <h3
                        className="startup-name"
                        onClick={() => handleStartupClick(startup._id)}
                      >
                        {startup.name}
                      </h3>
                    </div>
                  );
                })
              ) : (
                <p>No startups invested in yet.</p>
              )}
            </div>
          </div>

          <div className="info-item">
            <h3 className="info-title">Total Investments Made:</h3>
            <p className="info-detail">{investorsInfo.totalInvestmentsMade}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Total Amount Invested:</h3>
            <p className="info-detail">{investorsInfo.totalAmountInvested}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Total Returns:</h3>
            <p className="info-detail">{investorsInfo.totalReturns}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Recent Activity:</h3>
            <p className="info-detail">{investorsInfo.recentActivity}</p>
          </div>
          <div className="info-item">
            <p>
              <strong>Startups the investor has reached out to:</strong>{" "}
              {investorsInfo.startupsApproached.length}
              <ul>
                {investorsInfo.startupsApproached.map((investment, index) => {
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
                        onClick={() => handleStartupClick(startupId)}
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        Startup Name:
                        {startup ? startup.name : "Unknown Startup"}
                      </p>
                      {check === "Admin Profile" && (
                        <p>Status: {investment.status}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "../styling/startupPage.css";
import axios from "axios";
import phone from "../images/phone.png";
import email from "../images/email.png";
import location1 from "../images/location.png";
import Navbar from "../components/navbar"; // Import Navbar component

export default function StartupPage() {
  let [check, setCheck] = useState("");
  console.log("Hi, you are in StartupPage");
  const location = useLocation();
  const navigate = useNavigate();
  const { id, userId } = location.state || {}; // Extract id from location.state
  const { investorId } = location.state || {};

  // React.useEffect(() => {
  //   if (location.state) {
  //     setCheck(location.state.check || "Startup Profile1");
  //   }
  // }, [location.state]);

  React.useEffect(() => {
    if (location.state) {
      setCheck(location.state.check === "Admin Profile" ? "Admin Profile" : "Startup Profile1");
    }
  }, [location.state]);
  

  const [startupsInfo, setStartupsInfo] = useState({
    name: "",
    founders: "",
    aim: "",
    overview: "",
    businessPlan: "",
    projections: "",
    products: [
      {
        productname: "",
        information: "",
        teammembers: [{ teammembername: "", qualification: "", role: "" }],
      },
    ],
    logo: null,
    teamImage: null,
    interestedInvestors: [],
    summaryOfInvestment: [],
  });

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

  const [interestedInvestorId, setinterestedInvestorId] = useState(null);
  const [showInterest, setShowInterest] = useState(false);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://startup-connect-backend.vercel.app/startup/getStartupId/${id}`
        );
        const data = response.data;
        console.log("Fetched startup data:", data);
        setUserId1(data.user);
        setStartupsInfo({
          name: data.name || "",
          founders: data.founders || "",
          aim: data.aim || "",
          overview: data.overview || "",
          businessPlan: data.businessPlan || "",
          projections: data.projections || "",
          products: data.product || [],
          logo: data.logo || null,
          teamImage: data.teamImage || null,
          sendMessage: data.sendMessage || null,
          user: data.user || null,
          mostViewed: data.mostViewed || null,
          interestedInvestors: data.interestedInvestors || [],
          summaryOfInvestment: data.summaryOfInvestment || [],
        });
        console.log("Product data:", data.product);
        console.log("Most Viewed Data:", data.mostViewed);
      } catch (err) {
        console.error("Error fetching startup data:", err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, check]); // check added

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
  }, [userId1]);

  useEffect(() => {
    console.log("This is the useEffect that fetches all the investors");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://startup-connect-backend.vercel.app/investor/getAllInvestors`
        );
        const data = response.data;
        setInvestors(data); // Directly set the data as an array
        console.log("!!!!!!!!!!!11" + data);
      } catch (error) {
        console.log("Error fetching the investors data", error);
      }
    };
    fetchData();
  }, []);

  const handleButtonClick = () => {
    setShowInterest(!showInterest);
  };

  const handleNavigateInvestor = (id) => {
    console.log("``````````````````````````````````````````````````````````````````"+check)
    
    navigate("/investorPage", { state: { id, userId, check } });
  };

  // const handleInterestClick = async () => {
  //   console.log("You are in handleInterestClick function");
  //   let check = false;
  //   let invesId = null;
  //   try {
  //     invesId = await axios.get(
  //       `http://localhost:3000/user/checkInvestorIdCorrespondingToUser/${userId}`
  //     );
  //     console.log("Investor ID fetched:", invesId.data.investorId);

  //     setinterestedInvestorId(invesId.data.investorId);
  //     // if (invesId) {
  //     //   const response = await axios.get(
  //     //     `http://localhost:3000/startup/getStartupId/${id}`
  //     //   );
  //     //   console.log("I AM PRINTING THE STARTUP DATA: " + response.data.user);
  //     //   if (response.data.user == userId) {
  //     console.log("^^^^^^"+check);
  //         if(!investorId){
  //         return check;
  //       } else {
  //         check = true;
  //         await saveInterestRecord(invesId.data.investorId);
  //       }
  //     }
  //   //}
  //   catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  //   return check;
  // };
  const handleInterestClick = async () => {
    console.log("You are in handleInterestClick function");
    try {
      const response = await axios.get(`https://startup-connect-backend.vercel.app/user/checkInvestorIdCorrespondingToUser/${userId}`);
      const investorId = response.data.investorId;
  
      console.log("Investor ID fetched:", investorId);
  
      if (investorId != null) {
        const startupResponse = await axios.get(`https://startup-connect-backend.vercel.app/startup/getStartupId/${id}`);
        console.log('Startup data:', startupResponse.data.user);
  
        if (startupResponse.data.user === userId) {
          return false; // No interest if the startup belongs to the user
        } else {
          await saveInterestRecord(investorId);
          console.log('Interest record saved');
          return true;
        }
      } else {
        console.log('Investor ID is null');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const saveInterestRecord = async (investorId) => {
    let investorData;
    try {
      console.log("Starting saveInterestRecord function");

      // Ensure startupsInfo and its properties are initialized
      if (!startupsInfo.interestedInvestors) {
        startupsInfo.interestedInvestors = [];
      }

      let existingInvestor = startupsInfo.interestedInvestors.find(
        (investor) => investor.investorId === investorId
      );
      console.log("EXISTING INVESTOR: " + existingInvestor);
      if (existingInvestor) {
        existingInvestor.count += 1;
        existingInvestor.status = "Pending";
      } else {
        startupsInfo.interestedInvestors.push({
          investorId: investorId,
          status: "Pending",
          count: 1,
        });
      }

      // Update startup information
      try {
        await axios.put(
          `https://startup-connect-backend.vercel.app/startup/updateStartup/${id}`,
          startupsInfo
        );
        console.log("Startup info successfully updated");
      } catch (error) {
        console.error(
          "Error updating startup info:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }

      // Fetch investor data
      let response;
      try {
        response = await axios.get(
          `https://startup-connect-backend.vercel.app/investor/getInvestorByUserId/${userId}`
        );
        console.log("Fetched investor data:", response.data);
      } catch (error) {
        console.error(
          "Error fetching investor data:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }

      // Ensure investor ID is valid
      investorData = response.data.Investor;
      if (!investorData._id) {
        throw new Error("Investor ID is missing from the response data");
      }

      // Initialize startupsApproached if not already
      if (!investorData.startupsApproached) {
        investorData.startupsApproached = [];
      }

      // Add new entry to startupsApproached
      let existingStartup = investorData.startupsApproached.find(
        (startup) => startup._id.toString() === id.toString()
      );
      if (existingStartup) {
        existingStartup.count = (existingStartup.count || 0) + 1;
        existingStartup.status = "Pending";
      } else {
        investorData.startupsApproached.push({
          _id: id,
          status: "Pending",
          count: 1,
        });
      }

      console.log("Investor updated data:", investorData);

      // Update investor info
      try {
        await axios.put(
          `https://startup-connect-backend.vercel.app/investor/updateInvestor/${investorData._id}`,
          investorData
        );
        console.log("Investor info successfully updated");
      } catch (error) {
        console.error(
          "Error updating investor info:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
    } catch (error) {
      console.log("Error submitting the data:", error);
    }

    // implementing the eamil knowledge
    let investorEmail;
    let investorPhonenumber;
    try {
      let response = await axios.get(
        `https://startup-connect-backend.vercel.app/user/getSpecificUser/${userId}`
      );
      investorEmail = response.data.email;
      investorPhonenumber = response.data.phonenumber;
      console.log("investor Email data : " + response.data);
    } catch (error) {
      console.log("Cannot fetch the investor email. Error: ", error);
    }
    let startupEmail;
    let startupPhonenumber;
    try {
      let response = await axios.get(
        `https://startup-connect-backend.vercel.app/startup/getStartupId/${id}`
      );
      let userid = response.data.user;
      console.log("startup user: " + response.data);
      let res = await axios.get(
        `https://startup-connect-backend.vercel.app/user/getSpecificUser/${userid}`
      );
      console.log("startup Email data : " + response.data);
      startupEmail = res.data.email;
      startupPhonenumber = res.data.phonenumber;
    } catch (error) {
      console.log("Cannot fetch the startup email. Error: ", error);
    }
    // EMAIL LOGIC IMPLEMENTED HERE

    try {
      const emailResponse = await axios.post(
        "https://startup-connect-backend.vercel.app/email/sendEmail",
        {
          startupEmail: startupEmail,
          startupName: startupsInfo.name,
          investorEmail: investorEmail,
          investorName: investorData.investorName,
          investorId: investorId,
          startupId: id,
          investorPhonenumber: investorPhonenumber,
          startupPhonenumber: startupPhonenumber,
        }
      );
      console.log("Email sent successfully:", emailResponse.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  return (
    <div className="startupPage-container">
      <Navbar userId={userId} check={check} investorId={investorId} />
      <div className="startupImages">
        {startupsInfo.logo && (
          <img
            className="startupPage-logo"
            src={startupsInfo.logo}
            alt="Logo"
          />
        )}
        {startupsInfo.teamImage && (
          <img
            className="startupPage-teamImage"
            src={`https://startup-connect-backend.vercel.app/${startupsInfo.teamImage}`}
            alt="Team"
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
        <h2 className="info-heading">Startup Information</h2>

        <button onClick={handleButtonClick}>
          {showInterest ? "Hide Interest" : "Show Interest"}
        </button>
        <div className={`showInterest-container ${showInterest ? "open" : ""}`}>
          <div className="showInterest-wrapper">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="showInterest"
                onChange={async (e) => {
                  const checkStatus = await handleInterestClick(); // Wait for the interest check
                  if (checkStatus) {
                    if (e.target.checked) {
                      Swal.fire({
                        title: "Good job!",
                        text: "Your Interest was sent to the Startup!. Check your email!",
                        icon: "success",
                      });
                    }
                  } else {
                    e.target.checked = false;
                    Swal.fire({
                      icon: "warning",
                      title: "Alert...",
                      text: "Create an investor account first to show interest or You can't show interest to your own Startup!",
                    });
                  }
                }}
              />

              <label htmlFor="showInterest" className="custom-checkbox">
                <span> Show Interest!</span>
              </label>
            </div>
          </div>
        </div>

        <div className="UserDescriptiveInfo123">
          <div className="info-item">
            <h3 className="info-title">Name:</h3>
            <p className="info-detail">{startupsInfo.name}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Founders:</h3>
            <p className="info-detail">{startupsInfo.founders}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Aim:</h3>
            <p className="info-detail">{startupsInfo.aim}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Overview:</h3>
            <p className="info-detail">{startupsInfo.overview}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Business Plan:</h3>
            <p className="info-detail">{startupsInfo.businessPlan}</p>
          </div>
          <div className="info-item">
            <h3 className="info-title">Projections:</h3>
            <p className="info-detail">{startupsInfo.projections}</p>
          </div>
          <h3 className="info-title-products">Products:</h3>
          <div className="info-item-products">
            {startupsInfo.products && startupsInfo.products.length > 0 ? (
              startupsInfo.products.map((product, index) => (
                <div key={index} className="product-info">
                  <h4 className="product-name">
                    {product.productname || "No Product Name"}
                  </h4>
                  <p className="product-info-detail">
                    {product.information || "No Product Information"}
                  </p>
                  <div className="team-members">
                    <h5 className="team-members-heading">Team Members:</h5>
                    {product.teammembers && product.teammembers.length > 0 ? (
                      product.teammembers.map((member, idx) => (
                        <div key={idx} className="team-member">
                          <p>
                            <strong>Name:</strong>{" "}
                            {member.teammembername || "No Member Name"}
                          </p>
                          <p>
                            <strong>Qualification:</strong>{" "}
                            {member.qualification || "No Qualification"}
                          </p>
                          <p>
                            <strong>Role:</strong> {member.role || "No Role"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No team members available</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
          <div className="info-item">
            <label>Investors who have invested in the startup so far:</label>
            <ul>
              {startupsInfo.summaryOfInvestment.map((investor, index) => {
                const investorId = investor.investorId;
                const investor1 = investors.find((i) => i._id == investorId);
                return (
                  <li key={index}>
                    <p
                      onClick={() => handleNavigateInvestor(investor1._id)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      {investor1 ? investor1.investorName : "Unkown Investor"}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="info-item">
            <label>Investors that have reached out to the Startup:</label>
            <ul>
              {startupsInfo.interestedInvestors.map((investment, index) => {
                console.log("Investment at index", index, ":", investment);

                const investmentId = investment.investorId;
                console.log("::::::" + investmentId);

                // Find the investor by matching IDs
                const investor = investors.find((s) => s._id == investmentId);

                if (!investor) {
                  console.warn(`Investor not found for ID: ${investmentId}`);
                }

                return (
                  <li key={index}>
                    <p
                      onClick={() => handleNavigateInvestor(investmentId)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      Investor Name:{" "}
                      {investor ? investor.investorName : "Unknown Investor"}
                    </p>
                    {check=='Admin Profile' && (
                      <p>Status:{investment.status}</p>
                    )}
                   
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

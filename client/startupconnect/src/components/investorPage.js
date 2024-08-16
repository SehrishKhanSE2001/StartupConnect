
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "../styling/startupPage.css";
import axios from "axios";
import phone from "../images/phone.png";
import email from "../images/email.png";
import location1 from "../images/location.png";
import Navbar from "../components/navbar"; // Import Navbar component

export default function StartupPage() {
  console.log("Hi, you are in Investor Page");
  const location = useLocation();
  const { id , userId , check } = location.state || {}; // Extract id from location.state
  
  
  console.log("Investor ID:", id);
  console.log("USER ID MY ASS: "+userId)

  const [investorsInfo, setInvestorsInfo] = useState({
    investorName: "",
    logo: null,
    investorType: "",
    summaryOfInvestment:[],
    totalInvestmentsMade:0,
    totalAmountInvested:0,
    totalReturns:0,
    startupsApproached:[],
    recentActivity:'',
    recieveMessage:null,
    user:''
  });
  const [startups , setStartups]=useState([
    {
        name:'',
        founders:'',
        aim:'',
        overview:'',
        businessPlan:'',
        projections:'',
        products:[]
    }
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
  const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("THIS IS INVESTOR-ID : "+id)
        const response = await axios.get(
          `http://localhost:3000/investor/getInvestorById/${id}`
        );
        const data = response.data.foundInvestor;
        console.log("DATA: "+data)
        console.log("Fetched investor data:", data);
        setUserId1(data.user); // Update userId1 here

        setInvestorsInfo({
            investorName:data.investorName|| '',
            logo: data.logo||'',
            investorType: data.investorType || '',
            summaryOfInvestment: data.summaryOfInvestment || [],
            totalInvestmentsMade: data.totalInvestmentsMade || 0,
            totalAmountInvested: data.totalAmountInvested || 0,
            totalReturns: data.totalReturns || 0,
            startupsApproached:data.startupsApproached || [],
            recentActivity: data.recentActivity || '',
            receiveMessage: data.receiveMessage || '',
            user: data.userId || ''
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
    if (userId1) {
      const fetchData2 = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/user/getSpecificUser/${userId1}`
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

//   useEffect(() => {
//     // Set startups when investorsInfo changes
//     console.log("These are the startups:",startups)
//     const fecthData=async()=>{
//     try{
//         const response = await axios.get(`http://localhost:3000/startup/getStartupId/${investorsInfo.summaryOfInvestment.id}`);
//     }catch(error)
//     {

//     }
//     }
//     fetchData()
//   }, [investorsInfo]);

useEffect(() => {
    // Check if summaryOfInvestment has startup IDs
    if (investorsInfo.summaryOfInvestment.length > 0) {
      const fetchStartupsData = async () => {
        try {
          // Map over each startup ID and fetch the corresponding data
          const responses = await Promise.all(
            investorsInfo.summaryOfInvestment.map(async (startupId) => {
              const response = await axios.get(`http://localhost:3000/startup/getStartupId/${startupId}`);
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
  

  const handleStartupClick=(startupId)=>{
    console.log("-------------"+startupId+"-----------");
    navigate('/startupPage',{state:{startupId,userId,check,id}})
  }
  return (
    <div className="startupPage-container">
      <Navbar userId={userId} check={check}/> {/* Include Navbar here */}
      <div className="startupImages">
        {investorsInfo.logo && (
          <img
            className="investorPage-logo"
            src={`http://localhost:3000/${investorsInfo.logo}`}
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
            <h3 className="info-title">Invested Startups Made up till now:</h3>
            <div className="info-detail">
            {startups.length > 0 ? (
  startups.map((startup) => {
    console.log("Rendering startup with _id:", startup._id); // Log the startup ID
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

          
        </div>
      </div>
    </div>
  );
}

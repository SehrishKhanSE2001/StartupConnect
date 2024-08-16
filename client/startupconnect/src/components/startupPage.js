

// import { useLocation } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import "../styling/startupPage.css";
// import axios from "axios";
// import phone from "../images/phone.png";
// import email from "../images/email.png";
// import location1 from "../images/location.png";


// export default function StartupPage() {
//   console.log("Hi, you are in StartupPage");
//   const location = useLocation();
//   const { id } = location.state || {}; // Extract id from location.state
//   console.log("Startup ID:", id);

//   const [startupsInfo, setStartupsInfo] = useState({
//     name: "",
//     founders: "",
//     aim: "",
//     overview: "",
//     businessPlan: "",
//     projections: "",
//     products: [
//       {
//         productname: "",
//         information: "",
//         teammembers: [{ teammembername: "", qualification: "", role: "" }],
//       },
//     ],
//     logo: null,
//     teamImage: null,
//   });

//   const [userId, setUserId] = useState(null);
//   const [userInfo, setUserInfo] = useState({
//     name: "",
//     email: "",
//     password: "",
//     location: "",
//     Date: "",
//     Description: "",
//     phonenumber: "",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/startup/getStartupId/${id}`
//         );
//         const data = response.data;
//         console.log("Fetched startup data:", data);
//         setUserId(data.user);
//         setStartupsInfo({
//           name: data.name || "",
//           founders: data.founders || "",
//           aim: data.aim || "",
//           overview: data.overview || "",
//           businessPlan: data.businessPlan || "",
//           projections: data.projections || "",
//           products: data.product || [],
//           logo: data.logo || null,
//           teamImage: data.teamImage || null,
//         });
//         console.log(
//           "___________________________________________________________________________" +
//             data.product
//         );
//       } catch (err) {
//         console.error("Error fetching startup data:", err);
//       }
//     };

//     if (id) {
//       fetchData();
//     }
//   }, [id]);

//   useEffect(() => {
//     console.log("Updated userId:", userId);
//     const fetchData2 = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/user/getSpecificUser/${userId}`
//         );
//         const data = response.data;
//         console.log("------Fetched user data:", data);
//         setUserInfo({
//           name: data.name || "",
//           email: data.email || "",
//           password: data.password || "",
//           location: data.location || "",
//           Date: data.Date || "",
//           Description: data.Description || "",
//           phonenumber: data.phonenumber || "",
//         });
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     if (userId) {
//       fetchData2();
//     }
//   }, [userId]);

//   return (
//     <div className="startupPage-container">
//       <div className="startupImages">
//         {startupsInfo.logo && (
//           <img
//             className="startupPage-logo"
//             src={`http://localhost:3000/${startupsInfo.logo}`}
//             alt="Logo"
//           />
//         )}
//         {startupsInfo.teamImage && (
//           <img
//             className="startupPage-teamImage"
//             src={`http://localhost:3000/${startupsInfo.teamImage}`}
//             alt="Team"
//           />
//         )}
//       </div>
//       <div className="userInfo">
//         <img className="phoneNumber" src={phone} alt="Phone Number" />
//         <h3>{userInfo.phonenumber}</h3>
//         <img className="email" src={email} alt="Email" />
//         <a href={`mailto:${userInfo.email}`} className="email-link">
//           <h3>{userInfo.email}</h3>
//         </a>
//         <img className="location" src={location1} alt="Location" />
//         <h3>{userInfo.location}</h3>
//       </div>

//       <div className="UserDescriptiveInfo">
//         <h2 className="info-heading">Startup Information</h2>
//         <div className="UserDescriptiveInfo123">
//         <div className="info-item">
//           <h3 className="info-title">Name:</h3>
//           <p className="info-detail">{startupsInfo.name}</p>
//         </div>
//         <div className="info-item">
//           <h3 className="info-title">Founders:</h3>
//           <p className="info-detail">{startupsInfo.founders}</p>
//         </div>
//         <div className="info-item">
//           <h3 className="info-title">Aim:</h3>
//           <p className="info-detail">{startupsInfo.aim}</p>
//         </div>
//         <div className="info-item">
//           <h3 className="info-title">Overview:</h3>
//           <p className="info-detail">{startupsInfo.overview}</p>
//         </div>
//         <div className="info-item">
//           <h3 className="info-title">Business Plan:</h3>
//           <p className="info-detail">{startupsInfo.businessPlan}</p>
//         </div>
//         <div className="info-item">
//           <h3 className="info-title">Projections:</h3>
//           <p className="info-detail">{startupsInfo.projections}</p>
//         </div>
//         <h3 className="info-title-products">Products:</h3>
//         <div className="info-item-products">
//           {/* <h3 className="info-title">Products:</h3> */}
//           {startupsInfo.products && startupsInfo.products.length > 0 ? (
//             startupsInfo.products.map((product, index) => (
//               <div key={index} className="product-info">
//                 <h4 className="product-name">
//                   {product.productname || "No Product Name"}
//                 </h4>
//                 <p className="product-info-detail">
//                   {product.information || "No Product Information"}
//                 </p>
//                 <div className="team-members">
//                   <h5 className="team-members-heading">Team Members:</h5>
//                   {product.teammembers && product.teammembers.length > 0 ? (
//                     product.teammembers.map((member, idx) => (
//                       <div key={idx} className="team-member">
//                         <p>
//                           <strong>Name:</strong>{" "}
//                           {member.teammembername || "No Member Name"}
//                         </p>
//                         <p>
//                           <strong>Qualification:</strong>{" "}
//                           {member.qualification || "No Qualification"}
//                         </p>
//                         <p>
//                           <strong>Role:</strong> {member.role || "No Role"}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No team members available</p>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No products available</p>
//           )}
//         </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../styling/startupPage.css";
import axios from "axios";
import phone from "../images/phone.png";
import email from "../images/email.png";
import location1 from "../images/location.png";
import Navbar from "../components/navbar"; // Import Navbar component

export default function StartupPage() {
  console.log("Hi, you are in StartupPage");
  const location = useLocation();
  const { id , userId , check } = location.state || {}; // Extract id from location.state
  const {investorId} = location.state || {}
  
  console.log("Startup ID:", id);
  console.log("USER ID MY ASS: "+userId)

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
  
  const [feedback, setFeedback] = useState({
    description: '',
    starRating: ''
});


  useEffect(() => {
    const fetchData = async () => {
      console.log("!!!!!!!!!!!!!!!"+id+"!!!!!!!!!!!!1")
      try {
        const response = await axios.get(
          `http://localhost:3000/startup/getStartupId/${id}`
        );
        const data = response.data;
        console.log("Fetched startup data:", data);
        setUserId1(data.user); // Update userId1 here
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

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value: ${value}`); // Add this line for debugging
    setFeedback(prevFeedback => ({
      ...prevFeedback,
      [name]: value
    }));
  };
  

const handleFeedbackSubmit = async (e) => {
  e.preventDefault();

  console.log("Form submitted");
  console.log("Feedback:", feedback);
  console.log("User ID:", userId);
  console.log("Startup ID:", id);

  // Check userId and id
  if (!userId || !id) {
    alert("User ID or Startup ID is missing.");
    return;
  }

  // Construct payload
  const payload = {
    userId: userId,
    investorId: investorId || null,
    description: feedback.description,
    starRating: feedback.starRating,
  };
  const url = `http://localhost:3000/startup/addfeedback/${id}`;
  console.log("Submitting feedback to URL:", url);
  console.log("Payload being sent:", payload);
  console.log("Submitting feedback for startup ID:", id);
  console.log("Payload being sent:", payload);

  try {
    // const response = await axios.post(
    //   `http://localhost:3000/startup/addfeedback/${id}`,
    //   payload,
    //   { headers: { 'Content-Type': 'application/json' } }
    // );
     
    const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });

    console.log("Feedback submitted:", response.data);
    alert("Feedback submitted successfully!");
  } catch (error) {
    console.error("Error submitting feedback:");
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request data:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    
    console.error("Error config:", error.config);
    alert("Error submitting feedback. Please try again.");
  }
};




  return (
    <div className="startupPage-container">
      <Navbar userId={userId} check={check} investorId={investorId}/> {/* Include Navbar here */}
      <div className="startupImages">
        {startupsInfo.logo && (
          <img
            className="startupPage-logo"
            src={`http://localhost:3000/${startupsInfo.logo}`}
            alt="Logo"
          />
        )}
        {startupsInfo.teamImage && (
          <img
            className="startupPage-teamImage"
            src={`http://localhost:3000/${startupsInfo.teamImage}`}
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
        </div>
      </div>

         {/* FEEDBACK MECHANISM ADDED HERE */}
      <div className="feedback-section">
        <h2 className="feedback-heading">Submit Your Feedback</h2>
        {/* {investorId && (
          <p>
            <a href={`http://localhost:3000/investor/${investorId}`} className="investor-link">
              View Investor Profile
            </a>
          </p>
        )} */}
        <form onSubmit={handleFeedbackSubmit}>
          <div className="feedback-item">
            <label htmlFor="description">Description:</label>
            <textarea
             id="description"
             name="description"
             value={feedback.description}
             onChange={handleFeedbackChange}
             required
              />

          </div>
          <div className="feedback-item">
            <label htmlFor="starRating">Rating:</label>
            <input
             type="number"
             id="starRating"
             name="starRating"
             min="1"
             max="5"
             value={feedback.starRating}
             onChange={handleFeedbackChange}
             required
            />

          </div>
          <button type="submit"></button>
          </form>
          </div>
          {/* FEEDBACK MECHANISM ENDS HERE  */}

    </div>
  );
}

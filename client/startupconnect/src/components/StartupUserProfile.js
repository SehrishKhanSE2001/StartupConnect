import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styling/startupUserProfile.css";
import Swal from "sweetalert2";

import Navbar from "../components/navbar";


import startup from "../images/b.png";

import camera from "../images/camera.png";

import axios from "axios";

const StartupUserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [topHalfImage, setTopHalfImage] = useState(null);
  const [teamImage, setTeamImage] = useState(null);

  const topHalfImageRef = useRef(null);
  const teamImageRef = useRef(null);

  const [startupId, setstartupId] = useState(0);
  const [investors, setInvestors] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [interestedInvestors, setinterestedInvestors] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Submitted Successfully!"
  );

  const [showMoreBar, setShowMoreBar] = useState(false);

  useEffect(() => {
    console.log("This is the useEffect that fetches all the investors");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://startup-connect-backend.vercel.app/investor/getAllInvestors`
        );
        const data = response.data;
        setInvestors(data); // Directly set the data as an array
      } catch (error) {
        console.log("Error fetching the investors data", error);
      }
    };
    fetchData();
  }, []); // Add an empty dependency array to run this effect only once

  useEffect(() => {
    console.log("Hello from useEffect");
    console.log("useEffect triggered with userId:", userId);
    console.log("useEffect triggered with startupId:", startupId);

    const fetchData = async () => {
      console.log("Fetching data for userId:", userId);
      try {
        const response = await axios.get(
          `https://startup-connect-backend.vercel.app/startup/getStartupByUserId/${userId}`
        );
        const data = response.data;
        console.log("`````````````````````````Fetched data:", data);

        setFormData({
          name: data.name || "",
          founders: data.founders || "",
          aim: data.aim || "",
          overview: data.overview || "",
          businessPlan: data.businessPlan || "",
          projections: data.projections || "",
          products: data.product || [],
          interestedInvestors: data.interestedInvestors || [],
          summaryOfInvestment: data.summaryOfInvestment || [],
          user: userId,
        });

        if (data._id) {
          setstartupId(data._id);
        }
        setinterestedInvestors(data.interestedInvestors);
        console.log(
          "!!!!!!!!!!!!!!!!! interested investors" +
            formData.interestedInvestors
        );
        setTopHalfImage(data.logo);
        setTeamImage(data.teamImage);

        //added by
        if (topHalfImageRef.current) {
          topHalfImageRef.current.src = data.logo;
        }
        if (teamImageRef.current) {
          teamImageRef.current.src = data.teamImage;
        }

        console.log(
          "IMAGES: topHalfImage:" + data.logo + "  teamImage: " + data.teamImage
        );
        console.log(
          "IMAGES: topHalfImage:" + topHalfImage + "  teamImage: " + teamImage
        );
      } catch (error) {
        console.error("Error fetching startup data:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, startupId]); // Add startupId here

 

  const handleImageChange1 = async (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
    await handleImageSubmit();
  };

  const handleImageChange2 = async (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
    await handleImageSubmit();
  };

  // ------------------------------------------ FORM LOGIC IMPLEMENTED HERE --------------------------------------------------------------
  const [showForm1, setShowForm1] = useState(false);

  const [formData, setFormData] = useState({
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
    interestedInvestors: [],
    summaryOfInvestment: [],
  });

  const handleInputChange = useCallback(
    (e, productIndex = null, teamMemberIndex = null) => {
      const { name, value } = e.target;

      if (productIndex !== null && teamMemberIndex !== null) {
        setFormData((prevFormData) => {
          const updatedProducts = [...prevFormData.products];
          updatedProducts[productIndex].teammembers[teamMemberIndex][name] =
            value;
          return { ...prevFormData, products: updatedProducts };
        });
      } else if (productIndex !== null) {
        setFormData((prevFormData) => {
          const updatedProducts = [...prevFormData.products];
          updatedProducts[productIndex][name] = value;
          return { ...prevFormData, products: updatedProducts };
        });
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    },
    []
  );

  const addProduct = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      products: [
        ...prevFormData.products,
        {
          productname: "",
          information: "",
          teammembers: [{ teammembername: "", qualification: "", role: "" }],
        },
      ],
    }));
  };

  const addTeamMember = (index) => {
    setFormData((prevFormData) => {
      const updatedProducts = [...prevFormData.products];
      updatedProducts[index].teammembers.push({
        teammembername: "",
        qualification: "",
        role: "",
      });
      return { ...prevFormData, products: updatedProducts };
    });
  };

  const deleteProduct = (index) => {
    setFormData((prevFormData) => {
      const updatedProducts = [...prevFormData.products];
      updatedProducts.splice(index, 1);
      return { ...prevFormData, products: updatedProducts };
    });
  };

  const deleteTeamMember = (productIndex, teamMemberIndex) => {
    setFormData((prevFormData) => {
      const updatedProducts = [...prevFormData.products];
      updatedProducts[productIndex].teammembers.splice(teamMemberIndex, 1);
      return { ...prevFormData, products: updatedProducts };
    });
  };

  const deleteStartup1 = async () => {
    try {
      await axios.delete(
        `https://startup-connect-backend.vercel.app/startup/deleteStartupByUserId/${userId}`
      );
      {
        Swal.fire({
          title: "Deleted!",
          text: "Startup Deleted!",
          icon: "success",
        });
      }
    } catch (error) {
      console.log("there was an error in deleting the startup");
      console.log("Error in deleting the startup:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while deleting the Startup. Please try again!",
      });
    }
  };

  const handleRemoveInvestor = (index) => {
    // Create a copy of the current summaryOfInvestment array
    const updatedInvestments = [...formData.summaryOfInvestment];

    // Remove the investor at the specified index
    updatedInvestments.splice(index, 1);

    // Update the formData with the new array
    setFormData({ ...formData, summaryOfInvestment: updatedInvestments });
  };

  const handleInvestorChange = (e) => {
    const value = e.target.value;
    setSelectedInvestor(value);
  };

  const handleAddInvestor = () => {
    console.log("Current summaryOfInvestment:", formData.summaryOfInvestment);

    if (
      selectedInvestor &&
      !formData.summaryOfInvestment.some(
        (item) => item.investorId === selectedInvestor
      )
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        summaryOfInvestment: [
          ...prevFormData.summaryOfInvestment,
          { investorId: selectedInvestor },
        ],
      }));
      setSelectedInvestor(""); // Reset selectedInvestor
    }
  };

  const handleInterestedInvestorsChanged = (investorId) => {
    setinterestedInvestors((prev = []) => {
      const updatedInvestors = prev.map((investor) => {
        if (investor.investorId === investorId) {
          return { ...investor, status: "Contacted" };
        }
        return investor; // Corrected from 'startup' to 'investor'
      });

      if (
        !updatedInvestors.find((investor) => investor.investorId === investorId)
      ) {
        updatedInvestors.push({ _id: investorId, status: "Contacted" });
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        interestedInvestors: updatedInvestors,
      }));
      console.log("updated investors: " + updatedInvestors);
      return updatedInvestors;
    });
  };

  const updateInterestedInvestors = async () => {
    const payload = {
      name: formData.name,
      founders: formData.founders,
      aim: formData.aim,
      overview: formData.overview,
      businessPlan: formData.businessPlan,
      projections: formData.projections,
      product: formData.products,
      user: userId,
      interestedInvestors: formData.interestedInvestors,
      summaryOfInvestment: formData.summaryOfInvestment,
    };
    try {
      let response;
      response = await axios.put(
        `https://startup-connect-backend.vercel.app/startup/updateStartup/${startupId}`,
        payload
      );
      console.log("Startup updated successfully", response.data);
      Swal.fire({
        title: "Good job 🥳!",
        text: "Contact List Updated!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating startup:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);
    console.log("Top Half Image:", topHalfImage);
    console.log("Team Image:", teamImage);
    console.log("Products:", formData.products);
    console.log("Startup ID:", startupId);

    // Step 1: Prepare payload
    const payload = {
      name: formData.name,
      founders: formData.founders,
      aim: formData.aim,
      overview: formData.overview,
      businessPlan: formData.businessPlan,
      projections: formData.projections,
      product: formData.products,
      user: userId,
      interestedInvestors: formData.interestedInvestors,
      summaryOfInvestment: formData.summaryOfInvestment,
    };

    try {
      let response;
      if (startupId) {
        response = await axios.put(
          `https://startup-connect-backend.vercel.app/startup/updateStartup/${startupId}`,
          payload
        );
      } else {
        console.log("Registering new startup");
        response = await axios.post(
          "https://startup-connect-backend.vercel.app/startup/registerStartup",
          payload
        );
        setstartupId(response.data._id); // Save the ID of the newly created startup
      }
      if (topHalfImage || teamImage) {
        await handleImageSubmit();
      }

      console.log("Response:", response.data);
      {
        Swal.fire({
          title: "Great 🥳!",
          text: "Startup Information Updated Successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error(
        "There was an error submitting the startup:",
        error.response || error.message || error
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while submitting the form. Please re-check the startup form details added and try again!",
      });
    }
  };

  const handleImageSubmit = async () => {
    const formDataToSend = new FormData();

    if (topHalfImage) formDataToSend.append("logo", topHalfImage);
    if (teamImage) formDataToSend.append("teamImage", teamImage);

    try {
      await axios.put(
        `https://startup-connect-backend.vercel.app/startup/updateStartupImageId/${startupId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Images uploaded successfully");
      {
        Swal.fire({
          title: "Great 🥳!",
          text: "Image uploaded successfully. To save the images please click on the submit button in the startup form!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while submitting uploading the image. Please try again!",
      });
    }
  };

  const handleOnClick = () => {
    setShowForm1(true);
  };
  const closeForm = () => {
    setShowForm1(false);
  };

  const handleOnClickViewStartupDetails = () => {
    console.log("you are in handleOnClickViewStartupDetails function");
    setShowDetails(true);
  };

  const handleViewProfile = () => {
    navigate("/StartupUserProfile", { state: { userId } }); // Navigate to profile page
  };

  const handleNavigateInvestor = (id) => {
    navigate("/investorPage", { state: { id , userId} });
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="startupUserProfile_container">
      <Navbar userId={userId} check={"Startup Profile"} />

      <div className="container">
        <div className="row">
          <div className="profile">
            <div className="top-half">
              <input
                type="file"
                id="imageUpload"
                style={{ display: "none" }}
                onChange={(e) => handleImageChange1(e, setTopHalfImage)}
              />
              <img
                className="camera"
                src={camera}
                alt="Profile Picture"
                onClick={() => document.getElementById("imageUpload").click()}
              />

              <div className="camera-text">Logo</div>
              {
                <img
                  src={
                    topHalfImage ? topHalfImage: ""  // `https://startup-connect-backend.vercel.app/${topHalfImage}` : ""
                  }
                  style={{
                    width: "100%", // Make the image fill the width of its container
                    height: "100%", // Make the image fill the height of its container
                    objectFit: "cover", // Ensure the image covers the container without distortion
                    display: "block", // Remove any unwanted gaps below the image
                  }}
                />
              }
            </div>
          </div>
          <div className="teamImage">
            <input
              type="file"
              id="teamImageUpload"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange2(e, setTeamImage)}
            />
            <img
              className="camera"
              src={camera}
              alt="Team Picture"
              onClick={() => document.getElementById("teamImageUpload").click()}
            />
            <div className="camera-text">Team Image</div>
            <img
              src={teamImage ? teamImage: ""}   //`https://startup-connect-backend.vercel.app/${teamImage}`
              alt="Team Image"
              style={{
                width: "100%", // Make the image fill the width of its container
                height: "100%", // Make the image fill the height of its container
                objectFit: "cover", // Ensure the image covers the container without distortion
                display: "block", // Remove any unwanted gaps below the image
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="actions">
            <button className="linkDescription-item" onClick={handleOnClick}>
              <div className="image">
                <img src={startup} alt="Startup" width="20" />
              </div>
              <span>Add/Edit Your Startup Details</span>
            </button>
            <button
              className="linkDescription-item"
              onClick={handleOnClickViewStartupDetails}
            >
              <div className="image">
                <img src={startup} alt="Startup" width="20" />
              </div>
              <span>View your Startup Details</span>
            </button>
          </div>
        </div>
      </div>
      {showForm1 && (
        <div className={`formContainer1 ${showForm1 ? "active" : ""}`}>
          <form onSubmit={handleSubmit} className="startup-form">
            <h2>Fill up the Start up Information</h2>
            <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
              Startup Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
              Founders of Startup:
            </label>
            <input
              type="text"
              name="founders"
              value={formData.founders}
              onChange={handleInputChange}
              placeholder="Founders"
              required
            />
            <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
              Aim of Startup:
            </label>
            <input
              type="text"
              name="aim"
              value={formData.aim}
              onChange={handleInputChange}
              placeholder="Aim"
              required
            />
            <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
              Overview of Startup:
            </label>
            <input
              type="text"
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              placeholder="Overview"
              required
            />
            <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
              Your Businesss Plan:
            </label>
            <input
              type="text"
              name="businessPlan"
              value={formData.businessPlan}
              onChange={handleInputChange}
              placeholder="Business Plan"
              required
            />
            <label style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}>
              Projections:
            </label>
            <input
              type="text"
              name="projections"
              value={formData.projections}
              onChange={handleInputChange}
              placeholder="Projections"
              required
            />
            <lable>Startup Product:</lable>
            {formData.products.map((product, productIndex) => (
              <div key={productIndex} className="product-section">
                <h3>Product</h3>
                <label
                  style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}
                >
                  Product name:
                </label>
                <input
                  type="text"
                  name="productname"
                  value={product.productname}
                  onChange={(e) => handleInputChange(e, productIndex)}
                  placeholder="Name of your product"
                  required
                />
                <label
                  style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}
                >
                  Product Information:
                </label>
                <input
                  type="text"
                  name="information"
                  value={product.information}
                  onChange={(e) => handleInputChange(e, productIndex)}
                  placeholder="Product information"
                  required
                />
                <label>Product TeamMembers:</label>
                {product.teammembers.map((teammember, teammemberIndex) => (
                  <div key={teammemberIndex} className="teammember-section">
                    <label
                      style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}
                    >
                      TeamMember name:
                    </label>
                    <input
                      type="text"
                      name="teammembername"
                      value={teammember.teammembername}
                      onChange={(e) =>
                        handleInputChange(e, productIndex, teammemberIndex)
                      }
                      placeholder="Name of the team member"
                      required
                    />
                    <label
                      style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}
                    >
                      TeamMember Qualification:
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={teammember.qualification}
                      onChange={(e) =>
                        handleInputChange(e, productIndex, teammemberIndex)
                      }
                      placeholder="Qualification of the team member"
                      required
                    />
                    <label
                      style={{ color: "rgb(234, 200, 47)", fontSize: "1.1em" }}
                    >
                      TeamMember role:
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={teammember.role}
                      onChange={(e) =>
                        handleInputChange(e, productIndex, teammemberIndex)
                      }
                      placeholder="Role of the team member"
                      required
                    />
                    <button
                      type="button"
                      className="deleteTeamMember"
                      onClick={() =>
                        deleteTeamMember(productIndex, teammemberIndex)
                      }
                    >
                      Delete Team Member
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="addTeamMember"
                  onClick={() => addTeamMember(productIndex)}
                >
                  Add Team Member
                </button>
                <button
                  type="button"
                  className="deleteProduct"
                  onClick={() => deleteProduct(productIndex)}
                >
                  Delete Product
                </button>
              </div>
            ))}
            <button
              className="productButton"
              type="button"
              onClick={addProduct}
            >
              Add Product
            </button>
            <select
              name="summaryOfInvestment"
              value={selectedInvestor}
              onChange={handleInvestorChange}
            >
              <option value="" disabled>
                Select the Investors who have invested in your Startup so far
              </option>
              {investors.map((investor, index) => (
                <option key={index} value={investor._id}>
                  {investor.investorName}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="productButton"
              onClick={handleAddInvestor}
            >
              Add Investor
            </button>

            <div>
              {formData.summaryOfInvestment.length > 0 && (
                <div>
                  <h4>Selected Investors:</h4>
                  <ul>
                    {formData.summaryOfInvestment.map((investment, index) => {
                      // Extract the startup ID from the investment object
                      const investorId = investment.investorId;
                      // Find the startup by ID
                      const investor = investors.find(
                        (s) => s._id === investorId
                      );

                      return (
                        <li key={index}>
                          <p
                            onClick={() => handleNavigateInvestor(investor._id)}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {investor
                              ? investor.investorName
                              : "Unknown Investor"}
                          </p>
                          <button
                            type="button"
                            className="removeInvestorButton"
                            onClick={() => handleRemoveInvestor(index)}
                          >
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <button type="submit">Submit</button>
            <button type="button" onClick={() => deleteStartup1()}>
              Delete
            </button>
            <button type="close" onClick={closeForm}>
              Close
            </button>
          </form>
        </div>
      )}
      {showDetails && (
        <div className="startup-details">
          <div className="startupDetailsImage">
            <img src={startup} alt="Startup" width="90" />
          </div>
          <h2>Startup Details</h2>
          <p>
            <strong>Name:</strong> {formData.name}
          </p>
          <p>
            <strong>Founders:</strong> {formData.founders}
          </p>
          <p>
            <strong>Aim:</strong> {formData.aim}
          </p>
          <p>
            <strong>Overview:</strong> {formData.overview}
          </p>
          <p>
            <strong>Business Plan:</strong> {formData.businessPlan}
          </p>
          <p>
            <strong>Projections:</strong> {formData.projections}
          </p>
          <p>
            ____________________________________________________________________________________________________________________________________________________
          </p>
          {formData.products.map((product, index) => (
            <div key={index} className="product123">
              <h3 className="producth3">{index + 1}.Product </h3>
              <p>
                <strong>Product Name:</strong> {product.productname}
              </p>
              <p>
                <strong>Information:</strong> {product.information}
              </p>
              <br></br>
              <h4 className="teamMemberh4">Team Members</h4>
              {product.teammembers.map((member, idx) => (
                <div key={idx} className="teamMembersDiv">
                  <p>
                    <strong>{idx + 1}. Name:</strong> {member.teammembername}
                  </p>
                  <p>
                    <strong>Qualification:</strong> {member.qualification}
                  </p>
                  <p>
                    <strong>Role:</strong> {member.role}
                  </p>
                  <br></br>
                </div>
              ))}
              <p>
                ____________________________________________________________________________________________________________________________________________________
              </p>
            </div>
          ))}
          <label>Investors who have invested in your Startup so far:</label>

          <ul>
            {formData.summaryOfInvestment.map((investor, index) => {
              const investorId = investor.investorId;
              const investor1 = investors.find((i) => i._id == investorId);
              return (
                <li key={index}>
                  <p
                    //onClick={handleNavigateInvestor(investorId)}
                    onClick={() => handleNavigateInvestor(investor1._id)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {investor1 ? investor1.investorName : "Unkown Investor"}
                  </p>
                </li>
              );
            })}
          </ul>
          <label>Investors that have reached out to your Startup:</label>
          <ul>
            {formData.interestedInvestors.map((investment, index) => {
              // Log the investment object for debugging
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
                  <p>
                    {"Status of your interest: " +
                      (investment.status || "Unknown Status")}
                  </p>
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleInterestedInvestorsChanged(investmentId);
                    }}
                  />
                  <label>Contacted</label>
                </li>
              );
            })}
          </ul>

          <button onClick={updateInterestedInvestors}>Submit</button>

          <button className="close-details" onClick={closeDetails}>
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

export default StartupUserProfile;

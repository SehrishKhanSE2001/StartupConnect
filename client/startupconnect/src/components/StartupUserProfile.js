import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styling/startupUserProfile.css';

import more from '../images/more.png';
import home from '../images/home.png';
import search from '../images/search.png';
import edit from '../images/edit.png';
import profile from '../images/profile.png';
import startup from '../images/b.png';
import investor from '../images/investment.png';
import incubator from '../images/incubator.png';
import camera from '../images/camera.png';
import adjust from '../images/adjust.png';
import resize from '../images/remove.png';
import axios from 'axios';


const StartupUserProfile = () => {
  const location = useLocation(); 
  const navigate =useNavigate();
  const { userId } = location.state || {};
  

  const [topHalfImage, setTopHalfImage] = useState(null);
  const [teamImage, setTeamImage] = useState(null);




  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [offsetTop, setOffsetTop] = useState({ x: 0, y: 0 });
  const [backgroundPositionTop, setBackgroundPositionTop] = useState({ x: 0, y: 0 });

  const [isDraggingTeam, setIsDraggingTeam] = useState(false);
  const [offsetTeam, setOffsetTeam] = useState({ x: 0, y: 0 });
  const [backgroundPositionTeam, setBackgroundPositionTeam] = useState({ x: 0, y: 0 });

  const [imageResize, setImageResize] = useState(100);
  const [teamImageResize, setTeamImageResize] = useState(100);
  const topHalfImageRef = useRef(null);
  const teamImageRef = useRef(null);

  const [startupId , setstartupId] = useState(0);

  const [showDetails, setShowDetails] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Submitted Successfully!');

  const [showMoreBar, setShowMoreBar] = useState(false); 

  
useEffect(() => {
  console.log("Hello from useEffect")
  console.log("useEffect triggered with userId:", userId);
  console.log("useEffect triggered with startupId:", startupId);

  const fetchData = async () => {
    console.log("Fetching data for userId:", userId);
    try {
      const response = await axios.get(`http://localhost:3000/startup/getStartupByUserId/${userId}`);
      const data = response.data;
      console.log("Fetched data:", data);

      setFormData({
        name: data.name || '',
        founders: data.founders || '',
        aim: data.aim || '',
        overview: data.overview || '',
        businessPlan: data.businessPlan || '',
        projections: data.projections || '',
        products: data.product || []
      });

      if (data._id) {
        setstartupId(data._id);
      }

      setTopHalfImage(data.logo);
      setTeamImage(data.teamImage);
      
      //added by
      if (topHalfImageRef.current) {
        topHalfImageRef.current.src = data.logo;
      }
      if (teamImageRef.current) {
        teamImageRef.current.src = data.teamImage;
      }

      console.log('IMAGES: topHalfImage:'+data.logo+'  teamImage: '+data.teamImage)
      console.log('IMAGES: topHalfImage:'+topHalfImage+'  teamImage: '+teamImage)
    } catch (error) {
      console.error('Error fetching startup data:', error);
    }
  };

  if (userId) {
    fetchData();
  }
}, [userId, startupId]); // Add startupId here

const handleHomeClick= () =>{
 navigate('/home', {state:{userId}})
}


const handleImageChange1 = (e, setImage) => {
  const file = e.target.files[0];
  if (file) {
    //const fileUrl = URL.createObjectURL(file);
      setImage(file); // Store the file itself   URL.createObjectURL(file)
      
      // Log details of the file
      console.log("File details:");
      console.log("Name:", file.name);
      console.log("Type:", file.type);
      console.log("Size:", file.size);
      console.log("Last Modified:", file.lastModified);
      console.log("File Object:", file);
  }
   console.log("@@@@@@@"+topHalfImage)
};

const handleImageChange2 = (e, setImage) => {
  const file = e.target.files[0];
  if (file) {
   // const fileUrl = URL.createObjectURL(file);
      setImage(file); // Store the file itself   URL.createObjectURL(file)
      
      // Log details of the file
      console.log("File details:");
      console.log("Name:", file.name);
      console.log("Type:", file.type);
      console.log("Size:", file.size);
      console.log("Last Modified:", file.lastModified);
      console.log("File Object:", file);
  }
   console.log("@@@@@@"+teamImage)
};

  const startDragTop = (e) => {
    setIsDraggingTop(true);
    setOffsetTop({
      x: e.clientX - e.target.getBoundingClientRect().left,
      y: e.clientY - e.target.getBoundingClientRect().top,
    });
  };

  const onDragTop = (e) => {
    if (!isDraggingTop) return;
    setBackgroundPositionTop({
      x: e.clientX - offsetTop.x,
      y: e.clientY - offsetTop.y,
    });
  };

  const endDragTop = () => {
    setIsDraggingTop(false);
  };

  const startDragTeam = (e) => {
    setIsDraggingTeam(true);
    setOffsetTeam({
      x: e.clientX - e.target.getBoundingClientRect().left,
      y: e.clientY - e.target.getBoundingClientRect().top,
    });
  };

  const onDragTeam = (e) => {
    if (!isDraggingTeam) return;
    setBackgroundPositionTeam({
      x: e.clientX - offsetTeam.x,
      y: e.clientY - offsetTeam.y,
    });
  };

  const endDragTeam = () => {
    setIsDraggingTeam(false);
  };

  const resizeImage = (setResize) => {
    setResize((prevSize) => prevSize + 10);
  };

  // ------------------------------------------ FORM LOGIC IMPLEMENTED HERE --------------------------------------------------------------
  const [showForm1, setShowForm1] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    founders: '',
    aim: '',
    overview: '',
    businessPlan: '',
    projections: '',
    products: [
      {
        productname: '',
        information: '',
        teammembers: [
          { teammembername: '', qualification: '', role: '' }
        ]
      }
    ]
  });
  

  const handleInputChange = useCallback((e, productIndex = null, teamMemberIndex = null) => {
    const { name, value } = e.target;

    if (productIndex !== null && teamMemberIndex !== null) {
      setFormData(prevFormData => {
        const updatedProducts = [...prevFormData.products];
        updatedProducts[productIndex].teammembers[teamMemberIndex][name] = value;
        return { ...prevFormData, products: updatedProducts };
      });
    } else if (productIndex !== null) {
      setFormData(prevFormData => {
        const updatedProducts = [...prevFormData.products];
        updatedProducts[productIndex][name] = value;
        return { ...prevFormData, products: updatedProducts };
      });
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  }, []);

  const addProduct = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      products: [
        ...prevFormData.products,
        { productname: '', information: '', teammembers: [{ teammembername: '', qualification: '', role: '' }] }
      ]
    }));
  };

  const addTeamMember = (index) => {
    setFormData(prevFormData => {
      const updatedProducts = [...prevFormData.products];
      updatedProducts[index].teammembers.push({ teammembername: '', qualification: '', role: '' });
      return { ...prevFormData, products: updatedProducts };
    });
  };
 
  const deleteProduct = (index) => {
    setFormData(prevFormData => {
      const updatedProducts = [...prevFormData.products];
      updatedProducts.splice(index, 1);
      return { ...prevFormData, products: updatedProducts };
    });
  };

  const deleteTeamMember = (productIndex, teamMemberIndex) => {
    
    setFormData(prevFormData => {
      const updatedProducts = [...prevFormData.products];
      updatedProducts[productIndex].teammembers.splice(teamMemberIndex, 1);
      return { ...prevFormData, products: updatedProducts };
    });
  };
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form Data:', formData);
    console.log('Top Half Image:', topHalfImage);
    console.log('Team Image:', teamImage);
    console.log('Products:', formData.products);
    console.log('Startup ID:', startupId);

    // Step 1: Prepare payload
    const payload = {
        name: formData.name, 
        founders: formData.founders, 
        aim: formData.aim, 
        overview: formData.overview, 
        businessPlan: formData.businessPlan, 
        projections: formData.projections, 
        product: formData.products, 
        user: userId
    };

    try {
        let response;
        if (startupId) {
          console.log("***************You are in the hdnle submit function of topHlafImage || teamImage*************"+topHalfImageRef.current.src+"******"+teamImageRef.current.src)
          console.log("***************You are in the hdnle submit function of topHlafImage || teamImage*************"+topHalfImage+"******"+teamImage)
            console.log("Updating existing startup with ID:", startupId);
            response = await axios.put(`http://localhost:3000/startup/updateStartup/${startupId}`, payload);
            
          
        } else {
            console.log("Registering new startup");
            response = await axios.post('http://localhost:3000/startup/registerStartup', payload);
            setstartupId(response.data._id); // Save the ID of the newly created startup
         
        }
        if(topHalfImage || teamImage)
          { 
            console.log("***************You are in the hdnle submit function of topHlafImage || teamImage*************")
            await handleImageSubmit()
          }

        console.log('Response:', response.data);
        // Handle successful response (e.g., show a success message, redirect to another page, etc.)
        alert('Form submitted successfully!');
      
    } catch (error) {
        console.error('There was an error submitting the startup:', error.response || error.message || error);
        // Handle error (e.g., show an error message)
    }
    alert('There was an error submitting the form. Please try again.');
};




  const handleImageSubmit = async () => {
    const formDataToSend = new FormData();
    if (topHalfImage) formDataToSend.append('logo', topHalfImage);
    if (teamImage) formDataToSend.append('teamImage', teamImage);
    
    try {
      await axios.put(
        `http://localhost:3000/startup/updateStartupImageId/${startupId}`, 
        formDataToSend, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };
  
  
  
  const handleOnClick = () => { setShowForm1(true) }
  const closeForm=()=>{setShowForm1(false)}
  
  const handleOnClickViewDetails = () => {
    setShowDetails(true);
  };

  const handleMoreClick = () => {
    setShowMoreBar(!showMoreBar); // Toggle the bar visibility
  };


  const handleViewProfile = () => {
    navigate('/StartupUserProfile', { state: { userId } }); // Navigate to profile page
  };

   
  const closeDetails = () => {
    setShowDetails(false);
  };

  
  
  return (
    <div className='generalProfile_container'>
      <div className="search-bar">
        <div className="icons">
          <img className="homeIcon" src={home} alt="Home" onClick={handleHomeClick}/>
          <img src={more} alt="More" onClick={() => handleMoreClick()} />
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="profile">
            <div
              src={topHalfImage}
              ref={topHalfImageRef}
              className="top-half"
              style={{
                backgroundImage: topHalfImage ? `url(${topHalfImage})` : 'none',
                backgroundSize: `${imageResize}%`,
                backgroundPosition: `${backgroundPositionTop.x}px ${backgroundPositionTop.y}px`,
                backgroundRepeat: 'no-repeat'
              }}
              onMouseDown={startDragTop}
              onMouseMove={onDragTop}
              onMouseUp={endDragTop}
              onMouseLeave={endDragTop}
            >
              <input type='file' id='imageUpload' style={{ display: 'none' }} onChange={(e) => handleImageChange1(e, setTopHalfImage)} />
              <img className="camera" src={camera} alt="Profile Picture" onClick={() => document.getElementById('imageUpload').click()} />
              <img className='resize' src={resize} alt='Resize' width='20' onClick={() => resizeImage(setImageResize)} />
              <img className="edit-icon2" src={edit} alt="Edit" width="20" />
            </div>
            <div className="bottom-half">
              <div className="details">
                <div className="row">
                  <p><span className="label">From:</span> <span className="value">Pakistan</span></p>
                </div>
                <div className="row">
                  <p><span className="label">Joined at:</span></p>
                  <p><span className="date">Date</span></p>
                </div>
              </div>
            </div>
          </div>
          <div className="teamImage"
            src={teamImage}
            ref={teamImageRef}
            style={{
              backgroundImage: teamImage ? `url(${teamImage})` : 'none',
              backgroundSize: `${teamImageResize}%`,
              backgroundPosition: `${backgroundPositionTeam.x}px ${backgroundPositionTeam.y}px`,
              backgroundRepeat: 'no-repeat'
            }}
            onMouseDown={startDragTeam}
            onMouseMove={onDragTeam}
            onMouseUp={endDragTeam}
            onMouseLeave={endDragTeam}
          >
            <input type='file' id='teamImageUpload' style={{ display: 'none' }} onChange={(e) => handleImageChange2(e, setTeamImage)} />
            <img className="camera" src={camera} alt="Team Picture" onClick={() => document.getElementById('teamImageUpload').click()} />
            <img className='resize' src={resize} alt='Resize' width='20' onClick={() => resizeImage(setTeamImageResize)} />
            <img className="edit-icon2" src={edit} alt="Edit" width="20" />
          </div>
        </div>
        <div className="row">
          <div className="actions">
            <button className="linkDescription-item" onClick={handleOnClick}>
              <div className="image"><img src={startup} alt="Startup" width="20" /></div>
              <span>Add/Edit Your Startup Details</span>
            </button>
            <button className="linkDescription-item" onClick={handleOnClickViewDetails}>
              <div className="image"><img src={startup} alt="Startup" width="20" /></div>
              <span>View your Startup Details</span>
            </button>
          </div>
        </div>
      </div>
      {
        showForm1 &&
        (
          <div className={`formContainer1 ${showForm1 ? 'active' : ''}`}>
            <form onSubmit={handleSubmit} className='startup-form'>
              <h2>Fill up the Start up Information</h2>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="founders"
                value={formData.founders}
                onChange={handleInputChange}
                placeholder="Founders"
                required
              />
              <input
                type="text"
                name="aim"
                value={formData.aim}
                onChange={handleInputChange}
                placeholder="Aim"
                required
              />
              <input
                type="text"
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                placeholder="Overview"
                required
              />
              <input
                type="text"
                name="businessPlan"
                value={formData.businessPlan}
                onChange={handleInputChange}
                placeholder="Business Plan"
                required
              />
              <input
                type="text"
                name="projections"
                value={formData.projections}
                onChange={handleInputChange}
                placeholder="Projections"
                required
              />
               {formData.products.map((product, productIndex) => (
                <div key={productIndex} className="product-section">
                  <h3>Product</h3>
                  <input
                    type="text"
                    name="productname"
                    value={product.productname}
                    onChange={(e) => handleInputChange(e, productIndex)}
                    placeholder="Name of your product"
                    required
                  />
                  <input
                    type="text"
                    name="information"
                    value={product.information}
                    onChange={(e) => handleInputChange(e, productIndex)}
                    placeholder="Product information"
                    required
                  />
                  {product.teammembers.map((teammember, teammemberIndex) => (
                    <div key={teammemberIndex} className="teammember-section">
                      <input
                        type="text"
                        name="teammembername"
                        value={teammember.teammembername}
                        onChange={(e) => handleInputChange(e, productIndex, teammemberIndex)}
                        placeholder="Name of the team member"
                        required
                      />
                      <input
                        type="text"
                        name="qualification"
                        value={teammember.qualification}
                        onChange={(e) => handleInputChange(e, productIndex, teammemberIndex)}
                        placeholder="Qualification of the team member"
                        required
                      />
                      <input
                        type="text"
                        name="role"
                        value={teammember.role}
                        onChange={(e) => handleInputChange(e, productIndex, teammemberIndex)}
                        placeholder="Role of the team member"
                        required
                      />
                      <button type="button" className="deleteTeamMember" onClick={() => deleteTeamMember(productIndex, teammemberIndex)}>Delete Team Member</button>
                    </div>
                  ))}
                  <button type="button" className="addTeamMember" onClick={() => addTeamMember(productIndex)}>Add Team Member</button>
                  <button type="button" className="deleteProduct" onClick={() => deleteProduct(productIndex)}>Delete Product</button>
                </div>
              ))}
              <button className="productButton" type="button" onClick={addProduct}>Add Product</button>
              <button type="submit">Submit</button>
              <button type="close" onClick={closeForm}>Close</button>
            </form>
          </div>
        )
      }
           {showDetails && (
        <div className="startup-details">
          {/* <button className="close-details" onClick={closeDetails}>Close</button> */}
          <div className="startupDetailsImage"><img src={startup} alt="Startup" width="90" /></div>
          <h2>Startup Details</h2>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Founders:</strong> {formData.founders}</p>
          <p><strong>Aim:</strong> {formData.aim}</p>
          <p><strong>Overview:</strong> {formData.overview}</p>
          <p><strong>Business Plan:</strong> {formData.businessPlan}</p>
          <p><strong>Projections:</strong> {formData.projections}</p>
          <p>____________________________________________________________________________________________________________________________________________________</p>
          {formData.products.map((product, index) => (
            <div key={index} className='product123'>
              <h3 className="producth3">{index + 1}.Product </h3>
              <p><strong>Product Name:</strong> {product.productname}</p>
              <p><strong>Information:</strong> {product.information}</p>
              <br></br>
              <h4 className="teamMemberh4">Team Members</h4>
              {product.teammembers.map((member, idx) => (
                <div key={idx} className='teamMembersDiv'>
                  <p><strong>{idx+1}. Name:</strong> {member.teammembername}</p>
                  <p><strong>Qualification:</strong> {member.qualification}</p>
                  <p><strong>Role:</strong> {member.role}</p>
                  <br></br>
                </div>
              ))}
              <p>____________________________________________________________________________________________________________________________________________________</p>
            </div>
          ))
          
          }
          <button className="close-details" onClick={closeDetails}>Close</button>
        </div>
        
      )}
         
         {showMoreBar && (
          <div className="moreBar">
              <div className="moreBarContent">
                 <img src={profile} alt="Profile" />
                  <button onClick={handleViewProfile}>Profile</button>
               </div>
            {/* Add more options here if needed */}
            </div>
         )}
    </div>
  );
};

export default StartupUserProfile;


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=============================================================================

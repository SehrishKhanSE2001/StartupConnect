import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styling/investorUserProfile.css';

import more from '../images/more.png';
import home from '../images/home.png';
import investor from '../images/investment.png';
import profile from '../images/profile.png';
import camera from '../images/camera.png';
import axios from 'axios';
import edit from '../images/edit.png'

const InvestorUserProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // const { userId, investorId: locationInvestorId } = location.state || {};
    const { userId}= location.state || {};
    const [investorFormData, setInvestorFormData] = useState({
        investorName: '',
        logo: '',
        investorType: '',
        summaryOfInvestment:[],
        totalInvestmentsMade: 0,
        totalAmountInvested: 0,
        totalReturns: 0,
        startupsApproached:[],
        recentActivity: '',
        receiveMessage: '',
        user: userId
    });
    //const [investorId, setInvestorId] = useState(locationInvestorId || null);
    const [investorId, setInvestorId] = useState(0);
    const [showInvestorFormData, setShowInvestorFormData] = useState(false);
    const [showinvestorDetails, setInvestorDetails]=useState(false);
    const [startups, setStartups] = useState([]); // Initialize as an empty array
    const [showMoreBar, setShowMoreBar] = useState(false);
    const [selectedStartup, setSelectedStartup] = useState('');
    useEffect(() => {
        console.log('This is the useEffect that fetches all the startups');
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/startup/getAllStartups`);
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
                const response = await axios.get(`http://localhost:3000/investor/getInvestorByUserId/${userId}`);
                const data = response.data.Investor;
                console.log("Fetched data:", data);
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"+data._id)
                setInvestorId(data._id)
                
                setInvestorFormData({
                    investorName: data.investorName || '',
                    logo: data.logo || '',
                    investorType: data.investorType || '',
                    summaryOfInvestment: data.summaryOfInvestment || '',
                    totalInvestmentsMade: data.totalInvestmentsMade || 0,
                    totalAmountInvested: data.totalAmountInvested || 0,
                    totalReturns: data.totalReturns || 0,
                    startupsApproached: data.startupsApproached || [],
                    recentActivity: data.recentActivity || '',
                    receiveMessage: data.receiveMessage || '',
                    user: data.user || ''
                });
                
            } catch (error) {
                console.error('Error fetching investor data:', error);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [investorId]);  //userId, investorId

  

    const handleHomeClick = () => {
        navigate('/home', { state: { userId , investorId} });
    };

    const handleMoreClick = () => {
        setShowMoreBar(!showMoreBar); // Toggle the bar visibility
    };

    const handleViewProfile = (id) => {
        navigate('/startupPage', { state:{ id:id, userId , investorId:investorId }}); // Navigate to profile page
    };

    const handleNavigate = (startupId) => {
        
            navigate('/startupPage', { state: { id: startupId, userId, check:'InvestorUserProfile', investorId: investorFormData._id } });
        
    };
    
    
    const handleOnClick = () => {
        setShowInvestorFormData(true);
    };
    
    const ViewInvestorDetails=()=>{
        setInvestorDetails(true);
        console.log("{{"+showinvestorDetails)
    }
   
   
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setInvestorFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value
      }));
  };

  const handleStartupChange = (e) => {
    const value = e.target.value;
    setSelectedStartup(value);
};

const handleAddStartup = () => {
    if (selectedStartup && !investorFormData.summaryOfInvestment.includes(selectedStartup)) {
        setInvestorFormData((prevFormData) => ({
            ...prevFormData,
            summaryOfInvestment: [...prevFormData.summaryOfInvestment, selectedStartup]
        }));
        setSelectedStartup('');
    }
};

const handleRemoveStartup = (startupToRemove) => {
    setInvestorFormData((prevFormData) => ({
        ...prevFormData,
        summaryOfInvestment: prevFormData.summaryOfInvestment.filter(startup => startup !== startupToRemove)
    }));
};

const handleDelete=async()=>{
  if (window.confirm('Are you sure you want to delete this investor?')){
    try{
      console.log("^^^^^^^^^^^^^^^^^^^^^^"+investorId)
      await axios.delete(`http://localhost:3000/investor/deleteInvestor/${investorId}`)
      alert('invester deleted successfully!')
    }catch(error)
    {
      console.log("Error deleting investor");
      alert('Sorry for your incovenience! There is an error deleting the investor!')

    }
  }
}

const handleAddLogo = () => {
    const logoInput = document.getElementById('logoUpload');
    logoInput.click();
    console.log("logoInput : "+logoInput)
};



const handleLogoChange = async (e) => {
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
                user: userId
            };  
    //         console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+investorFormData.logo)
    // const file = e.target.files[0];

    const file = e.target.files[0];
    console.log("this is e.target.files[0] : "+file)
    if (file) {
        // Display confirmation dialog
        const confirmed = window.confirm('Are you sure you want to add this logo?');
        if (confirmed) {
            const formData = new FormData();
            formData.append('logo', file);
            formData.append('user',userId)
            console.log('formData.logo: '+formData.logo)

            try {
                if (investorId) {
                    // Update existing investor
                    console.log("Updating existing investorId:", investorId);

                    // Upload the file
                    await axios.post(`http://localhost:3000/investor/uploadInvestor/${investorId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    // Update the logo in the form data
                    setInvestorFormData((prevFormData) => ({
                        ...prevFormData,
                        logo: URL.createObjectURL(file)
                    }));

                    // Optionally: Call handleSubmit to save changes
                    await handleSubmit(new Event('submit'));

                } else {
                    console.log("Creating new investor");
                    let response = await axios.post('http://localhost:3000/investor/addInvestor', formData);

                    // Save the ID of the newly created investor
                    setInvestorId(response.data._id);

                    // Optionally: Update the logo
                    setInvestorFormData((prevFormData) => ({
                        ...prevFormData,
                        logo: URL.createObjectURL(file)
                    }));

                    alert('Investor added and logo updated successfully!');
                }
            } catch (error) {
                console.error('Error updating logo:', error);
                alert('There was an error updating the logo. Please try again.');
            }
        }
    }
};


    const closeForm = () => {
        setShowInvestorFormData(false);
    };
    const closeDetailsForm=()=>{
        setInvestorDetails(false);
    }
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
          user: userId
      };
  
      console.log('Payload:', JSON.stringify(payload, null, 2));
      try {
          let response;
          if (investorId) {
              console.log("Updating existing investorId:", investorId);
              response = await axios.put(`http://localhost:3000/investor/updateInvestor/${investorId}`, payload);
          } else {
              console.log("Registering new investor");
              response = await axios.post('http://localhost:3000/investor/addInvestor', payload);
              console.log("++++++++++++++++++++++++++++++++++++++"+response.data)
              setInvestorId(response.data._id); // Save the ID of the newly created investor
              console.log("-------------------------------------------"+investorId)

              // Wait for the state update to be processed
            await new Promise(resolve => setTimeout(resolve, 0));
          }
          console.log('Response:', response.data);
          alert('Form submitted successfully!');
      } catch (error) {
          console.error('Error details:', error);
          if (error.response) {
              console.error('Error Response Data:', error.response.data);
              console.error('Error Response Status:', error.response.status);
              console.error('Error Response Headers:', error.response.headers);
          } else if (error.request) {
              console.error('Error Request:', error.request);
          } else {
              console.error('General Error:', error.message);
          }
          alert('There was an error submitting the form. Please try again.');
      }
  };
  

    return (
        <div className='investorUserProfile-container'>
            <div className="search-bar">
                <div className="icons">
                    <img className="homeIcon" src={home} alt="Home" onClick={handleHomeClick} />
                    <img src={more} alt="More" onClick={() => handleMoreClick()} />
                </div>
            </div>
            <div className="investorLogo">
                   {investorFormData.logo ? (
                     <img src={`http://localhost:3000/${investorFormData.logo}`} alt="Investor Logo" /> 
                      ) : (
                    <img src={camera} alt="Upload Logo" onClick={handleAddLogo} />
                    )}
                    
               <input
                type="file"
                id="logoUpload"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleLogoChange}
                />
                <img 
                src={edit} 
                className='EditInvestorLogo'
                style={{
                 width: '20px',
                 height: '20px',
                 marginBottom:'350px',
                 marginRight:'-15px',
                 cursor: 'pointer',
                 transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                 }} 
                 alt="Edit Investor Logo"
                 onClick={handleAddLogo}
                />

            </div>



                <div className="investorButtons-row">
                    <div className="actions">
                        <div className="actions-investorButtons">
                        <button className="investorButton" onClick={handleOnClick}>
                            <div className="image"><img src={investor} alt="Startup" width="20" /></div>
                            <span>Add/Edit Your Investor Details</span>
                        </button>
                        <button className="investorButton" onClick={ViewInvestorDetails}>
                            <div className="image"><img src={investor} alt="Startup" width="20" /></div>
                            <span>View your Investor Details</span>
                        </button>
                        </div>
                    </div>
                </div>
            {/* </div> */}
            {showInvestorFormData && (
                <div className={`investorFormContainer ${showInvestorFormData ? 'active' : ''}`}>
                    <form onSubmit={handleSubmit} className='investor-form'>
                        <h2>Fill up the Investor Information</h2>
                        <input
                            type="text"
                            name="investorName"
                            value={investorFormData.investorName}
                            onChange={handleInputChange}
                            placeholder="Name"
                            required
                        />
                        <div className='select-button-container'>
                        <select
                            name='investorType'
                            value={investorFormData.investorType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Select your investor Type</option>
                            <option value="Individual">Individual</option>
                            <option value="Venture Capital Firm">Venture Capital Firm</option>
                            <option value="Private Equity Firm">Private Equity Firm</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Government Agency">Government Agency</option>
                            <option value="Crowdfunding">Crowdfunding</option>
                            <option value="Institutional Investor">Institutional Investor</option>
                        </select>
                        <select
                            name='summaryOfInvestment'
                            value={selectedStartup}
                            onChange={handleStartupChange}
                        >
                            <option value="" disabled>Select your invested startups</option>
                            {startups.map((startup, index) => (
                                <option key={index} value={startup._id}>
                                    {startup.name}
                                </option>
                            ))}
                        </select>
                        </div>
                        <button type="button" className="addStartup"onClick={handleAddStartup} style={{width:'150px', padding:'8px',marginLeft:'810px',fontSize:'0.9em'}} >Add Startup</button>
                        <div>
                            {investorFormData.summaryOfInvestment.length > 0 && (
                                <div>
                                    <h4>Selected Startups:</h4>
                                    <ul>
                                        {investorFormData.summaryOfInvestment.map((startupId, index) => (
                                            <li key={index}>
                                                {startups.find(s => s._id === startupId)?.name || startupId}
                                                <button type="button" onClick={() => handleRemoveStartup(startupId)}>
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <label className="number-description-item">Total Investments made</label>
                        <input
                            type="number"
                            name='totalInvestmentsMade'
                            value={investorFormData.totalInvestmentsMade}
                            onChange={handleInputChange}
                            placeholder="Total investments made"
                            required
                        />
                        <label className="number-description-item">Total Amount Invested</label>
                        <input
                            type="number"
                            name="totalAmountInvested"
                            value={investorFormData.totalAmountInvested}
                            onChange={handleInputChange}
                            placeholder="Total amount invested"
                            required
                        />
                        <label className="number-description-item">Total Returns gained</label>
                        <input
                            type="number"
                            name="totalReturns"
                            value={investorFormData.totalReturns}
                            onChange={handleInputChange}
                            placeholder="Total returns"
                            required
                        />
                        <label className="number-description-item">Recent Activity</label>
                        <input
                            type="text"
                            name="recentActivity"
                            value={investorFormData.recentActivity}
                            onChange={handleInputChange}
                            placeholder="Recent Activity"
                            required
                        />
                        <button type="submit">Submit</button>
                        <button type='button' className="delete-investor" onClick={handleDelete}>Delete</button>
                        <button type="button" className="close-investor-details" onClick={closeForm}>Close</button>
                    </form>
                </div>
            )}


    {/* { showinvestorDetails && (
        <div className="investor-details">
          <div className="investorDetailsImage"><img src={investor} alt="Investor" width="90" /></div>
          <h2>Investor Details</h2>
          <p><strong>Name:</strong> {investorFormData.investorName}</p>
          <p><strong>Investor Type:</strong> {investorFormData.investorType}</p>
          <p><strong>Summary Of Investments:</strong> {investorFormData.summaryOfInvestment}</p>
          <p><strong>Total Investments Made:</strong> {investorFormData.totalInvestmentsMade}</p>
          <p><strong>Total Returns obtained:</strong> {investorFormData.totalReturns}</p>
          <p><strong>Startups Approached:</strong> {investorFormData.startupsApproached}</p>
          <p>_________________________________________________________________</p>
       
          <button className="close-investorDetails" onClick={closeDetailsForm}>Close</button>
        </div>
        
      )} */}

{showinvestorDetails && (
    <div className="investor-details">
        <div className="investorDetailsImage"><img src={investor} alt="Investor" width="90" /></div>
        <h2>Investor Details</h2>
        <p><strong>Name:</strong> {investorFormData.investorName}</p>
        <p><strong>Investor Type:</strong> {investorFormData.investorType}</p>
        
        {/* Summary of Investments */}
        <p><strong>Summary Of Investments:</strong></p>
        <ul>
            {/* {investorFormData.summaryOfInvestment.map(startup => (
                <li key={startup._id}>
                    <p onClick={handleNavigate(startup._id)} style={{ cursor: 'pointer', color: 'blue' }}>
                        {startup.name}
                    </p>
                </li>
            ))} */}
            {investorFormData.summaryOfInvestment.map((startupId, index) => (
                                            <li key={index}>
                                                {/* {startups.find(s => s._id === startupId)?.name || startupId} */}
                                                <p 
                                    onClick={() => handleNavigate(startupId)} 
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                >
                                    {startups.find(s => s._id === startupId)?.name || startupId}
                                </p>
                                            </li>
                                        ))}
        </ul>
        
        <p><strong>Total Investments Made:</strong> {investorFormData.totalInvestmentsMade}</p>
        <p><strong>Total Returns obtained:</strong> {investorFormData.totalReturns}</p>
        <p><strong>Startups Approached:</strong> {investorFormData.startupsApproached.length}</p>
        <p>_________________________________________________________________</p>
       
        <button className="close-investorDetails" onClick={closeDetailsForm}>Close</button>
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
}

export default InvestorUserProfile;


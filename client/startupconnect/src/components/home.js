import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "../styling/home.css";
import more from "../images/more.png";
import home from "../images/home.png";
import search from "../images/search.png";
import startup from "../images/startup2.png";
import investor from "../images/investment.png";
import incubator from "../images/incubator.png";
import arrange from "../images/arrange.png";
import rocket from "../images/kids_rocket.png";
import bulb from "../images/b.png";
import techStartup from "../images/technological_startups.jpg";
import techInvestment from "../images/techInvestment2.png";
import techInvestment3 from "../images/technological_investment.jpeg";
import profile from "../images/profile.png"

const CurveSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const [startup_id, setStartup_id] = useState(null);
  const [startupsInfo, setStartupsInfo] = useState([]);
  const [sortedStartups, setSortedStartups] = useState([]);
  const [startupImageClicked , setstartupImageClicked]=useState(true);
  const [investorImageClicked , setinvestorImageClicked]=useState(false);
  const [investorInfo, setinvestorInfo] = useState([]);
  const [investorId1 , setinvestorId1]=useState(null);
  const [initialRender, setInitialRender] = useState(false);
  const [showMoreBar, setShowMoreBar] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const location=useLocation();
  //const {userId , investorId}=location.state || {};
  const {userId}=location.state || {};

  console.log("USER ID MY ASS: "+userId)
  //console.log("Investor ID MY ASS: "+investorId)


  const handleStartupImageClicked=()=>{
    setstartupImageClicked(true);
    setinvestorImageClicked(false);
  }
  const handleInvestorImageClicked=()=>{
   setinvestorImageClicked(true);
   setstartupImageClicked(false);
  }

  const handleMoreClick = () => {
    setShowMoreBar(!showMoreBar); // Toggle the bar visibility
  };

  const handleViewProfile = () => {
    navigate('/StartupUserProfile', { state: { userId } }); // Navigate to profile page
  };


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/startup/getAllStartups');
        setStartupsInfo(response.data);
        setSortedStartups(response.data); // Initialize sortedStartups with fetched data
      } catch (error) {
        console.error('Error fetching startup data:', error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, [initialRender,startupImageClicked]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/investor/getAllInvestors');
        setinvestorInfo(response.data);
        // setsortedStartups(response.data); // Initialize sortedStartups with fetched data
      } catch (error) {
        console.error('Error fetching investor data:', error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, [investorImageClicked]);

  const startupRedirect = (id) => {
    console.log("Redirecting with ID:", id);
    setStartup_id(id);
  };
  const investorRedirect =(investor_id)=>{
    setinvestorId1(investor_id);
    navigate('/investorPage', { state: { id: investor_id, userId , check:'home'} });
  }

  useEffect(() => {
    if (startup_id !== null) {
      console.log("This is the updated startupId:---------------------------" + startup_id);
      
      const fetchData2 = async () => {
        try {
          console.log("You are in fetchData2 function::----------");

          // Fetch the startup data
          const response = await axios.get(`http://localhost:3000/startup/getStartupId/${startup_id}`);
          console.log("This is response.data.mostViewed before updating it: " + response.data.mostViewed);

          // Update the mostViewed count locally
          const updatedData = { ...response.data, mostViewed: response.data.mostViewed + 1 };
          console.log("This is response.data.mostViewed after updating the value: " + updatedData.mostViewed);

          // Send the updated data to the server
          await axios.put(`http://localhost:3000/startup/updateStartup/${startup_id}`, updatedData);
          
          // Navigate to the startup page
          navigate('/startupPage', { state: { id: startup_id, userId , check:'home' } });
        } catch (error) {
          console.log("Error fetching or updating startup:", error);
        }
      };

      fetchData2();
    }
  }, [startup_id, navigate]);

  const handleSort = () => {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    const sorted = [...startupsInfo].sort((a, b) => b.mostViewed - a.mostViewed);
    setSortedStartups(sorted);
  };

  const handleHomeClick = () => {
    navigate('/home' , {state:{userId}});
  }
  
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredStartups = startupsInfo.filter(startup =>
        startup.name.toLowerCase().includes(query)
      );
      setSortedStartups(filteredStartups);
    } else {
      setSortedStartups(startupsInfo);
    }
  };
  
  const handleSearch = () => {
    if (searchQuery) {
      const filteredStartups = startupsInfo.filter(startup =>
        startup.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSortedStartups(filteredStartups);
    } else {
      setSortedStartups(startupsInfo); // Show all startups if no query
    }
  };
  


  return (
    <section style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '400px',
      padding: '50px 2vw',
      background: '#f9d03c',
      color: 'white',
      fontFamily: 'Prompt, sans-serif',
    }}>
      <div className="home_container">
        <div className="search-bar">
          <div className="search-bar-input">
          { <input
            type="text"
            placeholder="Search"
            value={searchQuery} // Bind the search query to the input
            onChange={handleSearchChange} // Handle changes to the input 
          /> }
          <img className="search-icon" src={search} alt='Search' onClick={handleSearch}/>
          </div>
        <div className="image1Container">
          <div className="icons">
            <img src={arrange} alt="arrange" onClick={() => handleSort()} />
            <img src={startup} alt="startup" onClick={() => handleStartupImageClicked()}/>
            <img src={investor} alt="startup" onClick={() => handleInvestorImageClicked()}/>
            <img src={home} alt="Home" onClick={() => handleHomeClick()}/>
            <img src={more} alt="More" onClick={() => handleMoreClick()} />
          </div>
          </div>
        </div>

        {showMoreBar && (
  <div className="moreBar">
    <div className="moreBarContent">
      <img src={profile} alt="Profile" />
      <button onClick={handleViewProfile}>Profile</button>
    </div>
    {/* Add more options here if needed */}
  </div>
)}

        
        <div className="description">
          <div className="briefIntro">
            <p className="title1">StartupConnect</p>
            <img className="bulb" src={bulb} alt="Bulb" />
            <p className="miniDescription1">
              This platform connects startup founders with potential investors and
              incubation centers. Here, startups can find the funding they need to
              grow and innovate, while investors can discover promising ventures
              to support. Additionally, startups can access valuable resources
              from incubation centers, such as workspace, mentorship, and
              networking opportunities. Whether you're seeking investment or
              looking to invest, this platform fosters meaningful connections to
              drive success and innovation.
            </p>
          </div>
          <div className="briefIntroRocket">
            <img className="rocket" src={rocket} alt="Rocket" />
          </div>
        </div>

        <div className="gridExample">
          <div className="gridRow">
            <div className="image-container">
              <img src={techStartup} alt="Tech Startup" />
              <a href="https://startupstore.info/collections/magazines" className="image-link">Check out the latest magazines of new Startup!</a>
            </div>
            <div className="image-container">
              <img src={techInvestment} alt="Tech Investment" />
              <a href="https://www.investmentmagazine.com.au/" className="image-link">Check out the latest investments magazines!</a>
            </div>
            <div className="image-container">
              <img src={techInvestment3} alt="Tech Investment 3" />
              <a href="https://www.pwc.co.nz/insights-and-publications/2023-publications/startup-investment-magazine-spring-2023.html" className="image-link">Check out the latest magazines!</a>
            </div>
          </div>
        </div>

        {/* <div
          className={`startupLine ${isVisible ? 'animate' : ''}`}
          ref={elementRef}
        >
          <p>Find Startup!</p>
        </div> */}

        {/* <div className="flexContainer">
          {sortedStartups.length === 0 ? (
            <p>No startups available.</p>
          ) : (
            sortedStartups.map((startup, index) => (
              <div className="flexBox" key={index}>
                {startup.logo && (
                  <img
                    src={`http://localhost:3000/${startup.logo}`}
                    alt="Logo"
                    className="logo-image"
                  />
                )}
                <h3>{startup.name}</h3>
                <button onClick={() => {startupRedirect(startup._id)}}>View Startup</button>
              </div>
            ))
          )}
        </div> */}
        

        {/* <div className="flexContainer">
  {investorImageClicked && investorInfo.length === 0 ? (
    <p>No investors available.</p>
  ) : (
    investorInfo.map((investor, index) => (
      <div className="flexBox" key={index}>
        {investor.logo && (
          <img
            src={`http://localhost:3000/${investor.logo}`}
            alt="Logo"
            className="logo-image"
          />
        )}
        <h3>{investor.name}</h3>
        <button onClick={() => startupRedirect(investor._id)}>View Investor</button>
      </div>
    ))
  )}
</div> */}

                          {/* Conditional rendering for startups and investors */}
        {startupImageClicked && (
          <div>
              <div
               className={`startupLine ${isVisible ? 'animate' : ''}`}
               ref={elementRef}
               >
              <p className='Title'>Find Startups!</p>
          </div>
            <div className="flexContainer">
              {sortedStartups.length === 0 ? (
                <p>No startups available.</p>
                 ) : (
                  sortedStartups.map((startup, index) => (
                  <div className="flexBox" key={index}>
                    {startup.logo && (
                      <img
                       src={`http://localhost:3000/${startup.logo}`}
                       alt="Logo"
                       className="logo-image"
                      />
                    )}
                    <h3>{startup.name}</h3>
                    <button onClick={() => {startupRedirect(startup._id)}}>View Startup</button>
            </div>
            ))
          )}
            </div>
          </div>
        )}

        {investorImageClicked && (
          <div>
             <div
              className={`startupLine ${isVisible ? 'animate' : ''}`}
              ref={elementRef}
              >
              <p className='Title'>Find Investors!</p>
          </div>
            <div className="flexContainer">
              {investorInfo.map((investor) => (
                <div key={investor._id} className="flexBox">
                   {investor.logo && (
                  <img
                    src={`http://localhost:3000/${investor.logo}`}
                    alt="Logo"
                    className="logo-image"
                    style={{ height: '250px' }}
                  />
                )}
                <h3
  style={{
    margin: 0,
    fontSize: '1.2rem',
    color: 'black',
    marginTop: '240px',
    fontFamily: '"Poiret One", sans-serif'
  }}
>
  {investor.investorName}
</h3>
<button onClick={() => {investorRedirect(investor._id)}}>View Investor</button>
                </div>
              ))}
            </div>
          </div>
        )}



      </div>
      <div style={{
        position: 'absolute',
        height: '250px',
        width: '100%',
        bottom: 0,
      }}>
        <div style={{
          content: '""',
          display: 'block',
          position: 'absolute',
          borderRadius: '70% 54%',
          width: '52%',
          height: '94%',
          backgroundColor: '#FFFFFF',
          transform: 'translate(92%, 60%)',
        }}></div>
        <div style={{
          content: '""',
          display: 'block',
          position: 'absolute',
          borderRadius: '100% 50%',
          width: '53%',
          height: '102%',
          backgroundColor: '#f9d03c',
          transform: 'translate(-4%, 40%)',
          zIndex: -1,
        }}></div>
      </div>
    </section>
  );
};

export default CurveSection;


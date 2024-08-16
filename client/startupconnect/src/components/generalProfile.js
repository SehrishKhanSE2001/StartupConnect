
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styling/generalProfile.css';
import more from '../images/more.png';
import home from '../images/home.png';
import search from '../images/search.png';
import startup from '../images/b.png';
import investor from '../images/investment.png';
import incubator from '../images/incubator.png';
import rocket from '../images/kids_rocket.png';
import invest from '../images/invest.png';
import startup2 from '../images/startup2.png';
import connecting from '../images/connecting.gif';
// const GeneralProfile = (props) => {
  export default function GeneralProfile(){
  const navigate = useNavigate(); // Initialize useNavigate hook

  const location = useLocation(); // Initialize useLocation hook

  // Access the userId from the location state
  const { userId } = location.state || {};
  console.log(userId)

  const handleClickStartupPage = async (e) => {
    e.preventDefault();
    navigate('/StartupUserProfile' , {state:{userId}});
    
  };
  const handleClickInvestorPage = async (e) =>{
    e.preventDefault();
    navigate('/InvestorUserProfile' , {state:{userId}});
  }

  return (
    <div className='generalProfile_container'>
      <div className="search-bar">
        <input type="text" placeholder="Search Startups" src={search} alt="Search" />
        <div className="icons">
          <img src={home} alt="Home" />
          <img src={more} alt="More" />
        </div>
      </div>
      <div className="container">
        <div className="actions">
          <button className="linkDescription-item" onClick={handleClickStartupPage}>
            <div className="image"><img src={startup} alt="Startup" width="20" /></div>
            <span>Become a startup / View Startup</span>
          </button>
          <button className="linkDescription-item" onClick={handleClickInvestorPage}>
            <div className="image"><img src={investor} alt="Investor" width="20" /></div>
            <span>Become an investor / View Investor</span>
          </button>
          <button className="linkDescription-item">
            <div className="image"><img src={incubator} alt="Incubator" width="20" /></div>
            <span>Become an incubator / View Incubator</span>
          </button>
        </div>
        <div className='illustration'>
          
            <img className="gif" src={connecting} alt="Startup" />
           
          
        </div>
      </div>
    </div>
  );
};

// export default GeneralProfile;

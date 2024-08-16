import React from 'react';
import {useNavigate} from 'react-router-dom';
import back from "../images/back-icon.png"; // Import your back icon
import "../styling/navbar.css"; // Ensure the CSS file path is correct

export default function Navbar(props) {
    const navigate= useNavigate();
    const handleBackClick = () => {
      if(props.check==='home')
      {
        navigate("/home", {state:{userId:props.userId}}); // Navigate to the home page
      }
      if(props.check==='InvestorUserProfile')
      {
        navigate("/InvestorUserProfile", {state:{userId:props.userId, investorId:props.investorId}});
      }
      };
  return (
    <div className="navbar">
     
        <img className="backimage" src={back} alt="Back to Home" onClick={handleBackClick} /> {/* Icon for the back button */}
      
    </div>
  );
}

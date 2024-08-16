import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/Login_Signup.css';
import axios from 'axios';
import logo from '../images/logo.png';
import idea from '../images/idea5.png';

const HomePage = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    phonenumber: ''
  });
  const textLines = [
    "Experience a way to bring your Startup To life!",
    "Finds Investors and Companies to connect to them!",
    "Find a place to execute your plan with the incubators!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % textLines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [textLines.length]);

  const handleExperienceNowClick = () => { setShowForm(true) };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/signup', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('User created: ', response.data);
      setFormData({
        name: '',
        email: '',
        password: '',
        location: '',
        phonenumber: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create a new user:', error.response ? error.response.data : error.message);
    }
  };

  const [showLoginForm, setLoginForm] = useState(false);
  const [LoginFormData, setLoginFormData] = useState({
    email: '',
    password: ''
  });
  const handleLoginClick = () => { setLoginForm(true) };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/login', LoginFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('User logged in', response.data.foundUser._id);
      const userId = response.data.foundUser._id;
      setLoginFormData({
        email: '',
        password: ''
      });
      navigate('/general-profile', { state: { userId } });
    } catch (error) {
      console.error('Failed to log in:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="homepage-container">
      <div className="content">
        <div className="logo-container">
          <img src={logo} alt="StartupConnect Logo" className="logo" />
          <span className="title">StartupConnect</span>
        </div>
        <div className="text-content">
          <div className="text-wrapper">
            {textLines.map((line, index) => (
              <p key={index} className={index === textIndex ? 'active' : 'hidden'}>
                {line}
              </p>
            ))}
          </div>
          <div className="nav-buttons">
            <button className="experience-now" onClick={handleExperienceNowClick}>Experience Now</button>
            <button className="login" onClick={handleLoginClick}>Login</button>
          </div>
        </div>
      </div>
      <div className="image-content">
        <img src={idea} alt="Networking Illustration" />
        <div className="image-text">Investing in Tomorrow's Breakthroughs!</div>
      </div>

      {showForm && (
        <div className='formContainer'>
          <form onSubmit={handleSubmit} className='signup-form'>
            <h2>Sign up</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="password"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder='Location e.g. city, Country'
            />
            <input
              type='text'
              name='phonenumber'
              value={formData.phonenumber}
              onChange={handleInputChange}
              placeholder='Phone Number'
            />
            <button type='submit'>Submit</button>
          </form>
        </div>
      )}

      {showLoginForm && (
        <div className='formContainer'>
          <form onSubmit={handleLoginSubmit} className='login-form'>
            <h2>Login</h2>
            <input
              type='email'
              name='email'
              value={LoginFormData.email}
              onChange={handleInputChange2}
              placeholder='email'
              required
            />
            <input
              type='password'
              name='password'
              value={LoginFormData.password}
              onChange={handleInputChange2}
              placeholder='password'
              required
            />
            <button type='submit'>Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;




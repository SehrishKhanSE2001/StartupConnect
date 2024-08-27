

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login_Signup from './components/Login_Signup';
import Home from './components/home';
import StartupUserProfile from './components/StartupUserProfile';
import StartupPage from './components/startupPage';
import InvestorPage from './components/investorPage';
import InvestorUserProfile from './components/InvestorUserProfile';
import AdminView from './components/adminView';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />                  
      <Route path="/Login_Signup" element={<Login_Signup />} />     
      <Route path="/StartupUserProfile" element={<StartupUserProfile />} />
      <Route path='/startupPage' element={<StartupPage/>}/>
      <Route path='/investorPage' element={<InvestorPage/>}/>
      <Route path='/InvestorUserProfile' element={<InvestorUserProfile/>}/>
      <Route path='/adminView' element={<AdminView/>}/>
    </Routes>
  );
};

export default App;



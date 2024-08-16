// import logo from './logo.svg';
// import './App.css';
// import Home from './components/HomePage.js'

// function App() {
//   return (
//     <>
//     <Home/>
//     </>
//   );
// }

// export default App;

// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import HomePage from './components/HomePage';
// import GeneralProfile from './components/generalProfile';

// const App = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/general-profile" element={<GeneralProfile />} />
//     </Routes>
//   );
// };

// export default App;
//-------------------------------------------------------------------------------------

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login_Signup from './components/Login_Signup';
import GeneralProfile from './components/generalProfile';
import Home from './components/home';
import StartupUserProfile from './components/StartupUserProfile';
import StartupPage from './components/startupPage';
import InvestorPage from './components/investorPage';
import InvestorUserProfile from './components/InvestorUserProfile';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login_Signup />} />                   //Home
      <Route path="/general-profile" element={<GeneralProfile />} />
      <Route path="/home" element={<Home />} />
      <Route path="/StartupUserProfile" element={<StartupUserProfile />} />
      <Route path='/startupPage' element={<StartupPage/>}/>
      <Route path='/investorPage' element={<InvestorPage/>}/>
      <Route path='/InvestorUserProfile' element={<InvestorUserProfile/>}/>
    </Routes>
  );
};

export default App;

//--------------------------------------------------------------------------------------

// import './App.css'
// import GeneralProfile from './components/generalProfile.js'
// import Home from './components/HomePage.js'
// import { createBrowserRouter } from 'react-router-dom'

// function App(){
//   const router = createBrowserRouter([
//     {
//       path:"/",
//       element:<Home/>
//     },
//     {
//       path:"/generalProfile",
//       element:<GeneralProfile />
//     }
//   ])
// }


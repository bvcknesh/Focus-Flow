import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Navbar from './Components/Navbar/Navbar';
import Footbar from './Components/Footbar/Footbar';
import AIPrompt from './Components/AIPrompt/AIPrompt';
import { TasksProvider } from './TasksContext'; // Import TasksProvider



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [userId, setUserId] = useState(null); // State for logged-in user's ID
  const [showRegister, setShowRegister] = useState(false); // Toggle between Login and Register
  const navigate = useNavigate(); // Use navigate for routing
  
  const toggleView = () => setShowRegister(!showRegister); // Switch between Login and Register

  

  // Back to Login after Registration
  const handleRegistrationSuccess = () => {
    navigate('/login'); 
  };

  // To Homepage after Login
  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    // Redirect to dashboard or home page after login
    setTasks(data.tasks); // Set the fetched tasks to the state

  };


  return (
    <TasksProvider> 
      <Routes>
          <Route path='/' element={<Navigate to='/home' />} />
        {!isLoggedIn ? (
          <>
            <Route
              path='register'
              element={
                <Register
                  onSuccess={handleRegistrationSuccess} // Pass success handler to Register
                />
              }
            />b  
            <Route
              path='/login'
              element={
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  setUserId={setUserId}
                  
                />
              }
            />
            {/* Redirect to login if trying to access root */}
            <Route path='/home' element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
          </>
        ) : (
          <>
            {/* Routes for logged-in users */}
            <Route
              path='home'
              element={
                <div className="container">
                  <div className="navbar">
                    <Navbar />
                  </div>
                  <div className="maincontent">
                    <Footbar   userId={userId} />
                  </div>
                  <div className="AIPromptcontainer">
                    <AIPrompt userId={userId} />
                  </div>
                </div>
              }
            />
          </>
        )}
      </Routes>
    </TasksProvider> 

    
  );
};

export default App;

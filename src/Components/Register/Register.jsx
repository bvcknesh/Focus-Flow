import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';  
import './Register.css'; 
import { useTasks } from '../../TasksContext.jsx';


const Register = ({ setIsLoggedIn, setUserId, toggleView,onSuccess }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); 
  const navigate = useNavigate(); 
  const [isRegistered,setRegister]=useState(false);
   const { tasks, setTasks } = useTasks();
    const { addTask } = useTasks();

  const[newuserId,setnewUserId]=useState('');

  const [preference1, setPreference1] = useState('');
  const [preference2, setPreference2] = useState('');
  const [preference3, setPreference3] = useState('');
  const [preference4, setPreference4] = useState('');
  const [preference5, setPreference5] = useState('');


 // We are calling check-username and register api call
  const handleRegister = async () => {
    // Validate input fields
    if (!username || !password || !email) {
      alert('All fields are required!');
      return; // Stop the registration process if any field is empty
    }

    
    // Make the registration API call
    const response = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });
  
    const data = await response.json();
  
    // Step 4: Handle the response
    if (data.success) {
      alert('Registration successful!');
      console.log(data);
      setnewUserId(data.userId);
      setRegister(true); // Navigate to login page on success
    } else {
      alert(data.message || 'Registration failed!');
    }
  };
  

// We are simply navigating to Login page
  const handleLoginClick = () => {
    console.log('Navigating to /login');
    navigate('/login'); // Navigate to the Login page when clicked
  };

  const handlePreferencesSubmit = () => {
    if (!preference1 || !preference2 ||!preference3 ||!preference4 ||!preference5) {
      alert('All fields are required!');
      return; // Stop the registration process if any field is empty
    }

    addTask(newuserId,preference1,'','low','2099-12-31','AI');
    addTask(newuserId,preference2,'','low','2099-12-31','AI');
    addTask(newuserId,preference3,'','low','2099-12-31','AI');
    addTask(newuserId,preference4,'','low','2099-12-31','AI');
    addTask(newuserId,preference5,'','low','2099-12-31','AI');
    console.log('Preferences Submitted:', { preference1, preference2, preference3, preference4, preference5 });
    navigate('/login') ;// Close the modal after submission
  };

// Front end 
return (
  <div className='register-container'>
    {!isRegistered ? (
      <>
        <h2>Focus Flow</h2>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='email'
          placeholder='Email (optional)'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <p>
          Already have an account? <span onClick={handleLoginClick}>Login here</span>
        </p>
      </>
    ) : (
      <div className='prefernces-name'>
        <h2>Set Your Preferences</h2>
        <p>Choose your preferences to get the best experience with Focus Flow.</p>
        <div>
          <input
            type="text"
            placeholder="Preference 1"
            value={preference1}
            onChange={(e) => setPreference1(e.target.value)}
          />
          <input
            type="text"
            placeholder="Preference 2"
            value={preference2}
            onChange={(e) => setPreference2(e.target.value)}
          />
          <input
            type="text"
            placeholder="Preference 3"
            value={preference3}
            onChange={(e) => setPreference3(e.target.value)}
          />
          <input
            type="text"
            placeholder="Preference 4"
            value={preference4}
            onChange={(e) => setPreference4(e.target.value)}
          />
          <input
            type="text"
            placeholder="Preference 5"
            value={preference5}
            onChange={(e) => setPreference5(e.target.value)}
          />
        </div>
        <button  onClick={handlePreferencesSubmit}> Preferences</button>
      </div>
    )}
  </div>
);
};

export default Register;
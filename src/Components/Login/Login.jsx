import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './Login.css'; // Optional: Style the login component
import { useTasks } from '../../TasksContext'; // Import the useTasks hook

const Login = ({ setIsLoggedIn, setUserId ,sendDatatoFoot}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function
  const { setTasks } = useTasks();  
  

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsLoggedIn(true); 
        setUserId(data.userId);

        const uncheckedTasks = data.tasks.filter(task => !task.completed);
        setTasks(uncheckedTasks);
        console.log(uncheckedTasks); 
        alert('valid credentials!');
        navigate('/home');
      } else {
        alert('Invalid credentials!');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Something went wrong. Please try again.{$error}');
    }
  };

  

  const handleRegisterClick = () => {
    console.log('Navigating to register');
    navigate('/register'); // Navigate to the Register page when clicked
  };

  //Frontend
  return (
    <div className='login-container'>
      <h2>Login</h2>
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account?{' '}
        <span className='toggle-view' onClick={handleRegisterClick}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;

// TasksContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create the Context for tasks
const TasksContext = createContext();

// Create a custom hook to access the TasksContext
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

// Create a Provider component to wrap the app with the tasks state
export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]); // State for tasks
  const [aiTasks, setAiTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const abc=useState('');

  const addTask = async (userId,taskText, noteText, priority,deadline,source ) => {
    console.log("data form",source)
    const newTask = {
      userId, 
      title:taskText,
      note:noteText,
      priority,
      deadline:deadline || '2099-12-31',
      source,
      completed: false,
    };
    console.log("new task ",newTask);
    try {
      const response = await fetch('http://localhost:5001/api/addtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
  
      const data = await response.json();
      console.log(data);
      if (data.success) {
        console.log(data);
        setTasks([data.task, ...tasks]); // Add new task to the state
      } else {
        console.error('Failed to add task:', data.message);
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };
  
  const fetchTask = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/get-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: taskInput }), // Send the user prompt to backend
      });

      if (!response.ok) {
        throw new Error('Error fetching suggestions');
      }

      const data = await response.json();
      const data2 = JSON.stringify(data)
      // modifying the output
      const parsedData = JSON.parse(data2);
      console.log('Parsed Data:', parsedData);

      const tasksString = parsedData.result.trim();
      console.log('Raw Task String:', tasksString);

      const cleanedRawString = tasksString.slice(0, -4);
      console.log('Cleaned Raw Task String:', cleanedRawString);

      const formattedString = `[${cleanedRawString}]`;
      console.log("formatedString :",formattedString);

      const tasksArray = JSON.parse(formattedString);
      console.log("tasksarray : ",tasksArray);

        // Update the state with the parsed tasks
        setAiTasks(tasksArray);
      console.log(aiTasks);


  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchTaskDirectly = async (abc) => {
  try {
    const response = await fetch('http://localhost:5001/api/get-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: abc }), // Send the user prompt to backend
    });

    if (!response.ok) {
      throw new Error('Error fetching suggestions');
    }

    const data = await response.json();
    const data2 = JSON.stringify(data)
    // modifying the output
    const parsedData = JSON.parse(data2);
    console.log('Parsed Data:', parsedData);

    const tasksString = parsedData.result.trim();
    console.log('Raw Task String:', tasksString);

    const cleanedRawString = tasksString.slice(0, -4);
    console.log('Cleaned Raw Task String:', cleanedRawString);

    const formattedString = `[${cleanedRawString}]`;
    console.log("formatedString :",formattedString);

    const tasksArray = JSON.parse(formattedString);
    console.log("tasksarray : ",tasksArray);

      // Update the state with the parsed tasks
      setAiTasks(tasksArray);
    console.log(aiTasks);


} catch (error) {
  console.error('Error:', error);
}
};

  return (
    <TasksContext.Provider value={{ tasks, setTasks,addTask,fetchTask,aiTasks,setAiTasks,taskInput ,setTaskInput,fetchTaskDirectly}}>
      {children}
    </TasksContext.Provider>
  );
};

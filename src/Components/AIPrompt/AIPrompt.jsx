// AIPrompt.jsx (React)

import React, { useState } from "react";
import "./AIPrompt.css";
import { useTasks } from '../../TasksContext.jsx';

const AIPrompt = ({ userId }) => {
  
  const [isAiTasksEmpty, setAiTasksEmpty] = useState(false);

  const { tasks, setTasks,aiTasks,setAiTasks,taskInput, setTaskInput  } = useTasks();

  const { addTask,fetchTask } = useTasks();

  const handleCreate = (task, taskId, taskLabel) => {
    console.log('Ai Create button clicked');
    addTask(userId, taskLabel, '', 'low', '2099-12-31', 'AI');
    setAiTasks((prevTasks) => prevTasks.filter((t) => t.title !== taskLabel));

    
  };

  

return (
  <div className="ai-prompt-container">
    <h2 id="heading">A I Suggestions</h2>

    {aiTasks.length > 0 ? (
      aiTasks.map((task, index) => (
        <div key={task.id || index} className="ai-task-container">
          <span>{task.title}</span>
          <button
            className="ai-add-button"
            onClick={() => handleCreate(task,task.id,task.title)}
          >
            +
          </button>
        </div>
      ))
    ) : (
      <div>
        <h2>How can we help you</h2>
        <h3>Search for a topic to get guided steps</h3>
      <br></br>
       
        <input
          type="text"
          id="taskInput"
          placeholder="Enter your prompt..."
          value={taskInput}
          className="fetch"
          onChange={(e) => setTaskInput(e.target.value)}
        />
       
        
        {/* to fetch tasks */}
        <button className="fetchButton" onClick={fetchTask}>Fetch</button>
      </div>
    )}
  </div>
);
}

export default AIPrompt;
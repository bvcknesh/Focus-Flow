import React, { useState, useEffect, useRef } from 'react';
import './abc.css'
import { useTasks } from '../../TasksContext.jsx';

const Newtaskmodal = ({ isModalOpen, closeModal,userId }) => {
     const { tasks, setTasks,aiTasks,setAiTasks,taskInput, setTaskInput  } = useTasks();
    
      const { addTask,fetchTaskDirectly} = useTasks();

    const [taskText, setTaskText] = useState('');
    const [noteText, setNoteText] = useState('');
    const [priority, setPriority] = useState('low'); // Add priority state
    const [deadline, setDeadline] = useState(''); // A

    const inputRef = useRef(null);

    useEffect(() => {
        if (isModalOpen) {
            inputRef.current.focus();
            inputRef.current.select(); // Focus the input when the modal is opened
        }
    }, [isModalOpen]);


    // Handle input change
    const handleInputChange = (e) => {
        setTaskText(e.target.value);
    };
    const handleInputNoteChange = (e) => {
        setNoteText(e.target.value);
    }
    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value);
    };


    // Handle create button click
    const handleCreate = () => {
        console.log('Create button clicked');
        if (taskText.trim()) {  // Only proceed if the input is not empty
            console.log('[Task]:', taskText, '[Note]:', noteText,
                        '[Priority]:', priority, '[Deadline]:', deadline,
                        '[Source]: Manual ', '[user id] : ', userId
            );
            fetchTaskDirectly(taskText);
            addTask(userId,taskText, noteText, priority,deadline,'manual');  // Pass the task text back to Footbar to display it
        
            closeModal();  // Close the modal
        } else {
            alert('Please enter a task.');  // Show an alert if the input is empty
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (taskText.trim()) {
                handleCreate();
            } else {
                alert('Please enter a task');
            }
        }
    };


    return (
        <>
            <div className='modal-wrapper' onClick={closeModal}></div>
            <div className='modal-container'>
                <h3>New Task</h3>
                <input
                    className='Textinput'
                    placeholder='Enter your task...'
                    value={taskText}
                    ref={inputRef}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}          ></input>
                <textarea className='noteInput'
                    placeholder='Enter Notes'
                    value={noteText}

                    onChange={handleInputNoteChange}
                    maxLength={100}
                ></textarea>

                <div className='Priority'>
                    <h2>Priority</h2>
                    <div className="button-container">
                        {['low', 'med', 'high'].map((item) => (
                            <div className="input-container" key={item}>
                                <input
                                    id={item}
                                    type="radio"
                                    name="radio"
                                    value={item}
                                    checked={priority === item}
                                    onChange={handlePriorityChange}
                                />
                                <div className="radio-tile">
                                    <ion-icon name={item}></ion-icon>
                                    <label htmlFor={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='Deadline'>
                    <input
                        className='calendar'
                        type='date'
                        value={deadline}
                        onChange={handleDeadlineChange}
                    />
                </div>

                <button className='create' onClick={handleCreate} > Create</button>
                <button className='close' onClick={closeModal} >Close</button>

            </div>
        </>
    );
};

export default Newtaskmodal;
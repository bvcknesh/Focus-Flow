import React, { useState, useEffect, useRef } from 'react';
import './abc.css'



const EditModal = ({ editModal, closeEditModal, editTask ,taskToEdit }) => {

    const [taskText, setTaskText] = useState('');
    const [noteText, setNoteText] = useState('');
    const [priority, setPriority] = useState('low'); // Add priority state
    const [deadline, setDeadline] = useState(''); // A

    const inputRef = useRef(null);
    useEffect(() => {
        if (taskToEdit) {
            setTaskText(taskToEdit.title || '');
            setNoteText(taskToEdit.note || '');
            setPriority(taskToEdit.priority || 'low');
            setDeadline(taskToEdit.deadline || '');
        }
    }, [taskToEdit]);

    useEffect(() => {
        if (editModal) {
            inputRef.current.focus();
            inputRef.current.select(); // Focus the input when the modal is opened
        }
    }, [editModal]);


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


    // Handle Edit button click
      const handleEdit = () => {
        if (taskText.trim()) {
          editTask(taskToEdit._id, { title: taskText, note: noteText, priority, deadline });
          console.log('Updated Task Sucessfully ', taskToEdit);

          closeEditModal();
        } else {
          alert('Task text cannot be empty.');
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
            <div className='modal-wrapper' onClick={closeEditModal}></div>
            <div className='modal-container'>
                <h3>Edit Task</h3>
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

                <button className='create' onClick={handleEdit} > Edit </button>
                <button className='close' onClick={closeEditModal} >Close</button>

            </div>
        </>
    );
};

export default EditModal;
import React, { useState, useEffect, useRef } from 'react'
import './Footbar.css'
import Newtaskmodal from '../Newtaskmodal/Newtaskmodal';
import EditModal from '../Newtaskmodal/EditModal';
import NoteModal from '../Newtaskmodal/NoteModal';
import { useTasks } from '../../TasksContext.jsx';



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';




const Footbar = ({  userId }) => {

    const { tasks, setTasks } = useTasks();
    const { addTask } = useTasks();
    const [isModalOpen, setNewtaskmodal] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('default'); // Track the sorting criterion
    const [sortedTasks, setSortedTasks] = useState(tasks);
    const [editModal, setEditModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [toShowNotes, setToShowNotes] = useState(null);
    const closeModal = () => setNewtaskmodal(false);
    const closeEditModal = () => setEditModal(false);
    const closeNoteModal = () => setShowNoteModal(false);
    const totalTasks = tasks.length;
    const checkedTasks = tasks.filter((task) => task.completed).length;

    const toggleCheckbox = async (taskId, updatedTask) => {
        try {
            const taskToUpdate = tasks.find(task => task._id === taskId);
            const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

            // Send PUT request to update the task completion status
            const response = await fetch(`http://localhost:5001/api/toggleTask/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });

            const data = await response.json();
            if (data.success) {
                console.log('Task toggled successfully');
                // Update the task state with the new completion status
                setTasks(tasks.map(task =>
                    task._id === taskId ? { ...task, completed: !task.completed } : task
                ));
            } else {
                console.error('Failed to toggle task:', data.message);
            }
        } catch (err) {
            console.error('Error toggling task:', err);
        }

    };



    // Sorting functions
    const sortByPriority = (tasks) => {
        const priorityMap = { low: 0, med: 1, high: 2 };
        return [...tasks].sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
    };

    const sortByDeadline = (tasks) => {
        return [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    };

    const sortByCreatedAt = (tasks) => {
        return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    // Apply sorting dynamically when `sortCriteria` changes
    useEffect(() => {
        let sortedTasks;

        switch (sortCriteria) {
            case 'priority':
                sortedTasks = sortByPriority(tasks);
                break;
            case 'deadline':
                sortedTasks = sortByDeadline(tasks);
                break;
            default: // 'default'
                sortedTasks = sortByCreatedAt(tasks); // Sort by creation date
                break;
        }

        setTasks((prevTasks) => {
            const isDifferent = JSON.stringify(prevTasks) !== JSON.stringify(sortedTasks);
            return isDifferent ? sortedTasks : prevTasks;
        });
    }, [sortCriteria]); // Re-run effect when `sortCriteria` or `tasks` changes

    
      


    const deleteTask = async (taskId, updatedTask) => {
        try {
            const response = await fetch(`http://localhost:5001/api/deletetask/${taskId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                console.log('Task deleted successfully');
                setTasks(tasks.filter((task) => task._id !== taskId)); // Remove task from state
            } else {
                console.error('Failed to delete task:', data.message);
            }
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const editTask = async (taskId, updatedTask) => {
        try {
            const response = await fetch(`http://localhost:5001/api/edittask/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });
            const data = await response.json();
            if (data.success) {
                setTasks((prevTasks) => prevTasks.map((task) => (task._id === taskId ? { ...task, ...updatedTask } : task)));
            } else {
                console.error('Failed to edit task:', data.message);
            }
        } catch (err) {
            console.error('Error editing task:', err);
        }
    };


    return (

        <div className='task-list-wrapper'>
            <div className='heading'>
                <h1> List</h1>
                <div className="task-counter">
                    <span>{checkedTasks}/{totalTasks} </span>
                </div>
                <div className="sort-button-container">
                    <select
                        onChange={(e) => {
                            setSortCriteria(e.target.value); // Set the selected sorting criteria
                        }}
                        className="sort-dropdown"
                    >
                        <option value="default">Default Order</option>
                        <option value="priority">Sort by Priority</option>
                        <option value="deadline">Sort by Deadline</option>
                    </select>
                </div>
            </div>
            <div className='task-list'>



                {tasks.map(task => (
                    <div
                        key={task._id}
                        className={`task-container ${task.completed ? 'checked' : ''} ${task.priority}`}
                    >
                        <label className="checkbox-label" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleCheckbox(task._id, { ...task, completed: !task.completed })}  // Function to toggle the checkbox
                            />
                            <div className="custom-checkbox"></div>
                        </label>
                        <div className='task-label-container'>
                            <span className="task-label">{task.title} </span>
                        </div>
                        <div className="tasks-button-container">
                            <span className="deadlinedue">
                                {(() => {
                                    const today = new Date();
                                    const deadline = new Date(task.deadline);
                                    const differenceInTime = deadline - today;
                                    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)); // Convert to days

                                    if (differenceInDays > 0 && differenceInDays < 10) {
                                        return `${differenceInDays} days`;
                                    } else if (differenceInDays === 0) {
                                        return "Due today";
                                    } else if (differenceInDays < 0) {
                                        return `Overdue by ${Math.abs(differenceInDays)} days`;
                                    } else {
                                        return "";
                                    }
                                })()}
                            </span>
                            <button className={`Notes ${task.completed ? 'checkedNotes' : ''}`} onClick={() => setToShowNotes(task)} ><FontAwesomeIcon icon={faNoteSticky} /></button>
                            {toShowNotes && <NoteModal
                                showNoteModal={toShowNotes}
                                closeNoteModal={() => setToShowNotes(null)} toShowNotes={toShowNotes}
                            />}
                            <button className={`Notes ${task.completed ? 'checkedNotes' : ''}`} onClick={() => setTaskToEdit(task)} ><FontAwesomeIcon icon={faPencil} /></button>
                            {taskToEdit && <EditModal
                                editModal={taskToEdit}
                                closeEditModal={() => setTaskToEdit(null)} editTask={editTask}
                                taskToEdit={taskToEdit} />}


                            <button className={`Delete ${task.completed ? 'checkedDelete' : ''}`} onClick={() => deleteTask(task._id)}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                    </div>

                ))}


            </div>
            <button onClick={() => setNewtaskmodal(true)} className='circle-button'> + </button>
            {isModalOpen && <Newtaskmodal isModalOpen={isModalOpen} closeModal={closeModal} addTask={addTask} userId={userId} />}

        </div>



    );


};

    export default Footbar;

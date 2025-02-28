import React, { useState, useEffect, useRef } from 'react';
import './abc.css'



const NoteModal = ({ showNoteModal, closeNoteModal, toShowNotes }) => {

    const [noteText, setNoteText] = useState('');
   

    const inputRef = useRef(null);
    useEffect(() => {
        if (toShowNotes) {
          
            setNoteText(toShowNotes.note || '');
       
        }
    }, [toShowNotes]);

    useEffect(() => {
        if (showNoteModal) {
            inputRef.current.focus();
            inputRef.current.select(); // Focus the input when the modal is opened
        }
    }, [showNoteModal]);


    // Handle input change
    const handleInputNoteChange = (e) => {
        setNoteText(e.target.value);
    }
    



    return (
        <>
            <div className='modal-wrapper' onClick={closeNoteModal}></div>
            <div className='modal-container'>
                <h3>NOTES</h3>

                <textarea className='noteInput'
                    value={noteText}
                    ref={inputRef} 
                    onChange={handleInputNoteChange}
                    maxLength={100}
                ></textarea>

                <button className='close' onClick={closeNoteModal} >Close</button>

            </div>
        </>
    );
};

export default NoteModal;
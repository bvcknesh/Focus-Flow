import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faUser} from '@fortawesome/free-solid-svg-icons'; 


const Navbar = () => {
  return (
    <div className='navbar'>

        <img src={logo} alt="" className='logo'/>
        <h1 > Focus Flow  </h1>
        {/*
        <ul className='button-container'>
            <li><button className='B1'> <FontAwesomeIcon icon={faSort} /> </button></li>
            <li><button className='B2'><FontAwesomeIcon icon={faClock} /> </button></li>
            <li><button className='B3'><FontAwesomeIcon icon={faUser} /> </button></li>
        </ul>
        */}
      
    </div>

  )
}

export default Navbar

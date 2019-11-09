import React, { Component } from 'react';
import './bulma/css/bulma.css'
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';

class Nav extends React.Component {
  state = {

  }



render(){
  return(
  <nav className="navbar is-black" style={{backgroundColor: '#1e202f'}}>
  <div className="navbar-brand">
      <a className="navbar-item" href="#" style={{fontWeight: '500', fontSize: 'xx-large'}}>Kirari <p style={{ fontSize: 'small'}}>
      Online Gambling</p></a>
  </div>

  <div className="navbar-end">
  <Link to='/lobby' className="navbar-item">
    <button className='button is-danger is-small is-outlined'>Return to lobby</button></Link>
  <a className="navbar-item">FAQ</a>
  <a className="navbar-item">About</a>
  </div>

  </nav>
)}

}

export default Nav;

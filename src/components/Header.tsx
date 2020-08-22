import React from 'react'
import logo from '../assets/resardis-logo.png';
import { ReactComponent as Menu } from '../svg/menu.svg'

const Header = () => {
  return (
    <div className="header">
      <img className="logo" src={logo} alt="Resardis" />
      <ul className="top-nav">
        <li>Market</li>
        <li>Funds</li>
        <li>Account</li>
        <li>News</li>
        <li>Help</li>
      </ul>
      <Menu fill="#C2C3C3" width="64px" height="64px" />
    </div>
  )
}

export default Header

import React  from 'react';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsToggleOn, BsToggleOff } from 'react-icons/bs';
import { IoHome } from "react-icons/io5";
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ openSidebarToggle, setOpenSidebarToggle }) {
  const history = useNavigate();

  const handleLogout = () => {
    // Clear the authentication state
    localStorage.removeItem('isLoggedIn');
    // Redirect to login page
    history('/');
  };

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> ADMIN
        </div>
        <span className='icon close_icon' onClick={toggleSidebar}>
          {openSidebarToggle ? <BsToggleOff /> : <BsToggleOn />}
        </span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/main/home">
            <IoHome className='icon' />
            Home
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/main/bookingListing">
            <BsGrid1X2Fill className='icon' />
            Booking
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/main/intransit">
            <BsFillGrid3X3GapFill className='icon' />
            Intransit
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/main/delivered">
            <BsFillArchiveFill className='icon' />
            Delivered
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/main/customer">
            <BsPeopleFill className='icon' />
            Customers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/Main/tracking">
            <BsListCheck className='icon' />
            Tracking
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/main/Contact">
            <BsMenuButtonWideFill className='icon' />
            Contact us
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <button onClick={handleLogout}>
            <BsFillGearFill className='icon' />
            Logout
          </button>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar;
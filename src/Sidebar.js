import React from 'react';
import {
  BsCart3, BsFillArchiveFill, BsListCheck,
  BsToggleOn, BsToggleOff
} from 'react-icons/bs';
import {
  MdDashboard, MdLocalShipping,
  MdLockReset, MdContactSupport
} from 'react-icons/md';
import { FaTruckLoading, FaUserFriends } from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ openSidebarToggle, setOpenSidebarToggle }) {
  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      <span className="mobile-toggle" onClick={toggleSidebar}>
        {openSidebarToggle ? <BsToggleOff /> : <BsToggleOn />}
      </span>

      <aside
        id="sidebar"
        className={`sidebar ${openSidebarToggle ? 'expanded' : 'collapsed'}`}
      >
        <div className="sidebar-title">
          <div className="sidebar-brand">
            <BsCart3 className="icon_header" />
            {openSidebarToggle && <span className="sidebar-label">ADMIN</span>}
          </div>
        </div>

        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            <Link to="/main/home">
              <MdDashboard className="icon" />
              <span className="sidebar-label">Dashboard</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/main/bookingListing">
              <FaTruckLoading className="icon" />
              <span className="sidebar-label">Booking</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/main/intransit">
              <MdLocalShipping className="icon" />
              <span className="sidebar-label">Intransit</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/main/delivered">
              <BsFillArchiveFill className="icon" />
              <span className="sidebar-label">Delivered</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/main/customer">
              <FaUserFriends className="icon" />
              <span className="sidebar-label">Customers</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/main/tracking">
              <BsListCheck className="icon" />
              <span className="sidebar-label">Tracking</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/main/InvoiceGenerator">
              <AiOutlineFileText className="icon" />
              <span className="sidebar-label">Generate Invoice</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/main/change-password">
              <MdLockReset className="icon" />
              <span className="sidebar-label">Change Password</span>
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/main/contact">
              <MdContactSupport className="icon" />
              <span className="sidebar-label">Contact Us</span>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;

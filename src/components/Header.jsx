import React from "react";
import logo from "./Assets/icon.png"; // Import your logo image

const Header = ({ companyName }) => {
  return (
    <header style={headerStyle}>
      <img src={logo} alt="Company Logo" style={logoStyle} />
      <h1 style={companyNameStyle}>{companyName}</h1>
    </header>
  );
};

// Styles
const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center", // Center horizontally
  padding: "1rem",
  borderBottom: "1px solid #ccc",
};

const logoStyle = {
  width: "50px", // Adjust the width of the logo as needed
  height: "50px", // Adjust the height of the logo as needed
  marginRight: "1rem", // Adjust the spacing between the logo and company name
};

const companyNameStyle = {
  fontSize: "3.0rem", // Adjust the font size of the company name as needed
  fontWeight: "bold",
  
  color: "white", // Set the color to white
};

export default Header;

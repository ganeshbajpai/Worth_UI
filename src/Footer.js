import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <p>© 2025 Vedic Logistics Pvt. Ltd.</p>
        <p>Delivering Speed. Ensuring Trust.</p>
      </div>
      <div className="footer-right">
        <p>Version 1.0.2 | Updated: Jul 2025</p>
        <p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms</a></p>
      </div>
    </footer>
  );
};

export default Footer;

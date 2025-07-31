import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer } from 'react-toastify';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Col, Row } from "reactstrap";
import BookingDetailsPage from './BookingDetailsPage';
import CustomerListing from "./CustomerListing";
import CustomerCreate from "./CustomerCreate";
import CustomerDetails from "./CustomerDetails";
import CustomerEdit from "./CustomerEdit";
import Home from "./Home";
import Details from "./Details";
import Contact from "./components/Contact";
import BookingListing from "./BookingListing";
import BookingCreate from "./BookingCreate";
import BookingDetails from "./BookingDetails";
import BookingEdit from "./BookingEdit";
import Delivered from "./Delivered";
import Intransit from "./Intransit";
import Track from "./Track";
import Main from "./Main";
import UserAndRoleRegister from "./components/Register/UserAndRoleRegister";
import LoginPage from "./components/LoginForm/LoginPage";
import InvoiceGenerator from "./InvoiceGenerator";
import Loader from "./components/Loader"; // ✅ Import Loader
import ChangePassword from "./ChangePassword";


function App() {
  const [loading, setLoading] = useState(true);
  




  

  useEffect(() => {
    // Simulate app loading or API calls
    const timer = setTimeout(() => setLoading(false), 1200); // Adjust as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />; // ✅ Show loading spinner globally

  return (
    <div className="flex flex-col h-screen">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Container>
        <Row>
          <Col md={1}></Col>
          <Col md={11}>
            <Router>
              
              <Routes>
                <Route path="/" element={<LoginPage />} />
                
                <Route path="/Main/tracking" element={<Track />} />
                <Route path="/register" element={<UserAndRoleRegister />} />
                <Route path="/main" element={<Main />}>
                  <Route path="home" element={<Home />} />
                  <Route path="bookingListing" element={<BookingListing />} />
                  <Route path="customer" element={<CustomerListing />} />
                  <Route path="customer/create" element={<CustomerCreate />} />
                  <Route path="customer/details/:custId" element={<CustomerDetails />} />
                  <Route path="customer/edit/:custId" element={<CustomerEdit />} />
                  <Route path="About-Us" element={<Details />} />
                  <Route path="delivered" element={<Delivered />} />
                  <Route path="intransit" element={<Intransit />} />
                  <Route path="InvoiceGenerator" element={<InvoiceGenerator />} />
                  <Route path="Contact" element={<Contact />} />
                  <Route path="booking/create" element={<BookingCreate />} />
                  <Route path="booking/create/addConsignor" element={<CustomerCreate />} />
                  <Route path="booking/details/:bookId" element={<BookingDetails />} />
                  <Route path="booking/edit/:bookId" element={<BookingEdit />} />
                  <Route path="change-password" element={<ChangePassword />} />
                 <Route path="/main/booking/:id" element={<BookingDetailsPage />} />
                </Route>
              </Routes>
            </Router>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

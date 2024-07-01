import React, { useEffect, useState }  from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Col, Row } from "reactstrap";
import Header from "./components/Header";
import Sidebar from "./Sidebar";
import Track from "./Track";
import BookingListing from "./BookingListing";
import { Outlet } from 'react-router-dom';
import {UncontrolledCarousel} from 'reactstrap';
import {  Navigate } from "react-router-dom";
import { isLoggedIn } from "./components/LoginForm/LoginForm"; 

const Main = () => {
  
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
if(isLoggedIn()){
  return (
   <>
      <div className="flex flex-col h-screen">
        <Container fluid>
          <Row>
            <Col md={2}>
            
            <Sidebar openSidebarToggle={openSidebarToggle} setOpenSidebarToggle={setOpenSidebarToggle} />
            </Col>
            <Col md={10}>           
            <Header companyName="Logistics Portal" />
              {/* Add more routes for other components */}
              


            </Col>
          </Row>
        </Container>
        <Outlet/>
        

      </div>
      </>
  );
}
else{
  return <Navigate to={"/"}/>;
}
};

export default Main;

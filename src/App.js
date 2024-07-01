import React, { } from "react";

import "./App.css";

import CustomerListing from "./CustomerListing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomerCreate from "./CustomerCreate";
import CustomerDetails from "./CustomerDetails";
import CustomerEdit from "./CustomerEdit";
import {  Container, Col, Row } from "reactstrap";



import Home from "./Home";

import Details from "./Details";

import Contact from "./components/Contact";
import BookingListing from "./BookingListing";
import BookingCreate from "./BookingCreate";
import BookingDetails from "./BookingDetails";
import BookingEdit from "./BookingEdit";


import { LoginForm } from "./components/LoginForm/LoginForm";
import RegisterPage from "./components/Register/RegisterPage";
import Delivered from "./Delivered";
import Intransit from "./Intransit";



import Track from "./Track";
import Main from "./Main";




function App() {

  // const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  // const [setLogin, setIslogged] = useState(false)

  // const OpenSidebar = () => {
  //   setOpenSidebarToggle(!openSidebarToggle)
  // }

  

    return (

      <div className="flex flex-col h-screen">



              
              
              
              <Container>
              <Row>
            <Col md={2}>
              
           
      
            </Col>
            
            <Col md={10}>
         
            
            <Router>
              <Routes>          
                      
         
              <Route path='/' element={<LoginForm/>}></Route>
              
              {/* <Route path="/" Component={Home} exact/> */}
              {/* <Route path='/customer' element={<CustomerListing/>}></Route>
              <Route path='/customer/create' element={<CustomerCreate/>}></Route>
              <Route path='/customer/details/:custId' element={<CustomerDetails/>}></Route>
              <Route path='/customer/edit/:custId' element={<CustomerEdit/>}></Route>
              <Route path="About-Us" Component={Details} exact/>              
              <Route path="/delivered" Component={Delivered} exact/>
              <Route path="/intransit" Component={Intransit} exact/>
              <Route path="/Contact" Component={Contact} exact/> */}
              <Route path='/Main/tracking' element={<Track/>}></Route>
              {/* <Route path='/bookingListing' element={<BookingListing/>}></Route> */}
              {/* <Route path='/booking/create' element={<BookingCreate/>}></Route>
              <Route path='/booking/details/:bookId' element={<BookingDetails/>}></Route>
              <Route path='/booking/edit/:bookId' element={<BookingEdit/>}></Route> */}
              <Route path='/register' element={<RegisterPage/>}></Route>
              
              {/* <Route path='/Private' element={<Privateroute/>}> */}
              
              <Route path='/main' element={<Main/>}>
              <Route path="home" Component={Home} exact/>
              <Route path='bookingListing' element={<BookingListing/>}/>
              <Route path='customer' element={<CustomerListing/>}/>
              <Route path='customer/create' element={<CustomerCreate/>}/>
              <Route path='customer/details/:custId' element={<CustomerDetails/>}/>
              <Route path='customer/edit/:custId' element={<CustomerEdit/>}/>
              <Route path="About-Us" Component={Details} exact/>              
              <Route path="delivered" Component={Delivered} exact/>
              <Route path="intransit" Component={Intransit} exact/>
              <Route path="Contact" Component={Contact} exact/>
              <Route path='booking/create' element={<BookingCreate/>}/>
              <Route path='booking/details/:bookId' element={<BookingDetails/>}/>
              <Route path='booking/edit/:bookId' element={<BookingEdit/>}/>


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

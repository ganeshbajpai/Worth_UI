import  React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import customer_url from "./api/customerapi";
import './CustomerDetails.css';

const CustomerDetails=()=>{

const{custId}=useParams();

const[custdata,custdatachange]=useState({})

useEffect(()=>{
    fetch(`${customer_url}/customer/customerDetails/`+custId).then((res)=>{

    return res.json();
    }
    ).then((resp)=>{
        custdatachange(resp);
    console.log(resp);
    }).catch((err)=>{
        console.log(err.message);
    })


},[])



    return(
    <div>
<div className="card" style={{"textAlign":"left"}}>
              <div className="card-title">
                             </div>
              


    {custdata &&
        <div>
        
        <h3>Company Name : {custdata.company_Name}</h3>
        <h5> Customer Id : {custdata.customerId}</h5>        
        <h6> Address : {custdata.company_Address}, {custdata.city},
          {custdata.state}- {custdata.pincode}, {custdata.country} </h6>
         <h6>Contact Person : {custdata.contact_Person}</h6>
         <h6>Phone Number : {custdata.contact_Number}</h6>
         <h6>Email Id : {custdata.emailId}</h6>
         <h6>GSTIN : {custdata.gstNo}</h6>
         

<Link className="btn btn-danger" to="/main/customer">Back to Listing</Link>
</div>
    }
    
    </div> 
    </div>
    
    
    
     );
    
    }
    export default CustomerDetails;
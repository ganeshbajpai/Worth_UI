import React, { useState } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import customer_url from "./api/customerapi";
import { Button} from "reactstrap";
const CustomerCreate = () => {

const[customerId]=useState("");
const[company_Name,company_Namechange]=useState("");
const[company_Address,company_Addresschange]=useState("");
const[city,citychange]=useState("");
const[state,statechange]=useState("");
const[country,countrychange]=useState("");
const[pincode,pincodechange]=useState("");
const[contact_Person,contact_Personchange]=useState("");
const[contact_Number,contact_Numberchange]=useState("");
const[emailId,emailIdchange]=useState("");
const[gstNo,gstNochange]=useState("");
const[active]=useState(true);
const[valchange]=useState(false);

const navigate=useNavigate();

const handlesubmit=(e)=>{

    e.preventDefault();
    const custdata={company_Name,company_Address,city,state,
       country,pincode,contact_Person,contact_Number,emailId,gstNo,active};

       

     fetch(`${customer_url}/customer/addCustomer`,{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(custdata)



     }).then((res)=>{
alert("Saved Successfully..")
navigate("/main/customer");

     }).catch((err)=>{
        console.log(err.message)
     })
}


  return (
    <div>
      <div className="row">
        <div className="offset-lg-1 col-lg-9">
          <form className="container" onSubmit={handlesubmit}>


            <div className="card" style={{"textAlign":"left"}}>
              <div className="card-title">
                <h2>Add Customer</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>ID</label>
                      <input value={customerId} disabled="disabled" className="form-control"></input>
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Company Name</label>
                      <input required value={company_Name} onMouseDown={e=>valchange(true)}onChange={e=>company_Namechange(e.target.value)} className="form-control"></input>
                     
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Comapny Address</label>
                      <input required value={company_Address} onChange={e=>company_Addresschange(e.target.value)} className="form-control"></input>
                      
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>City</label>
                      <input required value={city} onChange={e=>citychange(e.target.value)} className="form-control"></input>
                     
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>State</label>
                      <input required value={state} onChange={e=>statechange(e.target.value)} className="form-control"></input>
                      
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Country</label>
                      <input required value={country} onChange={e=>countrychange(e.target.value)} className="form-control"></input>
                      
                      </div>                    
                  </div> <div className="col-lg-12">
                    <div className="form-group">
                      <label>Pincode</label>
                      <input required type='Number' value={pincode} onChange={e=>pincodechange(e.target.value)} className="form-control"></input>
                      
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Contact Person</label>
                      <input required value={contact_Person} onChange={e=>contact_Personchange(e.target.value)} className="form-control"></input>
                      
                     
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input required type='number' value={contact_Number} onChange={e=>contact_Numberchange(e.target.value)} className="form-control"></input>
                      
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Email Id</label>
                      <input  required type='email' value={emailId} onChange={e=>emailIdchange(e.target.value)} className="form-control"></input>
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>GST No</label>
                      <input  required value={gstNo} onChange={e=>gstNochange(e.target.value)} className="form-control"></input>
                      </div>                    
                  </div> 
                                       
                 
                  <div className="col-lg-12">
                    <div className="form-group">
                      <Button type='submit' color='success'>Save</Button>
                      <Link to={"/main/customer"} className='btn btn-danger'>Back</Link>
                      </div>                    
                  </div>
                  </div>
                  
              </div>
              
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CustomerCreate;

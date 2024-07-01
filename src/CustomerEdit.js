import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "reactstrap";
import customer_url from "./api/customerapi";
const CustomerEdit=()=>{
    const{custId}=useParams();

    const[custdata,custdatachange]=useState({})

    useEffect(()=>{
        fetch(`${customer_url}/customer/customerDetails/`+ custId).then((resp) => {
               
        if (!resp.ok) {
                throw new Error('Failed to fetch customer details');
              }
            return resp.json();
        }
        
        ).then((resp)=>{
          customerIdchange(resp.customerId);
           company_Namechange(resp.company_Name);
           company_Addresschange(resp.company_Address);
           citychange(resp.city);
           statechange(resp.state);
           pincodechange(resp.pincode);
           countrychange(resp.country);
           emailIdchange(resp.emailId);
           contact_Personchange(resp.contact_Person);
           contact_Numberchange(resp.contact_Number);
           gstNochange(resp.gstNo);

           

        console.log(resp);
        }).catch((err)=>{
            console.log(err.message);
        })
    
    
    },[]);

const[customerId,customerIdchange]=useState("");
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
const[active,activechange]=useState(true);
const[validation,valchange]=useState(false);

const navigate=useNavigate();

const handlesubmit=(e)=>{

    e.preventDefault();
    const custdata={custId,company_Name,company_Address,city,state,
       country,pincode,contact_Person,contact_Number,emailId,gstNo,active};

       

     fetch(`${customer_url}/customer/UpdateCustomer/`+custId,{
method:"PUT",
headers:{"content-type":"application/json"},
body:JSON.stringify(custdata)



     }).then((res)=>{
alert("Update Successfully..")
navigate("/main/customer");

     }).catch((err)=>{
        console.log(err.message)
     })
}


    
    
    return(
      <div>
      <div className="row">
        <div className="offset-lg-1 col-lg-9">
          <form className="container" onSubmit={handlesubmit}>


            <div className="card" style={{"textAlign":"left"}}>
              <div className="card-title">
                <h2>Edit Customer</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>ID</label>
                      <input value={customerId} disabled="disabled"  className="form-control"></input>
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Company Name</label>
                      <input required disabled="disabled" value={company_Name} onMouseDown={e=>valchange(true)}onChange={e=>company_Namechange(e.target.value)} className="form-control"></input>
                      {company_Name.length==0 && validation && <span className='text-danger'>Enter Company Name</span>}
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Comapny Address</label>
                      <input required value={company_Address} onChange={e=>company_Addresschange(e.target.value)} className="form-control"></input>
                      {company_Address.length==0 && validation && <span className='text-danger'>Enter Company Address</span>}
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>City</label>
                      <input required value={city} onChange={e=>citychange(e.target.value)} className="form-control"></input>
                      {city.length==0 && validation && <span className='text-danger'>Enter City</span>}
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>State</label>
                      <input required value={state} onChange={e=>statechange(e.target.value)} className="form-control"></input>
                      {state.length==0 && validation && <span className='text-danger'>Enter State</span>}
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Country</label>
                      <input required value={country} onChange={e=>countrychange(e.target.value)} className="form-control"></input>
                      {country.length==0 && validation && <span className='text-danger'>Enter Country</span>}
                      </div>                    
                  </div> <div className="col-lg-12">
                    <div className="form-group">
                      <label>Pincode</label>
                      <input required type='Number' value={pincode} onChange={e=>pincodechange(e.target.value)} className="form-control"></input>
                      {pincode.length==0 && validation && <span className='text-danger'>Enter Pincode</span>}
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Contact Person</label>
                      <input required value={contact_Person} onChange={e=>contact_Personchange(e.target.value)} className="form-control"></input>
                      
                      {contact_Person.length==0 && validation && <span className='text-danger'>Enter Contact Person</span>}</div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input required type='number' value={contact_Number} onChange={e=>contact_Numberchange(e.target.value)} className="form-control"></input>
                      {contact_Number.length==0 && validation && <span className='text-danger'>Enter Contact Number</span>}
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Email Id</label>
                      <input type='email' value={emailId} onChange={e=>emailIdchange(e.target.value)} className="form-control"></input>
                      </div>                    
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>GST No</label>
                      <input value={gstNo} onChange={e=>gstNochange(e.target.value)} className="form-control"></input>
                      </div>                    
                  </div> <div className="col-lg-12">
                    {/* <div className="form-check">
                      <label className="form-check-label">Is Active</label>
                      <input checked={active} onChange={e=>activechange(e.target.checked)} type="checkbox" className="form-check-input"></input>
                      </div>                     */}
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <Button type='submit' color='success'>Update</Button>
                      <Link to={"/main/customer"} className='btn btn-danger'>Back</Link>
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
    
    }
    export default CustomerEdit;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customer_url from './api/customerapi';
import { Button } from 'reactstrap';

const CustomerCreate = () => {
  const [customerId] = useState('');
  const [company_Name, setCompanyName] = useState('');
  const [company_Address, setCompanyAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [contact_Person, setContactPerson] = useState('');
  const [contact_Number, setContactNumber] = useState('');
  const [emailId, setEmailId] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [active] = useState(true);
  // const [valChange, setValChange] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const custdata = {
      company_Name,
      company_Address,
      city,
      state,
      country,
      pincode,
      contact_Person,
      contact_Number,
      emailId,
      gstNo,
      active,
    };

    fetch(`${customer_url}/customer/addCustomer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(custdata),
    })
      .then((res) => {
        alert('Saved Successfully..');
        navigate('/main/customer');
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <div className="row">
        <div className="offset-lg-1 col-lg-9">
          <form className="container" onSubmit={handleSubmit}>
            <div className="card" style={{ textAlign: 'left' }}>
              <div className="card-title">
                <h2>Add Customer</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>ID(Auto-Generate)</label>
                      <input
                        value={customerId}
                        disabled="disabled"
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Company Name</label>
                      <input
                        required
                        value={company_Name}
                        // onMouseDown={(e) => setValChange(true)}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Company Address</label>
                      <input
                        required
                        value={company_Address}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Pincode</label>
                      <input
                        required
                        type="number"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Contact Person</label>
                      <input
                        required
                        value={contact_Person}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input
                        required
                        type="number"
                        value={contact_Number}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Email Id</label>
                      <input
                        required
                        type="email"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>GST No</label>
                      <input
                        required
                        value={gstNo}
                        onChange={(e) => setGstNo(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="form-group">
                      <Button type="submit" color="success">
                        Save
                      </Button>
                      <Link to={'/main/customer'} className="btn btn-danger">
                        Back
                      </Link>
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

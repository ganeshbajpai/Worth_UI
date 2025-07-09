import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, FormGroup, Label, Input, Form } from "reactstrap";
import customer_url from "./api/customerapi";
import './CustomerEdit.css';

const CustomerEdit = () => {
  const { custId } = useParams();
  const [validation, setValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    customerId: "",
    companyName: "",
    companyAddress: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    contactPerson: "",
    contactNumber: "",
    emailId: "",
    gstNo: "",
    active: true
  });

  const navigate = useNavigate();

  // Load all countries on initial render
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(res => res.json())
      .then(data => {
        if (data.data) setCountries(data.data.map(c => c.name));
      })
      .catch(console.error);
  }, []);

  // Fetch customer data and initialize state/city data
  useEffect(() => {
    fetch(`${customer_url}/customer/customerDetails/${custId}`)
      .then(resp => {
        if (!resp.ok) throw new Error('Failed to fetch customer details');
        return resp.json();
      })
      .then(async resp => {
        setFormData(resp);
        await loadInitialLocationData(resp.country, resp.state);
      })
      .catch(err => console.log(err.message));
  }, [custId]);

  // Load states and cities when editing an existing customer
  const loadInitialLocationData = async (country, state) => {
    if (country) {
      const resStates = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      });
      const dataStates = await resStates.json();
      if (dataStates.data?.states) {
        setStates(dataStates.data.states.map(s => s.name));
      }
    }

    if (country && state) {
      const resCities = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state }),
      });
      const dataCities = await resCities.json();
      if (dataCities.data) {
        setCities(dataCities.data);
      }
    }
  };

  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setFormData(prev => ({ ...prev, country, state: "", city: "" }));
    setStates([]);
    setCities([]);

    const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });
    const data = await res.json();
    if (data.data?.states) setStates(data.data.states.map(s => s.name));
  };

  const handleStateChange = async (e) => {
    const state = e.target.value;
    setFormData(prev => ({ ...prev, state, city: "" }));
    setCities([]);

    const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: formData.country, state }),
    });
    const data = await res.json();
    if (data.data) setCities(data.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`${customer_url}/customer/updateCustomer/${custId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(() => {
        alert("Updated successfully");
        navigate("/main/customer");
      })
      .catch(err => console.log(err.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="container-fluid py-3">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <Form onSubmit={handleSubmit} className="compact-form">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white p-2">
                <h6 className="mb-0">Edit Customer</h6>
              </div>

              <div className="card-body p-3">
                <div className="row g-2">

                  {/* Left Column */}
                  <div className="col-md-6">
                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Customer ID</Label>
                      <Input name="customerId" value={formData.customerId} disabled className="form-control-sm" />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Company Name</Label>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        disabled
                        onMouseDown={() => setValidation(true)}
                        className="form-control-sm"
                        required
                      />
                      {validation && !formData.companyName && (
                        <small className="text-danger">Enter Company Name</small>
                      )}
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Company Address</Label>
                      <Input
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">State</Label>
                      <Input
                        type="select"
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        className="form-control-sm"
                        required
                      >
                        <option value="">-- Select State --</option>
                        {states.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </Input>
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">City</Label>
                      <Input
                        type="select"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      >
                        <option value="">-- Select City --</option>
                        {cities.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </div>

                  {/* Right Column */}
                  <div className="col-md-6">
                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Country</Label>
                      <Input
                        type="select"
                        name="country"
                        value={formData.country}
                        onChange={handleCountryChange}
                        className="form-control-sm"
                        required
                      >
                        <option value="">-- Select Country --</option>
                        {countries.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </Input>
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Pincode</Label>
                      <Input
                        type="number"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Contact Person</Label>
                      <Input
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Contact Number</Label>
                      <Input
                        type="number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Email</Label>
                      <Input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        className="form-control-sm"
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">GST No</Label>
                      <Input
                        name="gstNo"
                        value={formData.gstNo}
                        onChange={handleChange}
                        className="form-control-sm"
                      />
                    </FormGroup>
                  </div>

                  {/* Buttons */}
                  <div className="col-12 mt-2">
                    <div className="d-flex gap-2">
                      <Button type="submit" color="primary" size="sm" disabled={isLoading} className="px-3">
                        {isLoading ? 'Updating...' : 'Update'}
                      </Button>
                      <Link to="/main/customer" className="btn btn-sm btn-outline-secondary px-3">Back</Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CustomerEdit;

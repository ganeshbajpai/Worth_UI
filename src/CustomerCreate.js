import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert, Spinner } from 'reactstrap';
import customer_url from './api/customerapi';
import './CustomerCreate.css';
import { toast } from "react-toastify";
const CustomerCreate = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    contactPerson: '',
    contactNumber: '',
    emailId: '',
    gstNo: '',
    active: true
  });

  const [companyExists, setCompanyExists] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const navigate = useNavigate();

  // Load countries
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(res => res.json())
      .then(data => {
        if (data.data) setCountries(data.data.map(c => c.name));
      })
      .catch(console.error);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: formData.country }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.data?.states) setStatesList(data.data.states.map(s => s.name));
        })
        .catch(console.error);
    } else {
      setStatesList([]);
    }
    setFormData(prev => ({ ...prev, state: '', city: '' }));
  }, [formData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: formData.country, state: formData.state }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.data) setCitiesList(data.data);
        })
        .catch(console.error);
    } else {
      setCitiesList([]);
    }
    setFormData(prev => ({ ...prev, city: '' }));
  }, [formData.state]);

  // Debounce company name check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.companyName) {
        fetch(`${customer_url}/customer/exists/${formData.companyName}`)
          .then(res => res.json())
          .then(setCompanyExists)
          .catch(() => setCompanyExists(false));
      } else {
        setCompanyExists(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.companyName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pincodePattern = /^[0-9]{6}$/;
    const contactPattern = /^[0-9]{10}$/;

    if (!formData.companyName) newErrors.companyName = 'Required';
    if (!formData.companyAddress) newErrors.companyAddress = 'Required';
    if (!formData.city) newErrors.city = 'Required';
    if (!formData.state) newErrors.state = 'Required';
    if (!formData.country) newErrors.country = 'Required';
    if (!formData.pincode.match(pincodePattern)) newErrors.pincode = '6 digits required';
    if (!formData.contactPerson) newErrors.contactPerson = 'Required';
    if (!formData.contactNumber.match(contactPattern)) newErrors.contactNumber = '10 digits required';
    if (!formData.emailId.match(emailPattern)) newErrors.emailId = 'Invalid email';
    if (!formData.gstNo) newErrors.gstNo = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyExists) {
      setErrors(prev => ({ ...prev, companyName: 'Company already exists' }));
      return;
    }

    if (validateForm()) {
      setIsLoading(true);
      fetch(`${customer_url}/customer/addCustomer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to add customer');
          // alert('Customer created successfully');
          toast.success("Customer created successfully");
          navigate('/main/customer');
        })
        .catch(err => {
          console.error(err.message);
          Alert.error('Failed to create customer');
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="customer-create-container">
      <div className="form-header">
        <h5>New Customer Registration</h5>
        <p className="text-muted">Fill in the details to create a new customer</p>
      </div>

      <Form onSubmit={handleSubmit} className="compact-form">
        <div className="form-section">
          <h6 className="section-title">Company Information</h6>
          <div className="form-grid">
            <FormGroup>
              <Label for="companyName" className="form-label">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                invalid={!!errors.companyName || companyExists}
                className="form-input"
              />
              {errors.companyName && <small className="text-danger">{errors.companyName}</small>}
            </FormGroup>

            <FormGroup>
              <Label for="companyAddress" className="form-label">Company Address</Label>
              <Input
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                invalid={!!errors.companyAddress}
                className="form-input"
              />
              {errors.companyAddress && <small className="text-danger">{errors.companyAddress}</small>}
            </FormGroup>
          </div>
        </div>

        <div className="form-section">
          <h6 className="section-title">Location Details</h6>
          <div className="form-grid">
            <FormGroup>
              <Label for="country" className="form-label">Country</Label>
              <Input
                id="country"
                name="country"
                type="select"
                value={formData.country}
                onChange={handleChange}
                invalid={!!errors.country}
                className="form-input"
              >
                <option value="">Select Country</option>
                {countries.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </Input>
              {errors.country && <small className="text-danger">{errors.country}</small>}
            </FormGroup>

            <FormGroup>
              <Label for="state" className="form-label">State</Label>
              <Input
                id="state"
                name="state"
                type="select"
                value={formData.state}
                onChange={handleChange}
                invalid={!!errors.state}
                className="form-input"
                disabled={!formData.country}
              >
                <option value="">Select State</option>
                {statesList.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </Input>
              {errors.state && <small className="text-danger">{errors.state}</small>}
            </FormGroup>

            <FormGroup>
              <Label for="city" className="form-label">City</Label>
              <Input
                id="city"
                name="city"
                type="select"
                value={formData.city}
                onChange={handleChange}
                invalid={!!errors.city}
                className="form-input"
                disabled={!formData.state}
              >
                <option value="">Select City</option>
                {citiesList.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </Input>
              {errors.city && <small className="text-danger">{errors.city}</small>}
            </FormGroup>

            <FormGroup>
              <Label for="pincode" className="form-label">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                type="number"
                value={formData.pincode}
                onChange={handleChange}
                invalid={!!errors.pincode}
                className="form-input"
              />
              {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
            </FormGroup>
          </div>
        </div>

        <div className="form-section">
          <h6 className="section-title">Contact Information</h6>
          <div className="form-grid">
            <FormGroup>
              <Label for="contactPerson" className="form-label">Contact Person</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                invalid={!!errors.contactPerson}
                className="form-input"
              />
              {errors.contactPerson && <small className="text-danger">{errors.contactPerson}</small>}
            </FormGroup>

            <FormGroup>
              <Label for="contactNumber" className="form-label">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                invalid={!!errors.contactNumber}
                className="form-input"
              />
              {errors.contactNumber && <small className="text-danger">{errors.contactNumber}</small>}
            </FormGroup>

            <FormGroup>
              <Label for="emailId" className="form-label">Email</Label>
              <Input
                id="emailId"
                name="emailId"
                type="email"
                value={formData.emailId}
                onChange={handleChange}
                invalid={!!errors.emailId}
                className="form-input"
              />
              {errors.emailId && <small className="text-danger">{errors.emailId}</small>}
            </FormGroup>

            <FormGroup>
              <Label for="gstNo" className="form-label">GST No</Label>
              <Input
                id="gstNo"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                invalid={!!errors.gstNo}
                className="form-input"
              />
              {errors.gstNo && <small className="text-danger">{errors.gstNo}</small>}
            </FormGroup>
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            color="primary"
            disabled={isLoading || companyExists}
            className="submit-btn"
          >
            {isLoading ? <Spinner size="sm" /> : 'Create Customer'}
          </Button>
          <Button
            type="button"
            color="secondary"
            onClick={() => navigate('/main/customer')}
            className="cancel-btn"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CustomerCreate;
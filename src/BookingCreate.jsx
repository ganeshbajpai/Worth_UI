import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Alert, Spinner } from "reactstrap";
import customer_url from "./api/customerapi";
import booking_url from "./api/bookingApi";
import './BookingCreate.css';
import { toast } from "react-toastify";

const BookingCreate = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    bookingId: "",
    consignorName: "",
    consignorAddress: "",
     consignorEmail: "",
    consigneeName: "",
    consigneeAddress: "",
    numberOfPackage: "",
    bookingDate: "",
    actualWeight: "",
    chargedWeight: "",
    shippingMode: "",
    paymentMode: "",
    frieghtCharges: "",
    invoiceNumber: "",
    invoiceDate: "",
    invoiceValue: "",
    insurance: "",
    trackStatus: "Booking Confirmed",
    date: "",
    time: "",
    remarks: "",
    materialDescription: "",
    bookingType: "",
    ewayBill: "",
    oda: "",
    vendorCompany: "",
    vendorPerson: "",
    vechileNumber: "",
    trackLocation: ""
  });

  const [consignorNames, setConsignorNames] = useState([]);
  // const [consigneeNames, setConsigneeNames] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch consignor and consignee names
  useEffect(() => {
    fetch(`${customer_url}/customer/companyNames`)
      .then(response => response.json())
      .then(data => setConsignorNames(data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleConsignorSelect = (e) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, consignorName: name }));
    
    fetch(`${customer_url}/customer/company/${name}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          const address = `${data.companyAddress}, ${data.city}, ${data.state}, ${data.country} - ${data.pincode}`;
          setFormData(prev => ({ ...prev, consignorAddress: address,
            consignorEmail: data.emailId || "" // Auto-fill email from API response
           }));
        }
      })
      .catch(console.error);
  };

  const handleConsigneeSelect = (e) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, consigneeName: name }));
    
    fetch(`${customer_url}/customer/company/${name}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          const address = `${data.companyAddress}, ${data.city}, ${data.state}, ${data.country} - ${data.pincode}`;
          setFormData(prev => ({ ...prev, consigneeAddress: address }));
        }
      })
      .catch(console.error);
  };

  const validatePage = (page) => {
    const newErrors = {};
    
    if (page === 1) {
      if (!formData.bookingId) newErrors.bookingId = 'Required';
      if (!formData.consignorName) newErrors.consignorName = 'Required';
      if (!formData.consigneeName) newErrors.consigneeName = 'Required';
    }
    
    if (page === 2) {
      if (!formData.numberOfPackage) newErrors.numberOfPackage = 'Required';
      if (!formData.materialDescription) newErrors.materialDescription = 'Required';
      if (!formData.bookingDate) newErrors.bookingDate = 'Required';
    }
    
    if (page === 3) {
      if (!formData.shippingMode) newErrors.shippingMode = 'Required';
      if (!formData.paymentMode) newErrors.paymentMode = 'Required';
      if (!formData.insurance) newErrors.insurance = 'Required';
      if (!formData.bookingType) newErrors.bookingType = 'Required';
      if (!formData.oda) newErrors.oda = 'Required';
    }
    
    if (page === 4) {
      if (!formData.date) newErrors.date = 'Required';
      if (!formData.time) newErrors.time = 'Required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextPage = () => {
    if (validatePage(currentPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePage(4)) return;
    
    setIsSubmitting(true);
    
    fetch(`${booking_url}/booking/checkBookingIdExists/${formData.bookingId}`)
      .then(res => res.json())
      .then(exists => {
        if (exists) {
          toast.error("Booking ID already exists!");
          setIsSubmitting(false);
        } else {
          Promise.all([
            fetch(`${booking_url}/booking/addBooking`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
            }),
            fetch(`${booking_url}/logging/addLogs`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
            })
          ])
          .then(() => {
            alert("Booking created successfully");
            navigate("/main/bookingListing");
          })
          .catch(err => {
            console.error(err);
            Alert.error("Failed to create booking");
          })
          .finally(() => setIsSubmitting(false));
        }
      })
      .catch(err => {
        console.error(err);
        setIsSubmitting(false);
      });
  };

  const renderPage = () => {
    switch(currentPage) {
      case 1:
        return (
          <div className="form-section">
            <h6 className="section-title">Basic Details</h6>
            <div className="form-grid">
              <FormGroup>
                <Label className="form-label">Docket Number</Label>
                <Input
                  name="bookingId"
                  value={formData.bookingId}
                  onChange={handleChange}
                  invalid={!!errors.bookingId}
                  className="form-input"
                />
                {errors.bookingId && <small className="text-danger">{errors.bookingId}</small>}
              </FormGroup>
            </div>

            <h6 className="section-title mt-4">Consignor Details</h6>
            <div className="form-grid">
              <FormGroup>
                <Label className="form-label">Name</Label>
                <Input
                  name="consignorName"
                  value={formData.consignorName}
                  onChange={handleConsignorSelect}
                  type="select"
                  invalid={!!errors.consignorName}
                  className="form-input"
                >
                  <option value="">Select Consignor</option>
                  {consignorNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </Input>
                {errors.consignorName && <small className="text-danger">{errors.consignorName}</small>}
              </FormGroup>
{/* New Email Field */}
              <FormGroup>
                <Label className="form-label">Email</Label>
                <Input
                  name="consignorEmail"
                  value={formData.consignorEmail}
                  onChange={handleChange}
                  type="email"
                  readOnly
                  className="form-input"
                />
              </FormGroup>
              <FormGroup>
                <Label className="form-label">Address</Label>
                <Input
                  name="consignorAddress"
                  value={formData.consignorAddress}
                  onChange={handleChange}
                  type="textarea"
                  rows="3"
                  readOnly
                  className="form-input"
                />
              </FormGroup>
            </div>

            <h6 className="section-title mt-4">Consignee Details</h6>
            <div className="form-grid">
              <FormGroup>
                <Label className="form-label">Name</Label>
                <Input
                  name="consigneeName"
                  value={formData.consigneeName}
                  onChange={handleConsigneeSelect}
                  type="select"
                  invalid={!!errors.consigneeName}
                  className="form-input"
                >
                  <option value="">Select Consignee</option>
                  {consignorNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </Input>
                {errors.consigneeName && <small className="text-danger">{errors.consigneeName}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Address</Label>
                <Input
                  name="consigneeAddress"
                  value={formData.consigneeAddress}
                  onChange={handleChange}
                  type="textarea"
                  rows="3"
                  className="form-input"
                />
              </FormGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <h6 className="section-title">Package Details</h6>
            <div className="form-grid">
              <FormGroup>
                <Label className="form-label">No. of Packages</Label>
                <Input
                  name="numberOfPackage"
                  type="number"
                  value={formData.numberOfPackage}
                  onChange={handleChange}
                  invalid={!!errors.numberOfPackage}
                  className="form-input"
                />
                {errors.numberOfPackage && <small className="text-danger">{errors.numberOfPackage}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Material Description</Label>
                <Input
                  name="materialDescription"
                  value={formData.materialDescription}
                  onChange={handleChange}
                  invalid={!!errors.materialDescription}
                  className="form-input"
                />
                {errors.materialDescription && <small className="text-danger">{errors.materialDescription}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Booking Date</Label>
                <Input
                  name="bookingDate"
                  type="date"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  invalid={!!errors.bookingDate}
                  className="form-input"
                />
                {errors.bookingDate && <small className="text-danger">{errors.bookingDate}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Actual Weight (Kg)</Label>
                <Input
                  name="actualWeight"
                  type="number"
                  value={formData.actualWeight}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Charged Weight (Kg)</Label>
                <Input
                  name="chargedWeight"
                  type="number"
                  value={formData.chargedWeight}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Freight Charges</Label>
                <Input
                  name="frieghtCharges"
                  type="number"
                  value={formData.frieghtCharges}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <h6 className="section-title">Shipping Details</h6>
            <div className="form-grid">
              <FormGroup>
                <Label className="form-label">Shipping Mode</Label>
                <Input
                  name="shippingMode"
                  type="select"
                  value={formData.shippingMode}
                  onChange={handleChange}
                  invalid={!!errors.shippingMode}
                  className="form-input"
                >
                  <option value="">Select Mode</option>
                  <option value="Road">Surface</option>
                  <option value="Air">Air</option>
                  <option value="Sea">Sea</option>
                </Input>
                {errors.shippingMode && <small className="text-danger">{errors.shippingMode}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Payment Mode</Label>
                <Input
                  name="paymentMode"
                  type="select"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  invalid={!!errors.paymentMode}
                  className="form-input"
                >
                  <option value="">Select Mode</option>
                  <option value="Prepaid">Prepaid</option>
                  <option value="To be Billed">To be Billed</option>
                  <option value="To Pay">To Pay</option>
                </Input>
                {errors.paymentMode && <small className="text-danger">{errors.paymentMode}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Insurance</Label>
                <Input
                  name="insurance"
                  type="select"
                  value={formData.insurance}
                  onChange={handleChange}
                  invalid={!!errors.insurance}
                  className="form-input"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
                {errors.insurance && <small className="text-danger">{errors.insurance}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Booking Type</Label>
                <Input
                  name="bookingType"
                  type="select"
                  value={formData.bookingType}
                  onChange={handleChange}
                  invalid={!!errors.bookingType}
                  className="form-input"
                >
                  <option value="">Select Type</option>
                  <option value="PTL">PTL</option>
                  <option value="FTL">FTL</option>
                  <option value="Courier">Courier</option>
                </Input>
                {errors.bookingType && <small className="text-danger">{errors.bookingType}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">ODA</Label>
                <Input
                  name="oda"
                  type="select"
                  value={formData.oda}
                  onChange={handleChange}
                  invalid={!!errors.oda}
                  className="form-input"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Input>
                {errors.oda && <small className="text-danger">{errors.oda}</small>}
              </FormGroup>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h6 className="section-title">Additional Information</h6>
            <div className="form-grid">
              <FormGroup>
                <Label className="form-label">Eway Bill</Label>
                <Input
                  name="ewayBill"
                  value={formData.ewayBill}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Vendor Company</Label>
                <Input
                  name="vendorCompany"
                  value={formData.vendorCompany}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Vendor Person</Label>
                <Input
                  name="vendorPerson"
                  value={formData.vendorPerson}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Vehicle Number</Label>
                <Input
                  name="vechileNumber"
                  value={formData.vechileNumber}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Track Location</Label>
                <Input
                  name="trackLocation"
                  value={formData.trackLocation}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Track Date</Label>
                <Input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  invalid={!!errors.date}
                  className="form-input"
                />
                {errors.date && <small className="text-danger">{errors.date}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Track Time</Label>
                <Input
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  invalid={!!errors.time}
                  className="form-input"
                />
                {errors.time && <small className="text-danger">{errors.time}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Invoice Number</Label>
                <Input
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Invoice Date</Label>
                <Input
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Invoice Value</Label>
                <Input
                  name="invoiceValue"
                  type="number"
                  value={formData.invoiceValue}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Remarks</Label>
                <Input
                  name="remarks"
                  type="textarea"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="form-input"
                />
              </FormGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="booking-create-container">
      <div className="form-header">
        <h5>New Booking</h5>
        <p className="text-muted">Step {currentPage} of 4</p>
      </div>

      <Form onSubmit={handleSubmit} className="compact-form">
        {renderPage()}

        <div className="form-actions">
          {currentPage > 1 && (
            <Button
              color="secondary"
              onClick={prevPage}
              className="action-btn"
            >
              Previous
            </Button>
          )}
          
          {currentPage < 4 ? (
            <Button
              color="primary"
              onClick={nextPage}
              className="action-btn"
            >
              Next
            </Button>
          ) : (
            <Button
              color="success"
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? <Spinner size="sm" /> : 'Submit Booking'}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default BookingCreate;
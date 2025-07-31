import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
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
 useEffect(() => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  setFormData(prev => ({
    ...prev,
    date: prev.date || currentDate,
    time: prev.time || currentTime
  }));
}, []);

  const [consignorNames, setConsignorNames] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch consignor names
  useEffect(() => {
    fetch(`${customer_url}/customer/companyNames`)
      .then(response => response.json())
      .then(data => setConsignorNames(data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (['numberOfPackage', 'actualWeight', 'chargedWeight', 'frieghtCharges', 'invoiceValue'].includes(name)) {
      if (value && isNaN(value)) return; // Prevent non-numeric input
    }
    
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
          setFormData(prev => ({ 
            ...prev, 
            consignorAddress: address,
            consignorEmail: data.emailId || ""
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
    const today = new Date().toISOString().split('T')[0];
    
    if (page === 1) {
      if (!formData.bookingId.trim()) newErrors.bookingId = 'Docket Number is required';
      else if (!/^[A-Za-z0-9]{4,12}$/.test(formData.bookingId)) newErrors.bookingId = 'Invalid format (4-12 alphanumeric chars)';
      
      if (!formData.consignorName) newErrors.consignorName = 'Consignor is required';
      if (!formData.consigneeName) newErrors.consigneeName = 'Consignee is required';
      if (formData.consignorName === formData.consigneeName) newErrors.consigneeName = 'Consignee cannot be same as Consignor';
    }
    
    if (page === 2) {
      if (!formData.numberOfPackage) newErrors.numberOfPackage = 'Number of packages is required';
      else if (formData.numberOfPackage <= 0) newErrors.numberOfPackage = 'Must be at least 1';
      
      if (!formData.materialDescription.trim()) newErrors.materialDescription = 'Description is required';
      else if (formData.materialDescription.length < 5) newErrors.materialDescription = 'Minimum 5 characters';
      
      if (!formData.bookingDate) newErrors.bookingDate = 'Booking date is required';
      else if (formData.bookingDate > today) newErrors.bookingDate = 'Cannot be future date';
      
if (!formData.actualWeight) newErrors.actualWeight = 'Actual weight is required';
if (!formData.chargedWeight) newErrors.chargedWeight = 'Charged weight is required';
if (!formData.frieghtCharges) newErrors.frieghtCharges = 'Freight charges are required';

      if (formData.actualWeight && formData.actualWeight <= 0 ) newErrors.actualWeight = 'Must be positive';
      if (formData.chargedWeight && formData.chargedWeight <= 0) newErrors.chargedWeight = 'Must be positive';
      // if (formData.frieghtCharges && formData.frieghtCharges <= 0) newErrors.frieghtCharges = 'Must be positive';
    }
    
    if (page === 3) {
      if (!formData.shippingMode) newErrors.shippingMode = 'Shipping mode is required';
      if (!formData.paymentMode) newErrors.paymentMode = 'Payment mode is required';
      if (!formData.insurance) newErrors.insurance = 'Insurance selection is required';
      if (!formData.bookingType) newErrors.bookingType = 'Booking type is required';
      if (!formData.oda) newErrors.oda = 'ODA selection is required';
    }
    
    if (page === 4) {
      if (!formData.date) newErrors.date = 'Track date is required';
      else if (formData.date > today) newErrors.date = 'Cannot be future date';
      
      if (!formData.time) newErrors.time = 'Track time is required';
      
      if (!formData.ewayBill.trim()) newErrors.ewayBill = 'Eway bill is required';
      // else if (!/^[A-Za-z0-9]{10,15}$/.test(formData.ewayBill)) newErrors.ewayBill = 'Invalid format (10-15 alphanumeric chars)';
      
      if (!formData.vendorCompany.trim()) newErrors.vendorCompany = 'Vendor company is required';
      
      if (!formData.vendorPerson.trim()) newErrors.vendorPerson = 'Vendor person is required';
      
      if (!formData.vechileNumber.trim()) newErrors.vechileNumber = 'Vehicle number is required';
      // else if (!/^[A-Za-z]{2}[0-9]{1,2}[A-Za-z]{0,2}[0-9]{4}$/.test(formData.vechileNumber)) {
      //   newErrors.vechileNumber = 'Invalid format (e.g. MH12AB1234)';
      // }
      
      
      if (!formData.trackLocation.trim()) newErrors.trackLocation = 'Location is required';
      
      if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
      
       if (!formData.invoiceDate) {
    newErrors.invoiceDate = 'Invoice date is required';
  } else if (formData.invoiceDate > new Date().toISOString().split('T')[0]) {
    newErrors.invoiceDate = 'Cannot be future date';
  }
      
      if (!formData.invoiceValue) newErrors.invoiceValue = 'Invoice value is required';
      else if (formData.invoiceValue <= 0) newErrors.invoiceValue = 'Must be positive';
      
      if (formData.remarks && formData.remarks.length > 500) newErrors.remarks = 'Maximum 500 characters allowed';
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
          .then(([bookingRes, logRes]) => {
            if (!bookingRes.ok || !logRes.ok) throw new Error('Submission failed');
            toast.success("Booking created successfully");
            navigate("/main/bookingListing");
          })
          .catch(err => {
            console.error(err);
            toast.error("Failed to create booking");
          })
          .finally(() => setIsSubmitting(false));
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Error checking booking ID");
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
                <Label className="form-label">Docket Number*</Label>
                <Input
                  name="bookingId"
                  value={formData.bookingId}
                  onChange={handleChange}
                  invalid={!!errors.bookingId}
                  className="form-input"
                  placeholder="4-12 alphanumeric characters"
                  maxLength={12}
                />
                {errors.bookingId && <small className="text-danger">{errors.bookingId}</small>}
              </FormGroup>
            </div>

            <h6 className="section-title mt-4">Consignor Details</h6>
            <div className="form-grid">
              <FormGroup>
                <Label className="form-label">Name*</Label>
                <Input
                  name="consignorName"
                  value={formData.consignorName}
                  onChange={handleConsignorSelect}
                  type="select"
                  invalid={!!errors.consignorName}
                  className="form-input"
                >
                  <option value="">Select Consignor</option>
{Array.isArray(consignorNames) && consignorNames.map(name => (
  <option key={name} value={name}>{name}</option>
))}

                </Input>
                {errors.consignorName && <small className="text-danger">{errors.consignorName}</small>}
              </FormGroup>

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
                <Label className="form-label">Name*</Label>
                <Input
                  name="consigneeName"
                  value={formData.consigneeName}
                  onChange={handleConsigneeSelect}
                  type="select"
                  invalid={!!errors.consigneeName}
                  className="form-input"
                >
                  <option value="">Select Consignee</option>
                  {Array.isArray(consignorNames) && consignorNames.map(name => (
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
          <Label className="form-label">No. of Packages*</Label>
          <Input
            name="numberOfPackage"
            type="number"
            value={formData.numberOfPackage}
            onChange={handleChange}
            invalid={!!errors.numberOfPackage}
            className="form-input"
            min="1"
          />
          {errors.numberOfPackage && <small className="text-danger">{errors.numberOfPackage}</small>}
        </FormGroup>

        <FormGroup>
          <Label className="form-label">Material Description*</Label>
          <Input
            name="materialDescription"
            value={formData.materialDescription}
            onChange={handleChange}
            invalid={!!errors.materialDescription}
            className="form-input"
            placeholder="Describe the material being shipped"
            minLength={5}
          />
          {errors.materialDescription && <small className="text-danger">{errors.materialDescription}</small>}
        </FormGroup>

        <FormGroup>
          <Label className="form-label">Booking Date*</Label>
          <Input
            name="bookingDate"
            type="date"
            value={formData.bookingDate}
            onChange={handleChange}
            invalid={!!errors.bookingDate}
            className="form-input"
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.bookingDate && <small className="text-danger">{errors.bookingDate}</small>}
        </FormGroup>

        {/* Actual Weight with validation */}
        <FormGroup>
          <Label className="form-label">Actual Weight (Kg)</Label>
          <Input
            name="actualWeight"
            type="number"
            value={formData.actualWeight}
            onChange={handleChange}
            className="form-input"
            min="0.01"
            step="0.01"
            invalid={!!errors.actualWeight}
          />
          {errors.actualWeight && <small className="text-danger">{errors.actualWeight}</small>}
        </FormGroup>

        {/* Charged Weight with validation */}
        <FormGroup>
          <Label className="form-label">Charged Weight (Kg)</Label>
          <Input
            name="chargedWeight"
            type="number"
            value={formData.chargedWeight}
            onChange={handleChange}
            className="form-input"
            min="0.01"
            step="0.01"
            invalid={!!errors.chargedWeight}
          />
          {errors.chargedWeight && <small className="text-danger">{errors.chargedWeight}</small>}
        </FormGroup>

        {/* Freight Charges with validation */}
        <FormGroup>
          <Label className="form-label">Freight Charges</Label>
          <Input
            name="frieghtCharges"
            type="number"
            value={formData.frieghtCharges}
            onChange={handleChange}
            className="form-input"
            min="0.01"
            step="0.01"
            invalid={!!errors.frieghtCharges}
          />
          {errors.frieghtCharges && <small className="text-danger">{errors.frieghtCharges}</small>}
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
                <Label className="form-label">Shipping Mode*</Label>
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
                <Label className="form-label">Payment Mode*</Label>
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
                <Label className="form-label">Insurance*</Label>
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
                <Label className="form-label">Booking Type*</Label>
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
                <Label className="form-label">ODA*</Label>
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
         // Get current time in HH:MM format
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // Set default time if not already set
  if (!formData.time) {
    setFormData(prev => ({ ...prev, time: currentTime }));
  }
        return (
          <div className="form-section">
            <h6 className="section-title">Additional Information</h6>
            <div className="form-grid">
              <FormGroup>
                <Label className="form-label">Eway Bill*</Label>
                <Input
                  name="ewayBill"
                  value={formData.ewayBill}
                  onChange={handleChange}
                  invalid={!!errors.ewayBill}
                  className="form-input"
                  placeholder="Fill EwayBill if invoice amount exceed Rs 50000/-"
                 
                />
                {errors.ewayBill && <small className="text-danger">{errors.ewayBill}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Vendor Company*</Label>
                <Input
                  name="vendorCompany"
                  value={formData.vendorCompany}
                  onChange={handleChange}
                  invalid={!!errors.vendorCompany}
                  className="form-input"
                  minLength={2}
                  maxLength={100}
                />
                {errors.vendorCompany && <small className="text-danger">{errors.vendorCompany}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Vendor Person*</Label>
                <Input
                  name="vendorPerson"
                  value={formData.vendorPerson}
                  invalid={!!errors.vendorPerson}
                  onChange={handleChange}
                  className="form-input"
                  minLength={2}
                  maxLength={50}
                />
                {errors.vendorPerson && <small className="text-danger">{errors.vendorPerson}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Vehicle Number*</Label>
                <Input
                  name="vechileNumber"
                  value={formData.vechileNumber}
                  invalid={!!errors.vechileNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. MH12AB1234"
                  // pattern="[A-Za-z]{2}[0-9]{1,2}[A-Za-z]{0,2}[0-9]{4}"
                />
                {errors.vechileNumber && <small className="text-danger">{errors.vechileNumber}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Track Location*</Label>
                <Input
                  name="trackLocation"
                  value={formData.trackLocation}
                  invalid={!!errors.trackLocation}
                  onChange={handleChange}
                  className="form-input"
                  minLength={3}
                  maxLength={100}
                />
                {errors.trackLocation && <small className="text-danger">{errors.trackLocation}</small>}
              </FormGroup>

              <FormGroup>
          <Label className="form-label">Track Date*</Label>
          <Input
            name="date"
            type="date"
            value={formData.date || new Date().toISOString().split('T')[0]} // Pre-fill today's date
            onChange={handleChange}
            invalid={!!errors.date}
            className="form-input"
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <small className="text-danger">{errors.date}</small>}
        </FormGroup>

              <FormGroup>
          <Label className="form-label">Track Time*</Label>
          <Input
            name="time"
            type="time"
            value={formData.time || currentTime} // Pre-fill current time
            onChange={handleChange}
            invalid={!!errors.time}
            className="form-input"
          />
          {errors.time && <small className="text-danger">{errors.time}</small>}
        </FormGroup>

              <FormGroup>
                <Label className="form-label">Invoice Number*</Label>
                <Input
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  invalid={!!errors.invoiceNumber}
                  onChange={handleChange}
                  className="form-input"
                  minLength={3}
                  maxLength={20}
                />
                {errors.invoiceNumber && <small className="text-danger">{errors.invoiceNumber}</small>}
              </FormGroup>

              <FormGroup>
  <Label className="form-label">Invoice Date*</Label>
  <Input
    name="invoiceDate"
    type="date"
    value={formData.invoiceDate }
    onChange={handleChange}
    invalid={!!errors.invoiceDate}
    className="form-input"
    max={new Date().toISOString().split('T')[0]}
  />
  {errors.invoiceDate && <small className="text-danger">{errors.invoiceDate}</small>}
</FormGroup>
              <FormGroup>
                <Label className="form-label">Invoice Value*</Label>
                <Input
                  name="invoiceValue"
                  type="number"
                  value={formData.invoiceValue}
                  invalid={!!errors.invoiceValue}
                  onChange={handleChange}
                  className="form-input"
                  min="0.01"
                  step="0.01"
                />
                {errors.invoiceValue && <small className="text-danger">{errors.invoiceValue}</small>}
              </FormGroup>

              <FormGroup>
                <Label className="form-label">Remarks</Label>
                <Input
                  name="remarks"
                  type="textarea"
                  value={formData.remarks}
                  invalid={!!errors.remarks}
                  onChange={handleChange}
                  className="form-input"
                  maxLength={500}
                />
                {errors.remarks && <small className="text-danger">{errors.remarks}</small>}
                <small className="text-muted">
                  {formData.remarks?.length || 0}/500 characters
                </small>
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
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
          
          {currentPage < 4 ? (
            <Button
              color="primary"
              onClick={nextPage}
              className="action-btn"
              disabled={isSubmitting}
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
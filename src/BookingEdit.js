import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Input, FormGroup, Label, Form } from "reactstrap";
import './BookingEdit.css';
import booking_url from "./api/bookingApi";
// import PodUploadForm from "./PodUploadForm";

const BookingEdit = () => {
  const { bookId } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State management
  const [formData, setFormData] = useState({
    bookingId: "",
    consignorName: "",
    consignorAddress: "",
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
    trackStatus: "",
    date: "",
    time: "",
    remarks: "",
    trackLocation: ""
  });

  useEffect(() => {
    fetch(`${booking_url}/booking/booking/` + bookId)
      .then(resp => resp.json())
      .then(resp => setFormData(resp))
      .catch(err => console.log(err.message));
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    fetch(`${booking_url}/logging/addLogs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    }).catch(err => console.log(err.message));

    fetch(`${booking_url}/booking/UpdateBooking/` + bookId, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => {
        alert("Updated successfully");
        navigate("/main/intransit");
      })
      .catch(err => console.log(err.message));
  };

  return (
    <div className="container-fluid py-3">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <Form onSubmit={handlesubmit} className="compact-form">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white p-2">
                <h6 className="mb-0">Update Status</h6>
              </div>
              
              <div className="card-body p-3">
                <div className="row g-2">
                  {/* Column 1 */}
                  <div className="col-md-6">
                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">LR Number</Label>
                      <Input 
                        name="bookingId"
                        value={formData.bookingId}
                        disabled
                        className="form-control form-control-sm"
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Charged Weight</Label>
                      <Input
                        type="number"
                        name="chargedWeight"
                        value={formData.chargedWeight}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Status</Label>
                      <Input
                        name="trackStatus"
                        value={formData.trackStatus}
                        onChange={handleChange}
                        type="select"
                        className="form-control form-control-sm"
                      >
                        <option>---Select---</option>
                        <option>Booking Confirmed</option>
                        <option>Confirm Pickup</option>
                        <option>Intransit</option>
                        <option>Reached Warehouse</option>
                        <option>Out For delivery</option>
                        <option>Delivered</option>
                        <option>Booking Cancelled</option>
                        <option>POD Uploaded</option>
                      </Input>
                    </FormGroup>
                  </div>

                  {/* Column 2 */}
                  <div className="col-md-6">
                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Status Date</Label>
                      <Input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Status Time</Label>
                      <Input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Location</Label>
                      <Input
                        type="text"
                        name="trackLocation"
                        value={formData.trackLocation}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                      />
                    </FormGroup>
                  </div>

                  {/* Full width row */}
                  <div className="col-12">
                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Remarks</Label>
                      <Input
                        type="text"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="form-control form-control-sm"
                      />
                    </FormGroup>
                    
                    {/* <PodUploadForm bookingId={bookId} className="mb-2" /> */}
                  </div>

                  {/* Action buttons */}
                  <div className="col-12 mt-2">
                    <div className="d-flex gap-2">
                      <Button 
                        type="submit" 
                        color="primary" 
                        size="sm"
                        disabled={isUpdating}
                        className="px-3"
                      >
                        {isUpdating ? 'Updating...' : 'Update'}
                      </Button>
                      <Link 
                        to="/main/intransit" 
                        className="btn btn-sm btn-outline-secondary px-3"
                      >
                        Back
                      </Link>
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

export default BookingEdit;
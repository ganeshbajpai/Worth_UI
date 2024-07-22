import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Input } from "reactstrap";
import './BookingEdit.css';
import booking_url from "./api/bookingApi";

const BookingEdit = () => {
  const { bookId } = useParams();

  const [isUpdating, setIsUpdating] = useState(false); // State to track updating status
  
  useEffect(() => {
    fetch(`${booking_url}/Demo/booking/` + bookId)
      .then((resp) => {
        return resp.json();
      })
      .then((resp) => {
        bookingIdchange(resp.bookingId);
        consignorNamechange(resp.consignorName);
        consignorAddresschange(resp.consignorAddress);
        consigneeNamechange(resp.consigneeName);
        consigneeAddresschange(resp.consigneeAddress);
        numberOfPackagechange(resp.numberOfPackage);
        bookingDatechange(resp.bookingDate);
        actualWeightchange(resp.actualWeight);
        chargedWeightchange(resp.chargedWeight);
        shippingModechange(resp.shippingMode);
        paymentModechange(resp.paymentMode);
        frieghtChargeschange(resp.frieghtCharges);
        invoiceNumberchange(resp.invoiceNumber);
        invoiceDatechange(resp.invoiceDate);
        invoiceValuechange(resp.invoiceValue);
        trackStatuschange(resp.trackStatus);
        insurancechange(resp.insurance);
        datechange(resp.date);
        timechange(resp.time);
        remarkschange(resp.remarks);
        trackLocationchange(resp.trackLocation);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [bookId]);

  const [bookingId, bookingIdchange] = useState("");
  const [consignorName, consignorNamechange] = useState("");
  const [consignorAddress, consignorAddresschange] = useState("");
  const [consigneeName, consigneeNamechange] = useState("");
  const [consigneeAddress, consigneeAddresschange] = useState("");
  const [numberOfPackage, numberOfPackagechange] = useState("");
  const [bookingDate, bookingDatechange] = useState("");
  const [actualWeight, actualWeightchange] = useState("");
  const [chargedWeight, chargedWeightchange] = useState("");
  const [shippingMode, shippingModechange] = useState("");
  const [paymentMode, paymentModechange] = useState("");
  const [frieghtCharges, frieghtChargeschange] = useState("");
  const [invoiceNumber, invoiceNumberchange] = useState("");
  const [invoiceDate, invoiceDatechange] = useState("");
  const [invoiceValue, invoiceValuechange] = useState("");
  const [insurance, insurancechange] = useState("");
  const [trackStatus, trackStatuschange] = useState("");
  const [date, datechange] = useState("");
  const [time, timechange] = useState("");
  const [remarks, remarkschange] = useState("");
  const [trackLocation, trackLocationchange] = useState("");

  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    setIsUpdating(true); // Set updating status to true
    const bookdata = {
      bookingId,
      consigneeName,
      consigneeAddress,
      consignorName,
      consignorAddress,
      numberOfPackage,
      bookingDate,
      actualWeight,
      chargedWeight,
      shippingMode,
      paymentMode,
      frieghtCharges,
      invoiceNumber,
      invoiceDate,
      invoiceValue,
      trackStatus,
      date,
      time,
      remarks,
      insurance,
      trackLocation,
    };

    fetch(`${booking_url}/Logging/addLogs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(bookdata),
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err.message);
      });

    fetch(`${booking_url}/Demo/UpdateBooking/` + bookId, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(bookdata),
    })
      .then((res) => {
        alert("Update Successfully..");
        navigate("/main/intransit");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <div className="row">
        <div className="offset-lg-1 col-lg-9">
          <form className="container" onSubmit={handlesubmit}>
            <div className="card" style={{ textAlign: "left" }}>
              <div className="card-title">
                <h2>Update Status</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>LR-Number</label>
                      <input
                        required
                        value={bookingId}
                        disabled="disabled"
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Charged Weight</label>
                      <input
                        required
                        type="number"
                        value={chargedWeight}
                        onChange={(e) => chargedWeightchange(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Status</label>

                      <Input
                        required
                        value={trackStatus}
                        onChange={(e) => trackStatuschange(e.target.value)}
                        className="form-control"
                        name="select"
                        type="select"
                      >
                        <option>---Select---</option>
                        <option>Booking Confirmed</option>
                        <option>Confirm Pickup</option>
                        <option>Intransit</option>
                        <option>Reached Destination Warehouse</option>
                        <option>Out For delivery</option>
                        <option>Delivered</option>
                        <option>Booking Cancelled</option>
                        <option>POD Uploaded</option>
                      </Input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Track Status Date</label>
                      <input
                        type="Date"
                        value={date}
                        onChange={(e) => datechange(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Track Status Time</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => timechange(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Track Location</label>
                      <input
                        type="text"
                        value={trackLocation}
                        onChange={(e) => trackLocationchange(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Remarks</label>
                      <input
                        type="text"
                        value={remarks}
                        onChange={(e) => remarkschange(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="btn-container">
                      {/* Disable button and show "Updating..." text when updating */}
                      <Button type="submit" color="success" disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update'}
                      </Button>
                      <Link to={"/main/intransit"} className="btn btn-danger">
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

export default BookingEdit;

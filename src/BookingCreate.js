import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import customer_url from "./api/customerapi";
import './BookingCreate.css';
import booking_url from "./api/bookingApi";
import {
  // Input,
  Container,
  Button,
} from "reactstrap";

const BookingCreate = () => {
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
  const [materialDescription, materialDescriptionchange] = useState("");
  const [bookingType, bookingTypechange] = useState("");
  const [ewayBill, ewayBillchange] = useState("");
  const [oda, odachange] = useState("");
  const [vendorCompany, vendorCompanychange] = useState("");
  const [vendorPerson, vendorPersonchange] = useState("");
  const [ vechileNumber, vechileNumberchange] = useState("");
  const [trackLocation, trackLocationchange] = useState("");

  // State to store consignor names fetched from the API
  const [consignorNames, setConsignorNames] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchConsignorNames();
  }, []);

  const fetchConsignorNames = (query = "") => {
    fetch(`${customer_url}/customer/companyNames?query=${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setConsignorNames(data);
        } else {
          console.error("Invalid data format for consignor names:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching consignor names:", error);
      });
  };

  const handleConsignorNameChange = (e) => {
    const selectedName = e.target.value;
    consignorNamechange(selectedName);
    fetch(`${customer_url}/customer/company/${selectedName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const address = `${data.company_Address} ${data.city} ${data.state} ${data.country} -${data.pincode}`;
        consignorAddresschange(address);
      })
      .catch((error) => {
        console.error("Error fetching consignor address:", error);
      });
  };

  // const handleConsignorNameInputChange = (e) => {
  //   const inputValue = e.target.value;
  //   consignorNamechange(inputValue);
  //   fetchConsignorNames(inputValue);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!consignorName || !shippingMode || !paymentMode || !insurance || !trackStatus || !oda || !bookingType) {
      alert("Please fill in all required fields!");
      return;
    }
    if (!bookingDate || !date || !time) {
      alert("Please select date and time!");
      return;
    }
    fetch(`${booking_url}/Demo/checkBookingIdExists/` + bookingId)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          alert("Booking ID already exists!");
        } else {
          const bookData = {
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
            insurance,
            remarks,
            materialDescription,
            bookingType,
            ewayBill,
            oda,
            vendorCompany,
            vendorPerson,
            vechileNumber,
            trackLocation,
          };

          fetch(`${booking_url}/Demo/addBooking`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(bookData),
          })
            .then((res) => res.json())
            .then((data) => {
              alert("Saved Successfully.");
              console.log(data);
            })
            .catch((err) => {
              console.log(err.message);
            })
            .finally(() => {
              setIsSubmitting(false);
            });

          fetch(`${booking_url}/Logging/addLogs`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(bookData),
          })
            .then((res) => {
              alert("Saved Successfully.");
              navigate("/main/bookingListing");
              console.log(res);
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <Container>
        <div className="row">
          <div className="offset-lg-1 col-lg-9">
            <form className="container" onSubmit={handleSubmit}>
              <div className="card" style={{ textAlign: "left" }}>
                <div className="card-title add-booking-heading">New Booking</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>LR-Number(Manual)</label>
                        <input
                          type="number"
                          required
                          value={bookingId}
                          onChange={(e) => bookingIdchange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Consignor Name</label>
                        <input
                          type="text"
                          required
                          value={consignorName}
                          onChange={handleConsignorNameChange}
                          list="consignorNames"
                          className="form-control"
                        />
                        <datalist id="consignorNames">
                          {consignorNames.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Consignor Address</label>
                        <input
                          required
                          value={consignorAddress}
                          readOnly
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Consignee Name</label>
                        <input
                          required
                          value={consigneeName}
                          onChange={(e) => consigneeNamechange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Consignee Address</label>
                        <input
                          required
                          value={consigneeAddress}
                          onChange={(e) => consigneeAddresschange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Number of package</label>
                        <input
                          required
                          type="number"
                          value={numberOfPackage}
                          onChange={(e) => numberOfPackagechange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Material Description</label>
                        <input
                          required
                          value={materialDescription}
                          onChange={(e) => materialDescriptionchange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Booking Date</label>
                        <input
                          required
                          type="date"
                          value={bookingDate}
                          onChange={(e) => bookingDatechange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Actual Weight</label>
                        <input
                          required
                          type="number"
                          value={actualWeight}
                          onChange={(e) => actualWeightchange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-6">
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
                        <label>Shipping Mode</label>
                        <select
                          required
                          value={shippingMode}
                          onChange={(e) => shippingModechange(e.target.value)}
                          className="form-control"
                        >
                          <option value="">Select Shipping Mode</option>
                          <option value="air">Air</option>
                          <option value="road">Road</option>
                          <option value="rail">Rail</option>
                          <option value="sea">Sea</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Payment Mode</label>
                        <select
                          required
                          value={paymentMode}
                          onChange={(e) => paymentModechange(e.target.value)}
                          className="form-control"
                        >
                          <option value="">Select Payment Mode</option>
                          <option value="prepaid">Prepaid</option>
                          <option value="collect">To Be Billed</option>
                          <option value="toPay">To-Pay</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Freight Charges</label>
                        <input
                          required
                          type="number"
                          value={frieghtCharges}
                          onChange={(e) => frieghtChargeschange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Invoice Number</label>
                        <input
                          required
                          value={invoiceNumber}
                          onChange={(e) => invoiceNumberchange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Invoice Date</label>
                        <input
                          required
                          type="date"
                          value={invoiceDate}
                          onChange={(e) => invoiceDatechange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Invoice Value</label>
                        <input
                          required
                          type="number"
                          value={invoiceValue}
                          onChange={(e) => invoiceValuechange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Insurance</label>
                        <select
                          required
                          value={insurance}
                          onChange={(e) => insurancechange(e.target.value)}
                          className="form-control"
                        >
                          <option value="">Select Insurance</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Track Status</label>
                        <select
                          required
                          value={trackStatus}
                          onChange={(e) => trackStatuschange(e.target.value)}
                          className="form-control"
                        >
                          <option value="">Select Track Status</option>
                          <option value="Booking Confirm">Booking Confirm</option>
                         
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          required
                          type="date"
                          value={date}
                          onChange={(e) => datechange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Time</label>
                        <input
                          required
                          type="time"
                          value={time}
                          onChange={(e) => timechange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Remarks</label>
                        <textarea
                          value={remarks}
                          onChange={(e) => remarkschange(e.target.value)}
                          className="form-control"
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Booking Type</label>
                        <select
                          required
                          value={bookingType}
                          onChange={(e) => bookingTypechange(e.target.value)}
                          className="form-control"
                        >
                          <option value="">Select Booking Type</option>
                          <option value="general">PTL</option>
                          <option value="express">FTL</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Eway Bill</label>
                        <input
                          required
                          type="text"
                          value={ewayBill}
                          onChange={(e) => ewayBillchange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>ODA</label>
                        <select
                          required
                          value={oda}
                          onChange={(e) => odachange(e.target.value)}
                          className="form-control"
                        >
                          <option value="">Select ODA</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Vendor Company</label>
                        <input
                          required
                          value={vendorCompany}
                          onChange={(e) => vendorCompanychange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Vendor Person</label>
                        <input
                          required
                          value={vendorPerson}
                          onChange={(e) => vendorPersonchange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                    <div className="form-group">
                      <label>Vechile Number</label>
                      <input
                        required
                        type="text"
                        value={vechileNumber}
                        onChange={(e) => vechileNumberchange(e.target.value)}
                        className="form-control"
                      ></input>
                      
                    </div>
                  </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Track Location</label>
                        <input
                          required
                          value={trackLocation}
                          onChange={(e) => trackLocationchange(e.target.value)}
                          className="form-control"
                        ></input>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Booking..." : "Book"}
                        </Button>
                        <Link to="/main/bookingListing" className="btn btn-secondary">Back</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BookingCreate;

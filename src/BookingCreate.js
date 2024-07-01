import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import customer_url from "./api/customerapi";
import './BookingCreate.css';
import booking_url from "./api/bookingApi";
import {
  
  Input,
  
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
  const [materialDescription,materialDescriptionchange] = useState("");
  const [bookingType, bookingTypechange] = useState("");
  const [ewayBill, ewayBillchange] = useState("");
  const [oda,odachange] = useState("");
  const [vendorCompany, vendorCompanychange] = useState("");
  const [vendorPerson,vendorPersonchange] = useState("");
  const [vechileNumber, vechileNumberchange] = useState("");
  const[trackLocation,trackLocationchange]=useState("");
// State to store consignor names fetched from the API
const [consignorNames, setConsignorNames] = useState([]);
const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status
  const [] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch consignor names from the API when the component mounts
    fetchConsignorNames();
  }, []);

  // Method to fetch consignor names from the API
  const fetchConsignorNames = () => {
    fetch(`${customer_url}/customer/companyNames`)
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

  // Method to handle changes in the Consignor Name dropdown
  const handleConsignorNameChange = (e) => {
    const selectedName = e.target.value;
    consignorNamechange(selectedName);
    // Fetch consignor address corresponding to the selected name
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
  
  const handlesubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
// Check if the dropdown values are not null
if (!consignorName || !shippingMode || !paymentMode || !insurance || !trackStatus || !oda || !bookingType) {
  alert("Please fill in all required fields!");
  return;
}
// Check if the date and time fields are not null
if (!bookingDate || !date || !time) {
  alert("Please select date and time!");
  return;
}
    // Check if the booking ID already exists
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
            insurance,
            remarks,
            materialDescription,
            bookingType,
            ewayBill,oda,vendorCompany,vendorPerson,vechileNumber,trackLocation,
          };

          fetch(`${booking_url}/Demo/addBooking`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(bookdata),
          })
            .then((res) => res.json())
            .then((data) => {
              alert("Saved Successfully..");
              console.log(data);
            })
            .catch((err) => {
              console.log(err.message);
            })
            .finally(() => {
              setIsSubmitting(false); // Set submission status to false after submission completes
            });
      
            

          fetch(`${booking_url}/Logging/addLogs`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(bookdata),
          })
            .then((res) => {
              alert("Saved Successfully..");
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
    <form className="container" onSubmit={handlesubmit}>
      <div className="card" style={{ textAlign: "left" }}>
        <div className="card-title add-booking-heading">
          New Booking
        </div>
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
                      <select
                        required
                        value={consignorName}
                        onChange={handleConsignorNameChange}
                        className="form-control"
                      >
                        <option value="">--Select Consignor--</option>
                        {consignorNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
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
                        type="text"
                        value={materialDescription}
                        onChange={(e) => materialDescriptionchange(e.target.value)}
                        className="form-control"
                      ></input>
                      
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Booking Type</label>
                      <Input
                        required
                        type="select"
                        value={bookingType}
                        onChange={(e) => bookingTypechange(e.target.value)}
                        className="form-control"
                      >
                        <option>---Select---</option>
                        <option>PTL</option>
                        <option>FTL</option>
                        <option>Courier</option>
                      </Input>
                      
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>ODA</label>
                      <Input
                        required
                        type="select"
                        value={oda}
                        onChange={(e) => odachange(e.target.value)}
                        className="form-control"
                      >
                        <option>---Select---</option>
                        <option>NO</option>
                        <option>YES</option>
                                  </Input>
                      
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Ewaybill Number</label>
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
                      <label>Vendor Company</label>
                      <input
                        required
                        type="text"
                        value={vendorCompany}
                        onChange={(e) => vendorCompanychange(e.target.value)}
                        className="form-control"
                      ></input>
                      
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Vendor Sales Person</label>
                      <input
                        required
                        type="text"
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
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Booking Date</label>
                      <input
                        required
                        type="Date"
                        value={bookingDate}
                        onChange={(e) => bookingDatechange(e.target.value)}
                        className="form-control"
                      ></input>
                      
                    </div>
                  </div>
                  <div className="col-lg-12">
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
                      <label>Shipping Mode</label>
                      <Input required
                        value={shippingMode}
                        onChange={(e) => shippingModechange(e.target.value)}
                        className="form-control"
                       
                       name="select"
                       type="select"
                      >
                        <option>---Select---</option>
                        <option>Surface</option>
                        <option>Air</option>
                        <option>Ship</option>

                            </Input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <Input required
                        value={paymentMode}
                        onChange={(e) => paymentModechange(e.target.value)}
                        className="form-control"
                       
                       name="select"
                       type="select"
                      >
                        <option>---Select---</option>
                        <option>Cash</option>
                        <option>To be Billed</option>
                        <option>To-Pay</option>

                            </Input>
                                        </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Insurance Type</label>
                      <Input required
                        value={insurance}
                        onChange={(e) => insurancechange(e.target.value)}
                        className="form-control"
                       
                       name="select"
                       type="select"
                      >
                        <option>---Select---</option>
                        <option>Owner Risk</option>
                        <option>Carrier Risk</option>
                        

                            </Input>
                                        </div>
                  </div>



                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Frieght Charges</label>
                      <input
                      required
                      type="number"
                        value={frieghtCharges}
                        onChange={(e) => frieghtChargeschange(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
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
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Invoice Date</label>
                      <input
                       required
                        type="Date"
                        value={invoiceDate}
                        onChange={(e) => invoiceDatechange(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-12">
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
                  
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Status</label>

                      <Input required
                        value={trackStatus}
                        onChange={(e) => trackStatuschange(e.target.value)}
                        className="form-control"
                       
                       name="select"
                       type="select"
                      >
                        <option>---Select---</option>
                        <option>Booking Confirmed</option>
                        
                      </Input>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Track Status Date</label>
                      <input
                       required
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
                      <label>Track Location</label>
                      <input
                       required
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
                       required
                      type="text"
                       value={remarks}
                        onChange={(e) => remarkschange(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                  

                  
                  <div className="col-lg-12">
                    <div className="form-group">
                    <Button type="submit" color="success" disabled={isSubmitting}>
                  {isSubmitting ? "Booking in Progress..." : "Submit"}
                </Button>
                      <Link to={"/main/bookingListing"} className="btn btn-danger">
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

      
      
    </Container>
    </div>
  );
};
export default BookingCreate;

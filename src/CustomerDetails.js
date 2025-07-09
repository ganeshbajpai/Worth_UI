import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import customer_url from "./api/customerapi";

 

import "./CustomerDetails.css";

const CustomerDetails = () => {
  const { custId } = useParams();
  const [custdata, setCustdata] = useState({});
  const [bookings, setBookings] = useState([]);
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");
  // const [showInvoice, setShowInvoice] = useState(false);
  // const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    fetch(`${customer_url}/customer/customerDetails/${custId}`)
      .then((res) => res.json())
      .then((resp) => setCustdata(resp))
      .catch((err) => console.log(err.message));
  }, [custId]);

  useEffect(() => {
    if (custdata.companyName) {
      fetch(
        `${customer_url}/api/customers/bookings?consignorName=${encodeURIComponent(
          custdata.companyName
        )}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch bookings");
          return res.json();
        })
        .then((data) => setBookings(data))
        .catch((err) => console.error(err.message));
    }
  }, [custdata.companyName]);

  const handleDownloadPOD = async (bookingId) => {
    try {
      const response = await fetch(`${customer_url}/api/files/download/${bookingId}`);
      if (!response.ok) throw new Error("Failed to download POD");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `POD_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  // const filterInvoices = () => {
  //   if (!fromDate || !toDate) {
  //     alert("Please select both From and To dates.");
  //     return;
  //   }

  //   const from = new Date(fromDate);
  //   const to = new Date(toDate);
  //   const result = bookings.filter((b) => {
  //     const date = new Date(b.bookingDate);
  //     return date >= from && date <= to;
  //   });
  //   setFilteredBookings(result);
  // };

  return (
    <div className="customer-container">
      <div className="customer-card">
        <div className="customer-title">Customer Details</div>

        {custdata && (
          <div>
            <h3 className="customer-heading">{custdata.companyName}</h3>
            <h5 className="customer-subheading">Customer ID: {custdata.customerId}</h5>
            <h6 className="customer-subheading">
              Address: {custdata.companyAddress}, {custdata.city}, {custdata.state} -{" "}
              {custdata.pincode}, {custdata.country}
            </h6>
            <h6 className="customer-subheading">Contact Person: {custdata.contactPerson}</h6>
            <h6 className="customer-subheading">Contact: {custdata.contactNumber}</h6>
            <h6 className="customer-subheading">Email Id: {custdata.emailId}</h6>
            <h6 className="customer-subheading">GSTIN: {custdata.gstNo}</h6>
          </div>
        )}



        {/* Booking Table */}
        {bookings.length > 0 ? (
          <div className="booking-section">
            <h4 className="customer-heading">Customer Bookings</h4>
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                  <th>Weight</th>
                  <th>Quantity</th>
                  <th>Download POD</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>{booking.bookingId}</td>
                    <td>{booking.bookingDate}</td>
                    <td>{booking.trackStatus}</td>
                    <td>{booking.chargedWeight}</td>
                    <td>{booking.numberOfPackage}</td>
                    <td>
                      {booking.trackStatus === "Delivered" ? (
                        <button
                          onClick={() => handleDownloadPOD(booking.bookingId)}
                          className="download-btn"
                        >
                          Download POD
                        </button>
                      ) : (
                        <span style={{ color: "#888" }}>Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-booking-msg">No bookings found for this customer.</p>
        )}

        {/* Tax Invoice Filter Section */}
        {/* <div className="invoice-filter">
          <h4>Generate Tax Invoice</h4>
          <div>
            <label>From Date: </label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <label style={{ marginLeft: "10px" }}>To Date: </label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            <button className="invoice-btn" onClick={filterInvoices} style={{ marginLeft: "10px" }}>
              Generate
            </button>
          </div>

          {filteredBookings.length > 0 && (
            <div>
              <h5 style={{ marginTop: "20px" }}>Invoice(s) for selected date range:</h5>
              {filteredBookings.map((booking) => (
                <div key={booking.bookingId} style={{ margin: "30px 0" }}>
                
                </div>
              ))}
            </div>
          )}
          {showInvoice && (
  <OfficialTaxInvoice
    customer={custdata}
    bookings={bookings}
    onClose={() => setShowInvoice(false)}
  />
)}
<button onClick={() => setShowInvoice(true)}>🧾 Official Tax Invoice</button>

        </div> */}

        <Link className="back-btn" to="/main/customer">
          Back
        </Link>
      </div>
    </div>
  );
};

export default CustomerDetails;

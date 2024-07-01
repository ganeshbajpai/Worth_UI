import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, Table } from "reactstrap";
import {} from "bootstrap";
import { useReactToPrint } from "react-to-print";
import './BookingDetails.css';
import logo from "./components/Assets/icon.png"; 
import booking_url from "./api/bookingApi";
const BookingDetails = () => {
  const { bookId } = useParams();

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [bookdata, bookdatachange] = useState({});

  useEffect(() => {
    fetch(`${booking_url}/Demo/booking/` + bookId)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        bookdatachange(resp);
        console.log(resp);
        toast.success("Booking has been loaded");
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("something went wrong");
      });
  }, []);

  return (
    <div >
      <div className="d-flex justify-content-between align-items-center">
        <h2>Booking Details</h2>
        <div>
          <Button color="primary" onClick={handlePrint}>
            Print
          </Button>
          <Link className="btn btn-warning ml-2" to="/main/bookingListing">
            Back
          </Link>
        </div>
      </div>
      
     
      <div className="card" style={{ textAlign: "left" }}>
        <div className="card-title"></div>
        <div className="card-body"></div>

        {bookdata && (
          <div className="mb-4">
            <card>
              <h3>Booking Status</h3>
              <Table className="text-center" bordered>
                <thead>
                  <tr>
                    <th>Current Status</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{bookdata.trackStatus}</th>
                    <td>{bookdata.trackLocation}</td>
                    <td>{bookdata.date} </td>
                    <td>{bookdata.time} </td>
                    <td>{bookdata.remarks} </td>
                  </tr>
                </tbody>
              </Table>
            </card>
            <div ref={printRef}>
              <Card>
                <Button className="text-center" color="primary">
                  {" "}
                  LR-Number : {bookdata.bookingId}
                </Button>

                <header className="text-center">
                <img src={logo} alt="Company Logo" style={logoStyle}/>
                  <h6>Reliance Industries Ltd.</h6>
                  <h6>A-280 Sec-83, Noida,UP-201301</h6>
                  <h6>Phone: +919990370943</h6>
                  <h6>GSTIN:09ASDFFGHH1Z</h6>
                </header>

                <Table className="text-center" bordered>
                  <thead>
                    <tr>
                      <th>Consignor Name</th>
                      <th>Consignor Address</th>
                      <th>Consignee Name</th>
                      <th>Consignee Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{bookdata.consignorName}</th>
                      <td>{bookdata.consignorAddress} </td>
                      <th>{bookdata.consigneeName} </th>
                      <td>{bookdata.consigneeAddress} </td>
                    </tr>
                  </tbody>
                </Table>
                <Table className="text-center" bordered>
                  <thead>
                    <tr>
                      <th>Booking Date</th>
                      <th>Number of Package</th>
                      <th>Actual Weight</th>
                      <th>Charged Weight</th>
                      <th>Shipping Mode</th>
                      <th>Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{bookdata.bookingDate}</td>
                      <td>{bookdata.numberOfPackage} </td>
                      <td>{bookdata.actualWeight} </td>
                      <td>{bookdata.chargedWeight} </td>
                      <td>{bookdata.shippingMode} </td>
                      <td>{bookdata.paymentMode} </td>
                    </tr>
                  </tbody>
                </Table>
                <Table className="text-center" bordered>
                  <thead>
                    <tr>
                      <th>Booking Type</th>
                      <th>Invoice Number</th>
                      <th>Invoice Date</th>
                      <th>Ewaybill Number</th>
                      <th>ODA Location</th>
                      <th>Vechile Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{bookdata.bookingType} </td>
                      <td>{bookdata.invoiceNumber} </td>
                      <td>{bookdata.invoiceDate} </td>
                      <td>{bookdata.ewayBill} </td>
                      <td>{bookdata.oda} </td>
                      <td>{bookdata.vechileNumber}</td>
                    </tr>
                  </tbody>
                </Table>
                <Table className="text-center" bordered>
                  <thead>
                    <tr>
                      <th>Material Description</th>
                      <th>Frieght Charges</th>
                      <th>Invoice Value</th>
                      <th>Insurance Type</th>
                      <th>Vendor Company</th>
                      <th>Vendor Salesman</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{bookdata.materialDescription}</td>
                      <td>{bookdata.frieghtCharges}</td>
                      <td>{bookdata.invoiceValue} </td>
                      <td>{bookdata.insurance}</td>
                      <td>{bookdata.vendorCompany}</td>
                      <td>{bookdata.vendorPerson} </td>
                    </tr>
                  </tbody>
                </Table>
                <Table className="text-center" bordered>
                  <thead>
                    <tr>
                      <th>Signature </th>
                      <th>Stamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Button></Button>
                      </td>
                      <td>
                        {" "}
                        <Button></Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </div>
           
          </div>
        )}
      </div>
    </div>
  );
};
const logoStyle = {
  width: "50px", // Adjust the width of the logo as needed
  height: "50px", // Adjust the height of the logo as needed
  marginRight: "1rem", // Adjust the spacing between the logo and company name
};
export default BookingDetails;

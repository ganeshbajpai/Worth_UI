import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { useReactToPrint } from "react-to-print";
// import html2pdf from "html2pdf.js";
import { QRCodeCanvas } from "qrcode.react";
import './BookingDetails.css';
import logo from "./components/Assets/logo.png";
import booking_url from "./api/bookingApi";

const BookingDetails = () => {
  const { bookId } = useParams();
  const printRef = useRef();
  const [bookdata, setBookdata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `LR-${bookdata?.bookingId || "booking"}`,
    onBeforeGetContent: () => {
      if (!bookdata) {
        toast.warning("Data is still loading, please wait...");
        return Promise.reject("Data not loaded");
      }
      return Promise.resolve();
    },
  });

  // const handleDownload = () => {
  //   if (!bookdata) {
  //     toast.warning("Data not loaded yet");
  //     return;
  //   }

  //   const element = printRef.current;
  //   const opt = {
  //     margin: 5,
  //     filename: `LR_${bookdata.bookingId}.pdf`,
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { 
  //       scale: 2,
  //       logging: true,
  //       useCORS: true,
  //       scrollX: 0,
  //       scrollY: 0,
  //       windowWidth: 1200
  //     },
  //     jsPDF: { 
  //       unit: 'mm',
  //       format: 'a4',
  //       orientation: 'landscape'
  //     }
  //   };

  //   // Create a clone of the element to avoid layout issues
  //   const clone = element.cloneNode(true);
  //   clone.style.position = 'absolute';
  //   clone.style.left = '-9999px';
  //   clone.style.top = '0';
  //   clone.style.width = '297mm'; // A4 landscape width
  //   document.body.appendChild(clone);

  //   // Add slight delay to ensure rendering
  //   setTimeout(() => {
  //     html2pdf()
  //       .set(opt)
  //       .from(clone)
  //       .save()
  //       .then(() => {
  //         document.body.removeChild(clone);
  //       })
  //       .catch(err => {
  //         console.error('PDF generation error:', err);
  //         toast.error('Failed to generate PDF');
  //         document.body.removeChild(clone);
  //       });
  //   }, 300);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${booking_url}/booking/booking/${bookId}`);
        const data = await response.json();
        setBookdata(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId]);


  const renderPrintCopy = (label) => (
    <div className="lr-copy mb-3" key={label}>
      <div className="content">
        <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2 flex-wrap">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Logo" style={{ width: 120, height: 120, marginRight: 10 }} />
            <div>
              <h5 className="mb-0">WorthCart Pvt Ltd.</h5>
              <small>A-280, Sec-83, Noida, UP-201301</small><br />
              <small>Phone: +91 9990370943 | GSTIN: 09ASDFFGHH1Z</small><br />
              <small>Mail: sales@worthcartindia.com</small>
            </div>
          </div>
          <div className="text-end text-sm-start mt-2">
            <strong>{label}</strong><br />
            <span>LR No: <strong>{bookdata?.bookingId}</strong></span><br />
            {bookdata && (
              <QRCodeCanvas
                value={`Booking: ${bookdata.bookingId}, From: ${bookdata.consignorName}, To: ${bookdata.consigneeName}`}
                size={64}
              />
            )}
          </div>
        </div>

        <div className="row small mb-2">
          <div className="col-6 border p-1"><strong>Consignor:</strong> {bookdata?.consignorName}</div>
          <div className="col-6 border p-1"><strong>Consignee:</strong> {bookdata?.consigneeName}</div>
          <div className="col-6 border p-1"><strong>Consignor Addr:</strong> {bookdata?.consignorAddress}</div>
          <div className="col-6 border p-1"><strong>Consignee Addr:</strong> {bookdata?.consigneeAddress}</div>
        </div>

        <div className="row small mb-2 gx-0">
          {[
            "Booking Date", "No. of Packages", "Actual Weight", "Charged Weight", "Shipping Mode",
            "Payment Mode", "Booking Type", "Invoice No.", "Invoice Date", "Eway Bill", "ODA Location",
            "Vehicle No.", "Description", "Freight Charges", "Invoice Value", "Insurance",
            "Vendor", "Salesman"
          ].map((label, i) => {
            const keys = [
              "bookingDate", "numberOfPackage", "actualWeight", "chargedWeight", "shippingMode",
              "paymentMode", "bookingType", "invoiceNumber", "invoiceDate", "ewayBill", "oda",
              "vechileNumber", "materialDescription", "frieghtCharges", "invoiceValue", "insurance",
              "vendorCompany", "vendorPerson"
            ];
            return (
              <div key={i} className="col-6 col-sm-4 col-md-2 border p-1" style={{ fontSize: "0.7rem", minHeight: "55px" }}>
                <strong>{label}:</strong><br />
                <span>{bookdata?.[keys[i]] || "-"}</span>
              </div>
            );
          })}
        </div>

        <div className="text-center small border border-dark p-2 mt-2" style={{ minHeight: "60px" }}>
          ____________________ Signature (For WorthCart Pvt Ltd)
        </div>

        <div className="mt-2 border-top pt-2 small text-muted" style={{ fontSize: "0.65rem" }}>
          <strong>Terms & Conditions:</strong><br />
          1. Goods booked at Owner's risk. 2. Carrier not liable for delay due to acts of God or public enemy.<br />
          3. Ensure packaging is tamper-proof. 4. Disputes under Noida jurisdiction.
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="container my-4 text-center">Loading booking details...</div>;
  }

  if (!bookdata) {
    return <div className="container my-4 text-center text-danger">Failed to load booking details</div>;
  }

  return (
    <div className="container my-4">
      {/* Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap no-print">
        <h5 className="table-blur-container">Booking Details</h5>
        <div>
          
          <Button color="primary" onClick={handlePrint} disabled={!bookdata}>Print</Button>{' '}
          {/* <Button color="success" onClick={handleDownload} disabled={!bookdata}>Download</Button>{' '} */}
          <Link to="/main/bookingListing" className="btn btn-warning">Back</Link>
        </div>
      </div>

      {/* Show only one copy on screen */}
      <div className="d-block d-print-none print-blur-container">
        {renderPrintCopy("Copy 1 - Office Use")}
      </div>

      {/* Hidden area only for print/download */}
      <div ref={printRef} className="d-none d-print-block print-area">
        {bookdata && ["Copy 1 - Office Use", "Copy 2 - Customer Use", "Copy 3 - Driver Copy"].map(label =>
          renderPrintCopy(label)
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
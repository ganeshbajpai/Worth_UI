import React, { useState, useEffect } from "react";
import { Button, Input, Spinner, Alert } from "reactstrap";
import booking_url from "./api/bookingApi";
import "./Track.css";

const Track = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showBanner, setShowBanner] = useState(true);


  const adImages = [
    "/ads/ad1.jpg",
    "/ads/ad2.jpg",
    "/ads/ad3.jpg",
    "/ads/ad4.jpg",
    "/ads/ad5.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adImages.length);
    }, 4000); // rotate every 4 seconds
    return () => clearInterval(interval);
  }, [adImages.length]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${booking_url}/logging/booking/${query}`);
      if (!res.ok) throw new Error("Invalid LR Number");

      const data = await res.json();
      if (!data.length) throw new Error("Invalid LR Number");

      setResults(data);
    } catch (err) {
      setResults([]);
      const audio = new Audio("/error-sound.mp3");
      audio.play();

      setError("Invalid LR Number");
      document.getElementById("track-alert")?.classList.add("shake");
      setTimeout(() => {
        document.getElementById("track-alert")?.classList.remove("shake");
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setResults([]);
    setError("");
  };

  const handleDownloadPOD = async (bookingId) => {
    try {
      const response = await fetch(`${booking_url}/api/files/download/${bookingId}`);
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

  return (
    <div className="track-page">
      {showBanner && (
  <div className="scroll-banner">
    <div className="scroll-text">
      🚚 Welcome to the Logistics Tracking page! Stay tuned for updates and announcements.
    </div>
    <button
      onClick={() => setShowBanner(false)}
      className="btn btn-sm btn-close ms-3"
      aria-label="Close"
    ></button>
  </div>
)}
      {/* Company Header */}
      <div className="company-header">
        
        <img src="/logo.png" alt="Company Logo" className="company-logo" />
        <div className="company-name">
          <h2>WORTHCART LOGISTICS TRACKING</h2>
          {/* <p>A-280, GF, Transport Nagar, Sector 69, Noida-201301</p>
          <p>GSTIN: 09AACCW9017C1ZD | Email: sales@vediclogistics.com</p> */}
        </div>
      </div>


      {/* Track Box in Center */}
      <div className="track-container">
        <form onSubmit={handleSearch} className="track-form">
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter Booking ID"
            className="track-input"
          />
          <Button color="primary" type="submit" disabled={isLoading} className="track-button">
            {isLoading ? <Spinner size="sm" /> : "Track"}
          </Button>
        </form>

        {error && (
          <Alert color="danger" id="track-alert" className="track-alert">
            {error}
          </Alert>
        )}

        {results.length > 0 && (
          <div className="track-results">
            <div className="track-summary">
              <span><strong>Booking Id:</strong> {results[0].bookingId}</span>
              <span><strong>From:</strong> {results[0].consignorName} </span>
              <span><strong>Add:</strong> {results[0].consignorAddress}</span>
              <span><strong>To:</strong> {results[0].consigneeName} </span>
              <span><strong>Add:</strong>  {results[0].consigneeAddress} </span>
            </div>

            <div className="track-timeline">
  {results.map((step, idx) => (
    <div key={idx} className="track-step">
      <img src={getStatusImage(step.trackStatus)} alt={step.trackStatus} className="track-icon" />

      <div className="track-details">
        <div className="track-row">
          <strong>Status:</strong> <span>{step.trackStatus}</span>
        </div>
        <div className="track-row">
          <strong>Location:</strong> <span>{step.trackLocation}</span>
        </div>
        <div className="track-row">
          <strong>Date & Time:</strong> <span>{step.date} {step.time}</span>
        </div>
        <div className="track-row">
          <strong>Remarks:</strong> <span>{step.remarks}</span>
        </div>
      </div>
    </div>
  ))}
</div>


            {results.some(step => step.trackStatus === "Delivered") && (
              <div className="text-center mt-3">
                <Button color="success" onClick={() => handleDownloadPOD(results[0].bookingId)}>
                  Download POD
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📢 Advertisement Banner at Footer */}
      <div className="ad-footer">
        <img
          src={adImages[currentAdIndex]}
          alt="Advertisement"
          className="ad-banner"
        />
      </div>
    </div>
  );
};

const getStatusImage = (status) => {
  switch (status) {
    case "Intransit":
      return "/real-time-tracking.png";
    case "Delivered":
      return "/delivered.png";
    case "Reached Warehouse":
      return "/warehouse.png";
    case "Confirm Pickup":
      return "/navigation.png";
    case "Out for Delivery":
      return "/real-time-tracking.png";
    case "Booking Confirmed":
      return "/001.png";
    default:
      return "/default-status.png";
  }
};

export default Track;

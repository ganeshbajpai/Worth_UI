import React, { useState } from "react";
import axios from "axios";
import booking_url from "./api/bookingApi";

const PodUploadForm = ({ bookingId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!bookingId || !selectedFile) {
      setUploadMessage("❗ Booking ID and POD file are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${booking_url}/api/files/upload/${bookingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setUploadMessage("✅ POD uploaded successfully: " + response.data);
    } catch (error) {
      if (error.response) {
        setUploadMessage(`❌ Error ${error.response.status}: ${error.response.data}`);
      } else if (error.request) {
        setUploadMessage("❌ No response from server. Check backend.");
      } else {
        setUploadMessage("❌ Upload failed: " + error.message);
      }
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h5>Upload POD (Proof of Delivery)</h5>
      <input type="file" onChange={handleFileChange} />
      <button className="btn btn-primary" onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload POD
      </button>
      {uploadMessage && (
        <p style={{ marginTop: "10px", color: uploadMessage.startsWith("✅") ? "green" : "red" }}>
          {uploadMessage}
        </p>
      )}
    </div>
  );
};

export default PodUploadForm;

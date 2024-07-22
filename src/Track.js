import React, { useState } from "react";
import { Button, Input, Table, Spinner, Alert } from "reactstrap";
import booking_url from "./api/bookingApi";
import "./Track.css"; // Import the custom CSS

const Track = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${booking_url}/Logging/booking/${query}`);
      if (!response.ok) {
        throw new Error("Invalid AWB or Result not found");
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error("Invalid AWB or Result not found");
      }
      setResults(data);
    } catch (err) {
      setResults([]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (results.length > 0) {
      setResults([]);
    }
    if (error) {
      setError("");
    }
  };

  return (
    <div className="container">
      <div className="search-box">
        <h2>Logistics Tracking</h2>
        <form onSubmit={handleSearch}>
          <div className="input-group mb-3">
            <Input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter Booking ID or Details"
              className="form-control"
            />
            <div className="input-group-append">
              <Button type="submit" color="primary" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Search"}
              </Button>
            </div>
          </div>
        </form>
        {error && <Alert color="danger">{error}</Alert>}
      </div>
      {results.length > 0 && (
        <Table striped className="results-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Consignor Name</th>
              <th>Consignee Name</th>
              <th>Status</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.bookingId}>
                <td>{result.bookingId}</td>
                <td>{result.consignorName}</td>
                <td>{result.consigneeName}</td>
                <td>{result.trackStatus}</td>
                <td>{result.trackLocation}</td>
                <td>{result.date}</td>
                <td>{result.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Track;

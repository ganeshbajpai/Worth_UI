import {  useRef, useState } from "react";
import { Button, Card, Input, Table } from "reactstrap";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import axios from "axios";
import './Tracking.css';

function Tracking() {
  const [getuserdata, setGetuserdata] = useState([]);
  const [query, setQuery] = useState("");
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetuserdata([]);

    try {
      const response = await axios.get(
        `http://localhost:8086/Logging/booking/${query}`
      );
      setGetuserdata(response.data); // Assuming API returns an object containing data
      toast.success("Loaded..");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong");
    }
  };

  const reset = () => {
    setQuery("");
    setGetuserdata([]); // Clear the data
  };

  return (
    <div className="tracking-container">
      <Card className="tracking-card">
        <h2>Track Status</h2>
        <form onSubmit={handleSubmit} className="tracking-form">
          <Input
            type="number"
            name="bookingId"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter LR Number..."
          />
          <Button type="submit" color="primary">Search</Button>
          <Button onClick={reset} color="secondary">Reset</Button>
        </form>
        <Button className="print-button" color="warning" onClick={handlePrint}>
          Print Status
        </Button>
      </Card>
      
      <div ref={printRef} className="tracking-results">
        <h3>Tracking Results</h3>
        {getuserdata.length > 0 ? (
          <Table bordered>
            <thead>
              <tr>
                <th colSpan="7">LR Number: {getuserdata[0].bookingId}</th>
              </tr>
              <tr>
                <th>Consignor</th>
                <th>Status</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {getuserdata.map((data) => (
                <tr key={data.bookingId}>
                  <td>{data.consignorName}</td>
                  <td>{data.trackStatus}</td>
                  <td>{data.trackLocation}</td>
                  <td>{data.date}</td>
                  <td>{data.time}</td>
                  <td>{data.remarks}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}

export default Tracking;

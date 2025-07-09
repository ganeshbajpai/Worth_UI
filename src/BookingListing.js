import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { toast } from "react-toastify";
import './BookingListing.css';
import booking_url from "./api/bookingApi";

const BookingListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15); // Number of items per page
  const [bookdata, setBookdata] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const LoadDetails = (bookingId) => {
    navigate("/main/booking/details/" + bookingId);
  };

  // const exportToCsv = () => {
  //   if (bookdata.length === 0) {
  //     toast.error("No data available to export");
  //     return;
  //   }

  //   const header = Object.keys(bookdata[0]).join(",") + "\n";
  //   const csv = header + bookdata.map((item) => 
  //     Object.values(item)
  //       .map(value => `"${String(value).replace(/"/g, '""')}"`)
  //       .join(",")
  //   ).join("\n");

  //   const csvBlob = new Blob([csv], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(csvBlob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", "bookings.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  useEffect(() => {
    fetch(`${booking_url}/booking/ordered`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("API response was not OK");
        }
        return res.json();
      })
      .then((resp) => {
        const data = Array.isArray(resp) ? resp : resp.data || [];
        setBookdata(data);
        // toast.success("Booking data has been loaded");
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setBookdata([]); // 👈 Ensure it's an array even on error
        toast.error("Failed to load booking data. Is the API running?");
      });
  }, []);
  
  
  // Filter data based on search query
  const filteredData = Array.isArray(bookdata)
  ? bookdata.filter(item =>
      item.bookingId.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];


  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      <div className="card-title">
  <h2 className="table-blur-container">All Bookings</h2>
</div>

<div className="table-blur-container">
  <div className="divbtn">
    <Link to="/main/booking/create" className="btn btn-success">
      Create Booking (+)
    </Link>
    <input
      type="text"
      placeholder="Search LR Number..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="ml-2"
    />
  </div>
       <div className="table-container-scroll">
  <Table bordered>
    <thead className="table-header-fixed">
      <tr>
        <th>LR Number</th>
        <th>Booking Date</th>
        <th>Consignor Name</th>
        <th>Consignee Name</th>
        <th>Current Status</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      {currentPosts.length > 0 ? (
        currentPosts.map((item) => (
          <tr key={item.bookingId}>
            <td>{item.bookingId}</td>
            <td>{item.bookingDate}</td>
            <td>{item.consignorName}</td>
            <td>{item.consigneeName}</td>
            <td>{item.trackStatus}</td>
            <td>
              <Button
                onClick={() => LoadDetails(item.bookingId)}
                size="sm"
                color="primary"
              >
                Details
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center">
            No Data Available
          </td>
        </tr>
      )}
    </tbody>
  </Table>
</div>


        {/* Pagination */}
        <ul className="pagination">
          <li className="page-item">
            <button
              onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}
              disabled={currentPage === 1}
              className="page-link"
            >
              Previous
            </button>
          </li>
          {Array.from({ length: Math.ceil(filteredData.length / postsPerPage) }).map(
            (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
          <li className="page-item">
            <button
              onClick={() => setCurrentPage(
                currentPage === Math.ceil(filteredData.length / postsPerPage)
                  ? currentPage
                  : currentPage + 1
              )}
              disabled={currentPage === Math.ceil(filteredData.length / postsPerPage)}
              className="page-link"
            >
              Next
              
            </button>
            
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BookingListing;

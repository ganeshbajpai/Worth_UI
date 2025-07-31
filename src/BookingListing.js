import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { toast } from "react-toastify";
import './BookingListing.css';
import booking_url from "./api/bookingApi";

const BookingListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [bookdata, setBookdata] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const LoadDetails = (bookingId) => {
    navigate("/main/booking/details/" + bookingId);
  };

  const fetchBookings = () => {
    setLoading(true);
    fetch(`${booking_url}/booking/ordered`)
      .then((res) => {
        if (!res.ok) throw new Error("API response was not OK");
        return res.json();
      })
      .then((resp) => {
        const data = Array.isArray(resp) ? resp : resp.data || [];
        setBookdata(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setBookdata([]);
        toast.error("Failed to load booking data. Is the API running?");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredData = Array.isArray(bookdata)
    ? bookdata.filter(item =>
        item.bookingId.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
          <Button color="info" className="ml-2" onClick={fetchBookings}>
            Reload 🔄
          </Button>
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
          {loading ? (
            <div className="text-center">
              <div className="spinner"></div>
              <p>Loading bookings...</p>
            </div>
          ) : (
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
          )}
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

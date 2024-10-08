import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { toast } from "react-toastify";
import './BookingListing.css';
// import { Outlet } from 'react-router-dom';
import booking_url from "./api/bookingApi";
const BookingListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of items per page
  const [bookdata, setBookdata] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const LoadDetails = (bookingId) => {
    navigate("/main/booking/details/" + bookingId);
  };

  // const LoadEdit = (bookingId) => {
  //   navigate("/main/booking/edit/" + bookingId);
  // };

  // const Removefunction = (bookingId) => {
  //   if (window.confirm("Do you want to remove?")) {
  //     fetch(`${booking_url}/Demo/deleteBooking/` + bookingId, {
  //       method: "DELETE",
  //     })
  //       .then((res) => {
  //         alert("Removed Successfully");
  //         window.location.reload();
  //       })
  //       .catch((err) => {
  //         console.log(err.message);
  //       });
  //   }
  // };

  const exportToCsv = () => {
    if (bookdata.length === 0) {
      toast.error("No data available to export");
      return;
    }
  
    const header = Object.keys(bookdata[0]).join(",") + "\n";
    const csv = header + bookdata.map((item) => Object.values(item).join(",")).join("\n");
    const csvBlob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  useEffect(() => {
    fetch(`${booking_url}/Demo/ordered`)
      .then((res) => res.json())
      .then((resp) => {
        setBookdata(resp);
        toast.success("Booking has been loaded");
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Something went wrong");
      });
  }, []);

  // Filter data based on search query
  const filteredData = bookdata.filter(item =>
    item.bookingId.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div>
        <div className="card-title">
          <h2>Booking Details</h2>
        </div>
        <div className="card-body">
          <div className="divbtn">
            <Link to="/main/booking/create" className="btn btn-success">
            New Booking(+)
            </Link>
            <Button color="danger" className="ml-2" onClick={exportToCsv}>Download</Button>
            {/* Add search bar */}
            <input
              type="text"
              placeholder="Search LR Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2"
            />
          </div>
          <Table bordered>
            <thead>
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
              {currentPosts.map((item) => (
                <tr key={item.bookingId}>
                  <th>{item.bookingId}</th>
                  <td>{item.bookingDate}</td>
                  <td>{item.consignorName}</td>
                  <td>{item.consigneeName}</td>
                  <td>{item.trackStatus}</td>
                  <td>
                    <Button
                      onClick={() => {
                        LoadDetails(item.bookingId);
                      }}
                      size="sm"
                      color="primary"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
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
                onClick={() => setCurrentPage(currentPage === Math.ceil(filteredData.length / postsPerPage) ? currentPage : currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredData.length / postsPerPage)}
                className="page-link"
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default BookingListing;

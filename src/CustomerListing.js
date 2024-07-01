import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import customer_url from "./api/customerapi";
import "./CustomerListing.css";

const CustomerListing = () => {
  const [custdata, setCustdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items to display per page
  const [searchQuery, setSearchQuery] = useState(""); // State variable for search query

  const navigate = useNavigate();

  const LoadDetails = (customerId) => {
    navigate("/main/customer/details/" + customerId);
  };

  const LoadEdit = (customerId) => {
    navigate("/main/customer/edit/" + customerId);
  };

  const Removefunction = (customerId) => {
    if (window.confirm("Do you want to remove?")) {
      fetch(`${customer_url}/customer/deleteCustomer/` + customerId, {
        method: "DELETE",
      })
        .then((res) => {
          alert("Removed Successfully");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  useEffect(() => {
    fetch(`${customer_url}/customer/customerDetails`)
      .then((res) => res.json())
      .then((resp) => {
        setCustdata(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  // Logic for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(custdata.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Filtering function
  const filteredData = custdata.filter((item) =>
    item.company_Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="card-title">
        <h2>Customer Listing</h2>
      </div>
      <div className="card-body">
        <div className="divbtn">
          <Link to="/main/customer/create" className="btn btn-success">
            Add New (+)
          </Link>
        </div>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by Company Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control search-input"
        />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Customer Id</th>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>City</th>
              <th>Contact Number</th>
              <th>Update</th>
              <th>Delete</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item) => (
                <tr key={item.customerId}>
                  <th>{item.customerId}</th>
                  <td>{item.company_Name}</td>
                  <td>{item.company_Address}</td>
                  <td>{item.city}</td>
                  <td>{item.contact_Number}</td>
                  <td>
                    <Button
                      onClick={() => LoadEdit(item.customerId)}
                      size="sm"
                      color="warning"
                    >
                      Update
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => Removefunction(item.customerId)}
                      size="sm"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => LoadDetails(item.customerId)}
                      size="sm"
                      color="primary"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <ul className="pagination">
          <li className="page-item">
            <Button
              onClick={prevPage}
              className="page-link"
              disabled={currentPage === 1}
            >
              Prev
            </Button>
          </li>
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <Button
                onClick={() => paginate(number)}
                className="page-link"
                color={currentPage === number ? "primary" : "secondary"}
              >
                {number}
              </Button>
            </li>
          ))}
          <li className="page-item">
            <Button
              onClick={nextPage}
              className="page-link"
              disabled={currentPage === pageNumbers.length}
            >
              Next
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerListing;

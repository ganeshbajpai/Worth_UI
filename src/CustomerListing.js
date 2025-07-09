import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import {
  FaPlus
 
} from "react-icons/fa";
import customer_url from "./api/customerapi";
import "./CustomerListing.css";

const CustomerListing = () => {
  const [custdata, setCustdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleAddCustomer = () => {
    navigate("/main/customer/create");
  };

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
      .then((res) => {
        if (!res.ok) {
          throw new Error("API response was not OK");
        }
        return res.json();
      })
      .then((resp) => {
        const data = Array.isArray(resp) ? resp : resp.data || [];
        setCustdata(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setCustdata([]);
      });
  }, []);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(custdata.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const prevPage = () => setCurrentPage((prevPage) => prevPage - 1);

  const filteredData = Array.isArray(custdata)
    ? custdata.filter((item) =>
        item.companyName &&
        item.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="container">
      
 <h5 className="table-blur-container">Customer Listing</h5>
 <Button color="success" onClick={handleAddCustomer}>
          <FaPlus className="me-2" />
          Add Customer
        </Button>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
       
        
      </div>
        <input
          type="text"
          placeholder="Search by Company Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control search-input mb-3"
        />

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Code</th>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>City</th>
              <th>Contact</th>
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
                  <td>{item.companyName}</td>
                  <td>{item.companyAddress}</td>
                  <td>{item.city}</td>
                  <td>{item.contactNumber}</td>
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

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, FormGroup, Label, Input, Form } from "reactstrap";
import customer_url from "./api/customerapi";
import "./CustomerEdit.css";

const CustomerEdit = () => {
  const { custId } = useParams();
  // const [validation, setValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerId: "",
    companyName: "",
    companyAddress: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    contactPerson: "",
    contactNumber: "",
    emailId: "",
    gstNo: "",
    active: true,
  });

  const navigate = useNavigate();

  // Load existing customer data
  useEffect(() => {
    fetch(`${customer_url}/customer/customerDetails/${custId}`)
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to fetch customer details");
        return resp.json();
      })
      .then((resp) => {
        setFormData(resp);
      })
      .catch((err) => console.log(err.message));
  }, [custId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`${customer_url}/customer/updateCustomer/${custId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to update customer");
        alert("Updated successfully");
        navigate("/main/customer");
      })
      .catch((err) => {
        console.error(err.message);
        alert("Update failed: " + err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="container-fluid py-3">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <Form onSubmit={handleSubmit} className="compact-form">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white p-2">
                <h6 className="mb-0">Edit Customer</h6>
              </div>
              <div className="card-body p-3">
                <div className="row g-2">
                  {/* Left Column */}
                  <div className="col-md-6">
                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Customer ID</Label>
                      <Input
                        name="customerId"
                        value={formData.customerId}
                        disabled
                        className="form-control-sm"
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Company Name</Label>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        disabled
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Company Address</Label>
                      <Input
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">State</Label>
                      <Input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">City</Label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>
                  </div>

                  {/* Right Column */}
                  <div className="col-md-6">
                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Country</Label>
                      <Input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Pincode</Label>
                      <Input
                        type="number"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Contact Person</Label>
                      <Input
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Contact Number</Label>
                      <Input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="form-control-sm"
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">Email</Label>
                      <Input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        className="form-control-sm"
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Label className="small fw-bold">GST No</Label>
                      <Input
                        name="gstNo"
                        value={formData.gstNo}
                        onChange={handleChange}
                        className="form-control-sm"
                      />
                    </FormGroup>
                  </div>

                  {/* Buttons */}
                  <div className="col-12 mt-2">
                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        color="primary"
                        size="sm"
                        disabled={isLoading}
                        className="px-3"
                      >
                        {isLoading ? "Updating..." : "Update"}
                      </Button>
                      <Link
                        to="/main/customer"
                        className="btn btn-sm btn-outline-secondary px-3"
                      >
                        Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CustomerEdit;

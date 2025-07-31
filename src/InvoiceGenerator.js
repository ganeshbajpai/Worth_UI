import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import customer_url from './api/customerapi';
import './InvoiceGenerator.css';
import logo from './components/Assets/logo.png';
import signature from './components/Assets/signature.jpg';

import { QRCodeCanvas } from "qrcode.react";






const InvoiceGenerator = () => {
  const [customers, setCustomers] = useState([]);
 
  const [formData, setFormData] = useState({
    invoiceNumber: `WC/${new Date().getFullYear()}-${new Date().getFullYear()+1}/${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerAddress: '',
    customerGSTIN: '',
    items: [
      { description: '', hsnCode: '996511', weight: '', quantity: 1, bookingDate: '', docketCharges: 100, amount: 0 }
    ],
    termsConditions: [
      'In case of any discrepancy in the invoice, please bring the same to our attention within 7 days of receipt of invoice; else the same would be treated as correct.',
      'Delay in payment beyond the agreed credit period will attract interest @ 10% p.m.',
      'Government Taxes applied as per the prevailing rates.',
      'All disputes are subject to Noida jurisdiction.'
    ],
    taxRate: 18,
    gstType: 'igst', // 'igst' or 'cgst_sgst'
    roundOff: 0
  });

  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Fetch customers from API
  useEffect(() => {
    fetch(`${customer_url}/customer/companyNames`)
      .then(res => res.json())
      .then(data => {
  if (Array.isArray(data)) {
    setCustomers(data); // Correct shape
  } else if (Array.isArray(data.companyNames)) {
    setCustomers(data.companyNames); // Adjusted to match actual response
  } else {
    setCustomers([]); // Fallback to empty list
    console.error("Unexpected response format", data);
  }
})

  }, []);

  // Handle customer selection
  const handleCustomerSelect = (name) => {
    fetch(`${customer_url}/customer/company/${name}`)
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          customerName: data.companyName,
          customerAddress: `${data.companyAddress}, ${data.city}, ${data.state}, ${data.country} - ${data.pincode}`,
          customerGSTIN: data.gstNo
        }));
      })
      .catch(err => console.error(err));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle item changes
 const handleItemChange = (index, e) => {
  const { name, value } = e.target;
  const newItems = [...formData.items];
  
  // Convert relevant fields to numbers
  let parsedValue = value;
  if (['weight', 'quantity', 'docketCharges', 'amount'].includes(name)) {
    parsedValue = parseFloat(value) || 0;
  }

  newItems[index] = { ...newItems[index], [name]: parsedValue };

  if (name !== 'amount') {
    const weight = parseFloat(newItems[index].weight) || 0;
    const docketCharges = parseFloat(newItems[index].docketCharges) || 0;
    newItems[index].amount = weight * 10 + docketCharges; // ₹10/kg + docketCharges
  }

  setFormData(prev => ({ ...prev, items: newItems }));
};

  // Add new item row
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { description: '', hsnCode: '996511', weight: '', quantity: 1, bookingDate: '', docketCharges: 100, amount: 0 }
      ]
    }));
  };

  // Remove item row
  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const taxRate = formData.taxRate / 100;
    let tax = 0;
    
    if (formData.gstType === 'igst') {
      tax = subtotal * taxRate;
    } else {
      // For CGST+SGST, split the tax rate in half
      tax = subtotal * taxRate;
    }
    
    const total = subtotal + tax + formData.roundOff;
    return { subtotal, tax, total };
  };

  // Convert number to words
  const numberToWords = (num) => {
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
    const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    
    if (num === 0) return 'ZERO';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' HUNDRED' + (num % 100 !== 0 ? ' AND ' + numberToWords(num % 100) : '');
    
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    return numberToWords(thousand) + ' THOUSAND' + (remainder !== 0 ? ' ' + numberToWords(remainder) : '') + ' ONLY';
  };

  // Generate invoice
  const generateInvoice = (e) => {
    e.preventDefault();
    setGeneratedInvoice(formData);
  };

 const printInvoice = () => {
  setTimeout(() => {
    window.print();
  }, 500); // Wait for the invoice DOM to be fully painted
};


  const { subtotal, tax, total } = calculateTotals();

  return (
    
    <div className="invoice-generator">
      
      {!generatedInvoice ? (
        <Form onSubmit={generateInvoice} className="invoice-form">
          <div className="form-section">
            <h5>Invoice Details</h5>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Invoice Number</Label>
                  <Input
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Invoice Date</Label>
                  <Input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <h5>Customer Details</h5>
            <FormGroup>
              <Label>Customer Name</Label>
              <Input
                type="select"
                name="customerName"
                value={formData.customerName}
                onChange={(e) => handleCustomerSelect(e.target.value)}
              >
                <option value="">Select Customer</option>
                {customers.map((customer, index) => (
                  <option key={index} value={customer}>{customer}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Customer Address</Label>
              <Input
                type="textarea"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                rows={3}
              />
            </FormGroup>
            <FormGroup>
              <Label>Customer GSTIN</Label>
              <Input
                name="customerGSTIN"
                value={formData.customerGSTIN}
                onChange={handleChange}
              />
            </FormGroup>
          </div>

          <div className="form-section">
            <h5>Items</h5>
            <div className="items-table">
              <div className="items-header">
                <div>Description</div>
                <div>HSN Code</div>
                <div>Weight (KG)</div>
                <div>Qty</div>
                <div>Booking Date</div>
                <div>Docket Charges</div>
                <div>Amount (₹)</div>
                <div></div>
              </div>
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <Input
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <Input
                    name="hsnCode"
                    value={item.hsnCode}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <Input
                    type="number"
                    name="weight"
                    value={item.weight}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <Input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <Input
                    type="date"
                    name="bookingDate"
                    value={item.bookingDate}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <Input
                    type="number"
                    name="docketCharges"
                    value={item.docketCharges}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <Input
                    type="number"
                    name="amount"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button color="secondary" onClick={addItem} className="add-item-btn">
                + Add Item
              </Button>
            </div>
          </div>

          <div className="form-section">
            <h5>Tax Details</h5>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>GST Type</Label>
                  <Input
                    type="select"
                    name="gstType"
                    value={formData.gstType}
                    onChange={handleChange}
                  >
                    <option value="igst">IGST</option>
                    <option value="cgst_sgst">CGST + SGST</option>
                  </Input>
                </FormGroup>
              </Col>
              {/* <Col md={4}>
                <FormGroup>
                  <Label>Round Off</Label>
                  <Input
                    type="number"
                    name="roundOff"
                    value={formData.roundOff}
                    // onChange={handleChange}
                  />
                </FormGroup>
              </Col> */}
            </Row>
          </div>

          <div className="form-actions">
            <Button type="submit" color="primary">
              Generate Invoice
            </Button>
          </div>
        </Form>
      ) : (
        <div className="invoice-preview">
          <div className="print-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
             <QRCodeCanvas
      value={`Invoice No: ${generatedInvoice.invoiceNumber}\nAmount: ₹${total.toFixed(2)}\nBank Name: IDFC FIRST BANK\nAccount: 10068320097\nIFSC: IDFB0040101\nGSTIN: 09AACCW9017C1ZD`}
      size={100}
      bgColor="#ffffff"
      fgColor="#000000"
      level="M"
    />
            <div className="company-info">
              <h2>TAX INVOICE</h2>
              <h3>WORTH CART PRIVATE LTD.</h3>
              <p>A-280, GF, Transport Nagar, Sector 69, Noida-201301</p>
              <p>GSTIN: 09AACCW9017C1ZD | PAN: AACCW9017C</p>
              <p>Email: sales@worthcartindia.com | Phone: +91-9990370943</p>
            </div>
            <img src={logo} alt="Logo" style={{ width: 130, height: 130, objectFit: "contain" }} />

            
          </div>
              {/* Invoice number and date in one line */}
          <div className="invoice-header">
            <div className="invoice-number-date">
              <span className="invoice-number">Invoice: {generatedInvoice.invoiceNumber}</span>
              <span className="invoice-date">Date: {new Date(generatedInvoice.invoiceDate).toLocaleDateString('en-IN')}</span>
            </div>
          </div>  

          <div className="recipient-info">
            <h4>Recipient:</h4>
            <h3>{generatedInvoice.customerName}</h3>
            <p>{generatedInvoice.customerAddress}</p>
            <p>GSTIN: {generatedInvoice.customerGSTIN}</p>
          </div>

          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>HSN Code</th>
                  <th>Weight</th>
                  <th>Qty.</th>
                  <th>Booking Date</th>
                  <th>Docket Charges</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {generatedInvoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.hsnCode}</td>
                    <td>{item.weight} KG</td>
                    <td>{item.quantity}</td>
                    <td>{item.bookingDate}</td>
                    <td>{item.docketCharges.toFixed(2)}</td>
                    <td>{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">Terms & conditions:</td>
                  <td>{generatedInvoice.items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0)} KG</td>
                  <td>{generatedInvoice.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)}</td>
                  <td colSpan="2">Total</td>
                  <td>{subtotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="tax-summary">
            <table>
              {generatedInvoice.gstType === 'igst' ? (
                <>
                  <tr>
                    <td>GST Calculation:</td>
                    <td>IGST {generatedInvoice.taxRate}%</td>
                    <td>{tax.toFixed(2)}</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>GST Calculation:</td>
                    <td>CGST {generatedInvoice.taxRate / 2}%</td>
                    <td>{(tax / 2).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>SGST {generatedInvoice.taxRate / 2}%</td>
                    <td>{(tax / 2).toFixed(2)}</td>
                  </tr>
                </>
              )}
              <tr>
                <td></td>
                <td>ROUND OFF (+/-)</td>
                <td>{generatedInvoice.roundOff.toFixed(2)}</td>
              </tr>
              <tr className="grand-total">
                <td></td>
                <td>Grand Total</td>
                <td>{total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div className="amount-in-words">
            <p>Total Amount (₹ - In Words): {numberToWords(Math.round(total))}</p>
          </div>

          <div className="terms-conditions">
            <h5>Terms & Conditions:</h5>
            <ol>
              {generatedInvoice.termsConditions.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ol>
          </div>

         <div className="payment-details-container">
  <div className="payment-left">
    <h5>Payments Details:</h5>
    <p>IDFC FIRST BANK</p>
    <p>WORTH CART PRIVATE LIMITED</p>
    <p>ACCOUNT NO: 10068320097</p>
    <p>IFSC CODE: IDFB0040101</p>
  </div>

  <div className="signature">
    <p>For WORTH CART PRIVATE LTD</p>
    <img
      src={signature}
      alt="Authorized Signature"
      style={{ width: '120px', height: 'auto', margin: '10px 0' }}
    />
    <p>Authorised Signatory</p>
  </div>
</div>

          <div className="invoice-actions">
  <Button color="secondary" onClick={() => setGeneratedInvoice(null)}>
    Edit Invoice
  </Button>
  <Button color="success" onClick={printInvoice}>
    Print Invoice
  </Button>
</div>

        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
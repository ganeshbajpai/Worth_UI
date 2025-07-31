import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid, Cell
} from 'recharts';
import './Home.css';
import dashboard_url from "./api/dashboardApi";
import booking_url from "./api/bookingApi";
import { useNavigate } from 'react-router-dom';
import customer_url from './api/customerapi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a832a6', '#34a853'];

const Home = () => {
  const [shipmentStatusData, setShipmentStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyShipmentsData, setMonthlyShipmentsData] = useState([]);
  const navigate = useNavigate();
const [customerData, setCustomerData] = useState([]);

  const [summary, setSummary] = useState({
    totalShipments: 0,
    totalCustomers: 0,
  });

  const fetchShipmentStatus = async () => {
    try {
      const res = await fetch(`${dashboard_url}/dashboard/shipment-status`);
      const status = await res.json();
      const formatted = Object.entries(status).map(([key, value]) => ({
        name: key,
        value
      }));
      setShipmentStatusData(formatted);
    } catch (error) {
      console.error("Error fetching shipment status", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyShipments = async () => {
    try {
      const res = await fetch(`${booking_url}/booking/dashboard/monthly-shipments`);
      const result = await res.json();
      const formatted = Object.entries(result).map(([month, shipments]) => ({
        month,
        shipments
      }));
      setMonthlyShipmentsData(formatted);
    } catch (error) {
      console.error("Error fetching monthly shipments", error);
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const res = await fetch(`${booking_url}/booking/summary`);
      const result = await res.json();
      setSummary({
        totalShipments: result.totalShipments,
        totalCustomers: result.totalCustomers
      });
    } catch (error) {
      console.error("Error fetching dashboard summary", error);
    }
  };

  useEffect(() => {
    fetchShipmentStatus();
    fetchMonthlyShipments();
    fetchDashboardSummary();
    fetchCustomerRegistrations();
  }, []);

  const fetchCustomerRegistrations = async () => {
  try {
    const res = await fetch(`${customer_url}/customer/dashboard/customer-registrations`);
    const data = await res.json();
    const formatted = Object.entries(data).map(([month, customers]) => ({
      month,
      customers
    }));
    setCustomerData(formatted);
  } catch (error) {
    console.error("Error fetching customer registrations", error);
  }
};

const [searchText, setSearchText] = useState("");

const searchBooking = async () => {
  const bookingId = searchText.trim();
  if (!bookingId) {
    alert("Please enter a booking number.");
    return;
  }

  try {
    const res = await fetch(`${booking_url}/booking/checkBookingIdExists/${bookingId}`);
    const exists = await res.json();

    if (exists) {
      navigate(`/main/booking/${bookingId}`);
    } else {
      alert("Booking not found!");
    }
  } catch (error) {
    console.error("Error searching booking:", error);
    alert("An error occurred while searching for the booking.");
  }
};



  return (
    <div className="dashboard">
      <h5 className="table-blur-container">Logistics Dashboard</h5>
<div className="shortcut-buttons">
  <button className="shortcut create-booking" onClick={() => navigate('/main/booking/create')}>
    📦 Create Booking
  </button>
  <button className="shortcut create-customer" onClick={() => navigate('/main/customer/create')}>
    👤 Create Customer
  </button>
  <button className="shortcut in-transit" onClick={() => navigate('/main/intransit')}>
    🚚 In-Transit 
  </button>
  <button className="shortcut delivered" onClick={() => navigate('/main/delivered')}>
          ✅ Delivered
        </button>
<div className="search-booking d-flex align-items-center gap-2 mt-3">
  <input
    type="text"
    placeholder="🔍 Search by Booking No"
    className="form-control"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
  <button className="btn btn-primary btn-sm" onClick={searchBooking}>
    Search
  </button>
</div>
        
</div>

      <div className="insight-cards">
        <div className="insight-card">Total Shipments: <strong>{summary.totalShipments}</strong></div>
        <div className="insight-card">Total Customers: <strong>{summary.totalCustomers}</strong></div>
        <div className="insight-card">Revenue (This Year): <strong>₹260000</strong></div>
        <div className="insight-card">Avg. Delivery Time: <strong>3.2 Days</strong></div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h4>Shipment Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                dataKey="value"
                data={shipmentStatusData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {shipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {loading && <p>Loading shipment status...</p>}
        </div>

        <div className="chart-card">
          <h4>Monthly Shipments</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyShipmentsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="shipments" stroke="#34a853" strokeWidth={2} dot={{ stroke: '#34a853', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Customer Registrations</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={customerData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#ccc" />
              <Bar dataKey="customers">
                {customerData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;

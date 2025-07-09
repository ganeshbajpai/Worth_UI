import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import './Home.css';
import dashboard_url from "./api/dashboardApi";
import booking_url from "./api/bookingApi";

const Home = () => {
  const [shipmentStatusData, setShipmentStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyShipmentsData, setMonthlyShipmentsData] = useState([]);
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
        value: value
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
      const res = await fetch(`${booking_url}/booking/dashboard/summary`);
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
  }, []);

  const customerData = [
    { month: 'Jan', customers: 30 },
    { month: 'Feb', customers: 45 },
    { month: 'Mar', customers: 35 },
    { month: 'Apr', customers: 60 },
    { month: 'May', customers: 80 }
  ];

  return (
    <div className="dashboard">
      <h5 className="table-blur-container">Logistics Dashboard</h5>

      <div className="insight-cards">
        <div className="insight-card">
          Total Shipments: <strong>{summary.totalShipments}</strong>
        </div>
        <div className="insight-card">
          Total Customers: <strong>{summary.totalCustomers}</strong>
        </div>
        <div className="insight-card">
          Revenue (This Year): <strong>₹26,000</strong>
        </div>
        <div className="insight-card">
          Avg. Delivery Time: <strong>3.2 Days</strong>
        </div>
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
                fill="#8884d8"
                label
              />
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
              <Line type="monotone" dataKey="shipments" stroke="#82ca9d" />
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
              <Bar dataKey="customers" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;

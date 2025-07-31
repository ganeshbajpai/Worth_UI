import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import booking_url from './api/bookingApi';
import './BookingDetailsPage.css'; // <-- Add custom CSS file
import {  useNavigate } from 'react-router-dom';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`${booking_url}/booking/booking/${id}`);
        if (!res.ok) throw new Error('Booking not found');
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) return <div className="p-4">Loading booking details...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;
  if (!booking) return null;

  return (
    
    <div className="booking-details-container">
      
      <h3 className="title">📦 Booking Details (ID: {id})</h3>
      <div className="glass-card">
        <table className="details-table">
          <tbody>
            <tr>
              <th>Consignor</th>
              <td>{booking.consignorName}</td>
            </tr>
            <tr>
              <th>Consignee</th>
              <td>{booking.consigneeName}</td>
            </tr>
            <tr>
              <th>Booking Date</th>
              <td>{booking.bookingDate}</td>
            </tr>
            
            <tr>
              <th>Weight</th>
              <td>{booking.chargedWeight} kg</td>
            </tr>
            <tr>
              <th>Quantity</th>
              <td>{booking.numberOfPackage}</td>
            </tr>

            <tr>
              <th>Status</th>
              <td>{booking.trackStatus}</td>
            </tr>
            {/* Add more fields as needed */}
          </tbody>
           <button className="back-button" onClick={() => navigate('/main/home')}>
  🔙 Back to Dashboard
</button>
        </table>
      </div>
    </div>
  );
};

export default BookingDetailsPage;

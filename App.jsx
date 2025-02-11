import React, { useState } from "react";
import "./index.css";

const MAX_SEATS = 50; // Maximum available seats

function App() {
  const [seatsLeft, setSeatsLeft] = useState(MAX_SEATS);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Reservation Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, guests } = formData;
    const guestCount = parseInt(guests);

    if (!name || !phone || !guests || guestCount <= 0) {
      alert("Please fill all fields correctly.");
      return;
    }
    if (guestCount > seatsLeft) {
      alert("Not enough seats available!");
      return;
    }

    const newReservation = {
      name,
      phone,
      guests: guestCount,
      checkIn: new Date().toLocaleTimeString(),
      checkOut: null,
    };

    setReservations([...reservations, newReservation]);
    setSeatsLeft(seatsLeft - guestCount);
    setFormData({ name: "", phone: "", guests: "" });
  };

  // Handle Checkout
  const handleCheckout = (index) => {
    const updatedReservations = [...reservations];
    updatedReservations[index].checkOut = new Date().toLocaleTimeString();
    
    // Update seats immediately after checkout
    setSeatsLeft((prevSeats) => prevSeats + updatedReservations[index].guests);
    
    setReservations(updatedReservations);
  };

  // Handle Deletion
  const handleDelete = (index) => {
    const deletedReservation = reservations[index];

    if (!deletedReservation.checkOut) {
      setSeatsLeft(seatsLeft + deletedReservation.guests);
    }

    const updatedReservations = reservations.filter((_, i) => i !== index);
    setReservations(updatedReservations);
  };

  // Filter reservations based on search
  const filteredReservations = reservations.filter((res) =>
    res.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🍽️ Restaurant Reservation System</h1>
      <h2>Seats Available: {seatsLeft} / {MAX_SEATS}</h2>

      {/* Search Box */}
      <input
        type="text"
        className="search-box"
        placeholder="🔍 Search by Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Reservation Form */}
      <form onSubmit={handleSubmit} className="reservation-form">
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="guests"
          placeholder="Guests Count"
          value={formData.guests}
          onChange={handleChange}
          required
        />
        <button type="submit">Reserve Table</button>
      </form>

      {/* Reservations Table */}
      <table className="reservation-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Guests</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((res, index) => (
            <tr key={index} className={res.checkOut ? "checked-out" : ""}>
              <td>{res.name}</td>
              <td>{res.phone}</td>
              <td>{res.guests}</td>
              <td>{res.checkIn}</td>
              <td>{res.checkOut ? res.checkOut : "Not Checked Out"}</td>
              <td>
                {!res.checkOut && (
                  <button className="checkout-btn" onClick={() => handleCheckout(index)}>Checkout</button>
                )}
                <button className="delete-btn" onClick={() => handleDelete(index)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

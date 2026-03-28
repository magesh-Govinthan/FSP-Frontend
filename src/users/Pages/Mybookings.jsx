// MyBookings.jsx
import React, { useEffect, useState } from "react";
import { Toast, ToastContainer, Modal, Button, Form } from "react-bootstrap";
// import { Card, } from "react-bootstrap";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import { useNavigate } from "react-router-dom";
function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [cancelTicket, setCancelTicket] = useState(false)
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferEmail, setTransferEmail] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    // Replace with your API
    if (user) {
      axios.get(`https://msp-backend-cdho.onrender.com/api/ticket/mytickets/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        console.log(response);
        setBookings(response.data);
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [cancelTicket]);

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`https://msp-backend-cdho.onrender.com/api/ticket/cancel/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        method: "PUT",
      });

      const data = await response.json();
      setCancelTicket((prev) => !prev);
      setToastMessage(data.message || "Action successful");
      setShowToast(true);
    } catch (error) {
      console.error("Cancel failed:", error);
      setToastMessage("Something went wrong");
      setShowToast(true);
    }
  }
  const openTransferModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setTransferEmail("");
    setShowTransferModal(true);
  }
  const handleTransferSubmit = async () => {
    try {
      const response = await fetch(`https://msp-backend-cdho.onrender.com/api/ticket/transfer`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        method: "PUT",
        body: JSON.stringify({ ticketId: selectedTicketId, recipientEmail: transferEmail })
      });
      const data = await response.json();
      setShowTransferModal(false);
      setCancelTicket(prev => !prev); // refresh tickets
      setToastMessage(data.message || "Ticket transferred successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Transfer failed:", error);
      setToastMessage("Transfer failed");
      setShowToast(true);
    }
  }
  const handlePaymentSubmit = () => {
    navigate("/payment-info")
  }

  return (
    <>
      <ToastContainer style={{ position: 'fixed' }} position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Body style={{ color: "#fff" }}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Transfer Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Recipient Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter recipient email"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleTransferSubmit} disabled={!transferEmail}>
            Transfer
          </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="success" style={{marginTop:'2rem', marginBottom:'2rem'}} onClick={handlePaymentSubmit} >
            Payment Info
          </Button>
      {bookings.length === 0 ?
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
          No tickets found.
        </div>
        : (<div style={{
          display: 'grid',
          gridTemplateColumns: "1fr 1fr 1fr",
        }}>
          {bookings.map((ticket) => (
            <div
              key={uuidv4()}
              style={{
                maxWidth: 360,
                margin: "1rem auto",
                borderRadius: 20,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                overflow: "hidden",
                position: "relative",
                color: "#222",
              }}
            >
              <img
                src="https://media.gettyimages.com/id/1285337858/vector/ticket-admit-one.jpg?s=612x612&w=0&k=20&c=XpPzIHGrcy2jDa8v_9oBRenQCiD658WhqbruoTbA130="
                alt={ticket.event.eventName}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              />

              <div style={{ padding: "1.5rem 1.75rem" }}>
                <small style={{ color: "#555" }}>Event</small>
                <h2 style={{ margin: "0.25rem 0 1rem", fontWeight: 600 }}>
                  {ticket.event.eventName}
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    rowGap: "0.75rem",
                    columnGap: "1.5rem",
                    marginBottom: "1rem",
                    alignItems: "center",
                  }}
                >
                  <small style={{ color: "#555" }}>Date</small>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {new Date(ticket.event.date).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <small style={{ color: "#555" }}>Ticket Type</small>
                  <p style={{ margin: 0, fontWeight: 500 }}>{ticket.ticketType}</p>

                  <small style={{ color: "#555" }}>Quantity</small>
                  <p style={{ margin: 0, fontWeight: 500 }}>{ticket.quantity}</p>

                  <small style={{ color: "#555" }}>Order ID</small>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {ticket._id.slice(-8).toUpperCase()}
                  </p>

                  <small style={{ color: "#555" }}>Location</small>
                  <p style={{ margin: 0, fontWeight: 500 }}>{ticket.event.venue}</p>

                  <small style={{ color: "#555" }}>Booking Status</small>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "600",
                      color:
                        ticket.bookingStatus.toLowerCase() === "booked"
                          ? "green"
                          : ticket.bookingStatus.toLowerCase() === 'transferred' ? "skyblue" : "red",
                      textTransform: "capitalize",
                    }}
                  >
                    {ticket.bookingStatus}
                  </p>
                  {ticket.transfer && ticket.transfer.recipientEmail && (
                    <>
                      <small style={{ color: "#555" }}>Transferred To</small>
                      <p style={{ margin: 0, fontWeight: 500 }}>{ticket.transfer.recipientEmail}</p>
                    </>
                  )}
                  <small style={{ color: "#555" }}>Payment</small>
                  <p style={{
                    margin: 0,
                    fontWeight: 600,
                    color:
                      ticket.paymentStatus === "paid"
                        ? "green"
                        : ticket.paymentStatus === "pending"
                          ? "orange"
                          : "red"
                  }}>
                    {ticket.paymentStatus}
                  </p>
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: 8,
                      border: "none",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    disabled={ticket.paymentStatus !== "paid"}
                    onClick={() => openTransferModal(ticket._id)}
                  >
                    Transfer
                  </button>

                  <button
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: 8,
                      border: "none",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    disabled={ticket.paymentStatus !== "paid"}
                    onClick={() => handleCancel(ticket._id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>)}
    </>
  );
}

export default MyBookings;
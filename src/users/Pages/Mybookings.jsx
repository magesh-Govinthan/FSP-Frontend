import React, { useEffect, useState } from "react";
import { Toast, ToastContainer, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [cancelTicket, setCancelTicket] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferEmail, setTransferEmail] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://msp-backend-cdho.onrender.com/api/ticket/mytickets/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          setBookings(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [cancelTicket]);

  const handleCancel = async (id) => {
    try {
      const response = await fetch(
        `https://msp-backend-cdho.onrender.com/api/ticket/cancel/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "PUT",
        },
      );

      const data = await response.json();
      setCancelTicket((prev) => !prev);
      setToastMessage(data.message || "Action successful");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Something went wrong");
      setShowToast(true);
    }
  };

  const openTransferModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setTransferEmail("");
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async () => {
    try {
      const response = await fetch(
        `https://msp-backend-cdho.onrender.com/api/ticket/transfer`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "PUT",
          body: JSON.stringify({
            ticketId: selectedTicketId,
            recipientEmail: transferEmail,
          }),
        },
      );

      const data = await response.json();
      setShowTransferModal(false);
      setCancelTicket((prev) => !prev);
      setToastMessage(data.message || "Ticket transferred successfully");
      setShowToast(true);
    } catch {
      setToastMessage("Transfer failed");
      setShowToast(true);
    }
  };

  const handlePaymentSubmit = () => {
    navigate("/payment-info");
  };

  return (
    <>
      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Modal */}
      <Modal
        show={showTransferModal}
        onHide={() => setShowTransferModal(false)}
      >
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
          <Button
            variant="secondary"
            onClick={() => setShowTransferModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleTransferSubmit}
            disabled={!transferEmail}
          >
            Transfer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Button */}
      <Button
        variant="success"
        className="d-block mx-auto mt-4 mb-4"
        onClick={handlePaymentSubmit}
      >
        Payment Info
      </Button>

      {/* No Data */}
      {bookings.length === 0 ? (
        <div className="text-center mt-4 text-muted">No tickets found.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            padding: "0 10px",
          }}
        >
          {bookings.map((ticket) => (
            <div
              key={uuidv4()}
              style={{
                maxWidth: 360,
                width: "100%",
                margin: "1rem auto",
                borderRadius: 20,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                overflow: "hidden",
              }}
            >
              <img
                src="https://media.gettyimages.com/id/1285337858/vector/ticket-admit-one.jpg"
                alt=""
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "1.2rem" }}>
                <h5>{ticket.event.eventName}</h5>

                <p>
                  <b>Date:</b>{" "}
                  {new Date(ticket.event.date).toLocaleDateString()}
                </p>

                <p>
                  <b>Type:</b> {ticket.ticketType}
                </p>

                <p>
                  <b>Qty:</b> {ticket.quantity}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  <span
                    style={{
                      color:
                        ticket.bookingStatus === "booked" ? "green" : "red",
                    }}
                  >
                    {ticket.bookingStatus}
                  </span>
                </p>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary w-100"
                    disabled={ticket.paymentStatus !== "paid"}
                    onClick={() => openTransferModal(ticket._id)}
                  >
                    Transfer
                  </button>

                  <button
                    className="btn btn-danger w-100"
                    disabled={ticket.paymentStatus !== "paid"}
                    onClick={() => handleCancel(ticket._id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default MyBookings;

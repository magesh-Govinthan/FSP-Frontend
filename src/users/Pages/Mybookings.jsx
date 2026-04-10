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
            headers: { Authorization: `Bearer ${token}` },
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
    } catch (error) {
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
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ position: "fixed" }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Body style={{ color: "#fff" }}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Transfer Modal */}
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
      <div className="container text-center">
        <Button
          variant="success"
          className="mt-4 mb-4"
          onClick={handlePaymentSubmit}
        >
          Payment Info
        </Button>
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
          No tickets found.
        </div>
      ) : (
        <div className="container">
          <div className="row">
            {bookings.map((ticket) => (
              <div key={uuidv4()} className="col-12 col-sm-6 col-md-4 mb-4">
                <div
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                    overflow: "hidden",
                  }}
                >
                  {/* Image */}
                  <img
                    src="https://media.gettyimages.com/id/1285337858/vector/ticket-admit-one.jpg?s=612x612&w=0&k=20&c=XpPzIHGrcy2jDa8v_9oBRenQCiD658WhqbruoTbA130="
                    alt={ticket.event.eventName}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Content */}
                  <div style={{ padding: "1.2rem" }}>
                    <h5>{ticket.event.eventName}</h5>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(ticket.event.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Type:</strong> {ticket.ticketType}
                    </p>
                    <p>
                      <strong>Qty:</strong> {ticket.quantity}
                    </p>
                    <p>
                      <strong>Status:</strong> {ticket.bookingStatus}
                    </p>

                    {/* Buttons */}
                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-primary w-50"
                        disabled={ticket.paymentStatus !== "paid"}
                        onClick={() => openTransferModal(ticket._id)}
                      >
                        Transfer
                      </button>

                      <button
                        className="btn btn-danger w-50"
                        disabled={ticket.paymentStatus !== "paid"}
                        onClick={() => handleCancel(ticket._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default MyBookings;

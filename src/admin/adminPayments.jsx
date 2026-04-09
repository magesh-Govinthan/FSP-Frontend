import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Form,
  Card,
  Row,
  Col,
  Badge,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const navigate = useNavigate();

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "https://msp-backend-cdho.onrender.com/api/event",
        );
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  // Fetch all payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          "https://msp-backend-cdho.onrender.com/api/payments/getallpayments",
        );
        setPayments(res.data.payments);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, []);

  // Filter payments by event
  const filteredPayments = selectedEvent
    ? payments.filter((p) => p.event?._id === selectedEvent)
    : payments;

  // Total revenue
  const totalRevenue =
    filteredPayments && filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  // Delete payment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;

    try {
      await axios.delete(
        `https://msp-backend-cdho.onrender.com/api/payments/${id}`,
      );

      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <div className="mb-4 d-flex flex-wrap gap-3 align-items-center">
        <ArrowLeft
          style={{ cursor: "pointer", margin: "0" }}
          onClick={() => navigate("/admin-dashboard")}
        />
        <h4 className="m-0">Payment Management</h4>
      </div>

      {/* Revenue Card */}
      <Row className="mb-4">
        <Col md={4} sm={12}>
          <Card>
            <Card.Body>
              <h6>Total Revenue</h6>
              <h3>${totalRevenue}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Event Filter */}
      <Form.Select
        className="mb-4"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">All Events</option>

        {events.map((event) => (
          <option key={event._id} value={event._id}>
            {event.eventName}
          </option>
        ))}
      </Form.Select>

      {/* Payments Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Event Name</th>
            <th>Date</th>
            <th>Quantity (General/VIP)</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Session ID</th>
            <th>Payment Intent ID</th>
            <th>Payment Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPayments.map((p) => (
            <tr key={p._id}>
              <td>{p.user?.name}</td>

              <td className="text-break">{p.user?.email}</td>

              <td>{p.event?.eventName}</td>

              <td>{new Date(p.event?.date).toLocaleDateString()}</td>

              <td>
                General: {p.quantity?.General || 0}, VIP: {p.quantity?.VIP || 0}
              </td>

              <td>${p.amount}</td>

              <td>{p.currency.toUpperCase()}</td>

              <td>
                <Badge
                  bg={
                    p.status === "paid"
                      ? "success"
                      : p.status === "pending"
                        ? "warning"
                        : "danger"
                  }
                >
                  {p.status}
                </Badge>
              </td>

              <td className="text-break">{p.sessionId}</td>

              <td className="text-break">{p.paymentIntentId}</td>

              <td>{new Date(p.createdAt).toLocaleString()}</td>

              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPayments;

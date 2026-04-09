import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const navigate = useNavigate();

  // Fetch Events
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

  // Fetch Tickets
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "https://msp-backend-cdho.onrender.com/api/ticket/allTickets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, []);

  // Filter Tickets
  const filteredTickets = selectedEvent
    ? tickets.filter((t) => t.event?._id === selectedEvent)
    : tickets;

  // Total Sales
  const totalSales = filteredTickets.reduce((acc, t) => {
    if (t.paymentStatus === "paid") {
      return acc + t.quantity;
    }
    return acc;
  }, 0);

  // Cancel Ticket
  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://msp-backend-cdho.onrender.com/api/ticket/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTickets((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, bookingStatus: "cancelled" } : t,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Payment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;

    try {
      await axios.delete(
        `https://msp-backend-cdho.onrender.com/api/ticket/${id}`,
      );

      setTickets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="mb-4 d-flex align-items-center gap-3 flex-wrap">
        <ArrowLeft
          size={22}
          style={{ cursor: "pointer",margin:"0" }}
          onClick={() => navigate("/admin-dashboard")}
        />
        <h4 className="m-0">Ticket Management</h4>
      </div>

      {/* Total Sales Card */}
      <Row className="mb-4 g-3">
        <Col xs={12} md={4}>
          <Card className="shadow-sm border-0 m-0">
            <Card.Body>
              <h6 className="text-muted">Total Ticket Sales</h6>
              <h3 className="fw-bold">{totalSales}</h3>
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

      {/* Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="align-middle">
          <thead>
            <tr>
              <th>Ticket User</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Ticket Type</th>
              <th>Quantity</th>
              <th>Payment Status</th>
              <th>Booking Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.user?.name}</td>

                <td>{ticket.event?.eventName}</td>

                <td>{new Date(ticket.event?.date).toLocaleDateString()}</td>

                <td>{ticket.ticketType}</td>

                <td>{ticket.quantity}</td>

                <td>
                  <Badge
                    bg={
                      ticket.paymentStatus === "paid"
                        ? "success"
                        : ticket.paymentStatus === "pending"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {ticket.paymentStatus}
                  </Badge>
                </td>

                <td>{ticket.bookingStatus}</td>

                <td className="d-flex gap-2 flex-wrap">
                  {ticket.bookingStatus !== "cancelled" && (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleCancel(ticket._id)}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(ticket._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default TicketTable;

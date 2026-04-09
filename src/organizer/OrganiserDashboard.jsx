import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import axios from "axios";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { EventContext } from "../users/Context/EventContext";

const OrganiserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  const { updateEventIds, updateEventDetails } = useContext(EventContext);

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://msp-backend-cdho.onrender.com/api/event/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Fetch Tickets
  useEffect(() => {
    const fetchTickets = async () => {
      if (events.length > 0) {
        const eventIds = events.map((e) => e._id);
        updateEventIds(eventIds);

        try {
          const token = localStorage.getItem("token");

          const response = await axios.post(
            "https://msp-backend-cdho.onrender.com/api/ticket/eventIds",
            { eventIds },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setTickets(response.data);
        } catch (err) {
          console.error("Error fetching tickets:", err);
        }
      }
    };

    fetchTickets();
  }, [events]);

  const totalEvents = events.length;

  const totalTickets = events.reduce((acc, e) => acc + e.Totalticket, 0);

  const approvedEvents = events.filter((e) => e.status === "approved").length;

  const availableTickets = events.reduce((acc, e) => {
    if (e.status === "approved") {
      const generalTickets = e.ticketTypes.find(
        (t) => t.ticketName === "General",
      );
      const vipTickets = e.ticketTypes.find((t) => t.ticketName === "VIP");

      acc +=
        (+generalTickets?.availableTickets || 0) +
        (+vipTickets?.availableTickets || 0);
    }

    return acc;
  }, 0);

  const ticketSales =
    tickets &&
    tickets.reduce((acc, e) => {
      if (e.paymentStatus === "paid") {
        acc += e.quantity;
      }
      return acc;
    }, 0);

  const revenue =
    tickets &&
    tickets.reduce((acc, e) => {
      if (e.paymentStatus === "paid") {
        acc += e.totalPrice;
      }
      return acc;
    }, 0);

  const handleRevenue = () => {
    navigate("/revenue-charts");
  };

  const handleNotify = async (ticket) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://msp-backend-cdho.onrender.com/api/event/notify-event",
        {
          ticketId: ticket._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setToastMessage(response.data.message);
      setShowToast(true);
    } catch (err) {
      console.error("Error sending notification:", err);
      setToastMessage("Failed to send notification");
      setShowToast(true);
    }
  };

  const handleEdit = (evt) => {
    updateEventDetails(evt);
    navigate("/create-event");
  };

  const handleDeleteEvent = async (id, e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `https://msp-backend-cdho.onrender.com/api/event/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEvents((prev) => prev.filter((ev) => ev._id !== id));
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  return (
    <>
      {/* Toast */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999, position: "fixed" }}
      >
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Container fluid>
        {/* Header */}
        <div className="mt-4 mb-4 d-flex justify-content-between align-items-center flex-wrap">
          <h3 className="m-0">Organizer Dashboard</h3>

          <FaChartBar
            style={{
              width: "28px",
              height: "28px",
              cursor: "pointer",
              margin: "0",
            }}
            onClick={handleRevenue}
          />
        </div>

        {/* Stats */}
        <Row className="mb-4">
          <Col lg={4} md={6} sm={12} className="mb-3">
            <Card>
              <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                <h6>Total Events</h6>
                <h3>{totalEvents}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} sm={12} className="mb-3">
            <Card>
              <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                <h6>Total Tickets</h6>
                <h3>{totalTickets}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} sm={12} className="mb-3">
            <Card>
              <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                <h6>Approved Events</h6>
                <h3>{approvedEvents}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} sm={12} className="mb-3">
            <Card>
              <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                <h6>Available Tickets</h6>
                <h3>{availableTickets}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} sm={12} className="mb-3">
            <Card>
              <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                <h6>Ticket Sales</h6>
                <h3>{ticketSales}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6} sm={12} className="mb-3">
            <Card>
              <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                <h6>Revenue</h6>
                <h3>${revenue}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Events Table */}
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle">
            <thead>
              <tr>
                <th>Organizer</th>
                <th>Event</th>
                <th>Category</th>
                <th>Date</th>
                <th>Location</th>
                <th>Total</th>
                <th>Time</th>
                <th>General</th>
                <th>VIP</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.organizer.name}</td>

                  <td>{event.eventName}</td>

                  <td>{event.category}</td>

                  <td>{new Date(event.date).toLocaleDateString()}</td>

                  <td>{event.location}</td>

                  <td>{event.Totalticket}</td>

                  <td>{event.time}</td>

                  {event.ticketTypes.map((ticket) => (
                    <td key={ticket._id}>{ticket.availableTickets}</td>
                  ))}

                  <td>
                    <Badge
                      bg={event.status === "approved" ? "success" : "warning"}
                    >
                      {event.status}
                    </Badge>
                  </td>

                  <td className="d-flex flex-wrap gap-2">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => handleDeleteEvent(event._id, e)}
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

      {/* Notification Table */}

      <Container fluid>
        <h4 className="mt-5 mb-3">User Ticket Notifications</h4>

        <div className="table-responsive">
          <Table striped bordered hover className="align-middle">
            <thead>
              <tr>
                <th>User</th>
                <th>Event</th>
                <th>Quantity</th>
                <th>Ticket</th>
                <th>Notify</th>
              </tr>
            </thead>

            <tbody>
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No User data available
                  </td>
                </tr>
              )}

              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.user.name}</td>

                  <td>{ticket.event.eventName}</td>

                  <td>{ticket.quantity}</td>

                  <td>{ticket.ticketType}</td>

                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleNotify(ticket)}
                    >
                      Notify
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default OrganiserDashboard;

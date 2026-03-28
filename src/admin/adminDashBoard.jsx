import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Table, Button, Badge, Nav } from "react-bootstrap";
import axios from "axios";
import { EventContext } from "../users/Context/EventContext";
import { useNavigate } from "react-router-dom";
import {  FaCalendarAlt, FaClipboardList, FaUsers, FaMoneyBill, FaTicketAlt,  } from "react-icons/fa";
import './adminDashboard.css'


const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const {updateEventDetails} = useContext(EventContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("https://msp-backend-cdho.onrender.com/api/event");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  // Actions
  
  const handleApprove = async (id) => {
    await axios.put(`https://msp-backend-cdho.onrender.com/api/event/approve/${id}`,
        {},
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
    );
    updateStatus(id, "approved");
  };

  const handleReject = async (id) => {
    
    await axios.put(`https://msp-backend-cdho.onrender.com/api/event/reject/${id}`,
      {},
      {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      }
    );
    updateStatus(id, "rejected");
  };

  const handleDelete = async (id) => {
    
    await axios.delete(`https://msp-backend-cdho.onrender.com/api/event/delete/${id}`,
        {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }
    );
    setEvents(events.filter((e) => e._id !== id));
  };

  const updateStatus = (id, status) => {
    setEvents(events.map(e => e._id === id ? { ...e, status } : e));
  };

  const handleEdit = (evt, e) => {
    updateEventDetails(evt);
    navigate("/create-event");
  };

  return (
    <Container fluid>
      <Row>

        {/* 🔹 Sidebar */}
        <Col md={2} style={{ background: "#f5f5f5", minHeight: "100vh",maxWidth:'320px',borderRadius:'9px', marginTop:'1rem' }}>
          <h5 className="p-3">Admin</h5>
          <Nav className="flex-column p-2 sidebar-nav" >
  <Nav.Link className="sidebar-link">
    <FaCalendarAlt  style={{maxWidth:'50px', margin:"0"}}/> <span style={{maxWidth: '100px', margin:'0'}}>Events</span>
  </Nav.Link>

  
  <Nav.Link className="sidebar-link" onClick={(() => navigate("/admin-tickets"))}>
    <FaTicketAlt style={{maxWidth:'50px', margin:'0'}}/> <span style={{maxWidth: '100px', margin:'0   '}}>Tickets</span>
  </Nav.Link>

  <Nav.Link className="sidebar-link" onClick={(() => navigate("/admin-payments"))}>
    <FaMoneyBill style={{maxWidth:'50px', margin:'0'}} /> <span style={{maxWidth: '100px', margin:'0   '}}>Payments</span>
  </Nav.Link>

  <Nav.Link className="sidebar-link" onClick={(() => navigate("/admin-users"))}>
    <FaUsers style={{maxWidth:'50px', margin:'0'}}/> <span style={{maxWidth: '100px', margin:'0   '}}>Users</span>
  </Nav.Link>

  <Nav.Link className="sidebar-link" onClick={(() => navigate("/admin-reviews"))}>
    <FaClipboardList  style={{maxWidth:'50px', margin:'0'}}/> <span style={{maxWidth: '100px', margin:'0   '}}>Reviews</span>
  </Nav.Link>

</Nav>
        </Col>

        {/* 🔹 Main Content */}
        <Col md={10} className="p-4">

          <h4 className="mb-4">Events Management</h4>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Event Organizer</th>
                <th>Event Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>General</th>
                <th>VIP</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => {
                const general = event.ticketTypes?.find(t => t.ticketName === "General");
                const vip = event.ticketTypes?.find(t => t.ticketName === "VIP");

                return (
                  <tr key={event._id}>
                    <td>{event.organizer.name}</td>
                    <td>{event.eventName}</td>

                    <td>
                      <Badge bg={
                        event.status === "approved"
                          ? "success"
                          : event.status === "rejected"
                          ? "danger"
                          : "warning"
                      }>
                        {event.status}
                      </Badge>
                    </td>

                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.time}</td>
                    <td>{event.location}</td>

                    <td>{general?.availableTickets || 0}</td>
                    <td>{vip?.availableTickets || 0}</td>

                    <td className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(event._id)}
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleReject(event._id)}
                      >
                        Reject
                      </Button>

                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleEdit(event)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(event._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
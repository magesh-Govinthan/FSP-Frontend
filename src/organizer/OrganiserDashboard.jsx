import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Table, Badge,  Button } from "react-bootstrap";
import { Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { EventContext } from "../users/Context/EventContext";

const OrganiserDashboard = () => {
    const [events, setEvents] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
    const { updateEventIds, updateEventDetails } = useContext(EventContext);
  
   
  useEffect(() => {
    // Fetch organizer's events from API
    
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://msp-backend-cdho.onrender.com/api/event/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched events:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
        fetchEvents();
    
    
  }, []);
 

  useEffect(() => {
    const fetchTickets = async () => {
        console.log("events:", events);
    
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
              }
            );
    
            console.log("fetchedTickets:", response.data);
    
            setTickets(response.data);
          } catch (err) {
            console.error("Error fetching tickets:", err);
          }
        }
      };
    
      fetchTickets();
    }, [events])


  const totalEvents = events.length;
  const totalTickets = events.reduce(
    (acc, e) => acc + e.Totalticket,
    0
  );

  const approvedEvents = events.filter(e => e.status === "approved").length;
  const availableTickets = events.reduce((acc, e) => {
    if (e.status === "approved") {
      const generalTickets = e.ticketTypes.find(t => t.ticketName=== "General");
      const vipTickets = e.ticketTypes.find(t => t.ticketName === "VIP");
      acc += (+generalTickets?.availableTickets || 0) + (+vipTickets?.availableTickets || 0);
    }
    return acc;
  }, 0);
const ticketSales = tickets && tickets.reduce((acc, e) => {
    if(e.paymentStatus === "paid"){
        acc += e.quantity;
    }
    return acc;
    
},0)

const revenue = tickets && tickets.reduce((acc, e) => {
    if(e.paymentStatus === "paid"){
        acc += e.totalPrice;
    }
    return acc;
    
},0)
  
const handleRevenue = () => {
  navigate('/revenue-charts')
}

// New notify function
const handleNotify = async (ticket) => {
  try {
    const token = localStorage.getItem("token");
    // Example API call — replace URL with your actual notification API
   const response = await axios.post(
      "https://msp-backend-cdho.onrender.com/api/event/notify-event",
      {
        ticketId: ticket._id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setToastMessage(response.data.message);
    setShowToast(true);
  } catch (err) {
    console.error("Error sending notification:", err);
    setToastMessage("Failed to send notification");
    setShowToast(true);  }
};

const handleEdit = (evt, e) => {
  updateEventDetails(evt);
  navigate("/create-event");
};

const handleDeleteEvent = async (id, e) => {
  e.stopPropagation();
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`https://msp-backend-cdho.onrender.com/api/event/delete/${id}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    setEvents(prev => prev.filter(ev => ev._id !== id));
  } catch (err) {
    console.log("Delete Error:", err);
  }
};

  return (
    <>
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999, position:'fixed' }}>
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
      <div className="mt-4 mb-4 d-flex justify-content-between align-items-center" style={{flex:'1'}}>
     <h3 className="mb-4" style={{ margin: "0" }}>
 
  Organizer Dashboard
</h3>
<FaChartBar className="mb-4 " style={{width: '30px', height:'30px', cursor:'pointer', justifyContent:'space-between', margin:'0'}} onClick={() => handleRevenue()}/>
</div>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <h6>Total Events</h6>
              <h3>{totalEvents}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <h6>Total Tickets</h6>
              <h3>{totalTickets}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <h6>Approved Events</h6>
              <h3>{approvedEvents}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <h6>Available Tickets</h6>
              <h3>{availableTickets}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <h6>Ticket Sales</h6>
              <h3>{ticketSales}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <h6>Revenue</h6>
              <h3>${revenue}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Event Organiser</th>
            <th>EventName</th>
            <th>Category</th>
            <th>Date</th>
            <th>Location</th>
            <th>Tickets</th>
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
              {
                event && event?.ticketTypes.map((ticket) => (
                    <td key={ticket._id}>{ticket.availableTickets}</td>
                ))
            }
              <td>
                <Badge
                  bg={
                    event.status === "approved"
                      ? "success"
                      : "warning"
                  }
                >
                  {event.status}
                </Badge>
              </td>
              <td>
              <Button
              style={{
                marginRight:'0.8rem'
              }}
              variant="info"
                    size="sm"
            onClick={(e) => handleEdit(event, e)}
           
          >
            Edit
          </Button>
        
          <Button
            onClick={(e) => handleDeleteEvent(event._id, e)}
            variant='danger'
            size="sm"
          >
            Delete
          </Button>
              </td>
             
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    <Container fluid>
      {/* Existing dashboard code here... */}

      {/* Existing table here... */}

      {/* New Users Notification Table */}
      <h4 className="mt-5 mb-3">User Ticket Notifications</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Event Name</th>
            <th>Quantity</th>
            <th>Ticket Type</th>
            <th>Notify</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center">
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
    </Container>
      </>
  );
};

export default OrganiserDashboard;
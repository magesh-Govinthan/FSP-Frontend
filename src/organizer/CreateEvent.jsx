import React, { useState, useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { EventContext } from "../users/Context/EventContext";
import "./CreateEvent.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";


const EventForm = () => {
  const {event, updateEventDetails} = useContext(EventContext);
  const token = localStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const [events, setEvent] = useState({
    eventName: "",
    category: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    Totalticket: "",
    eventImage: "",
    eventInformation: "",
    starGuest: "",
    whatNew: "",
    specialFor: "",
    facility: "",
    ticketTypes: [
      { ticketName: "", price: "", availableTickets: "" }
    ],
    newFeatures: [""],
    specialFeatures: [""],
    facilitiesList: [""],
    ...event
  });

  const handleChange = (e) => {
    setEvent({ ...events, [e.target.name]: e.target.value });
  };

  // Dynamic ticket handling
  const handleTicketChange = (index, field, value) => {
    const updated = [...events.ticketTypes];
    updated[index][field] = value;
    setEvent({ ...events, ticketTypes: updated });
  };

  const addTicket = () => {
    setEvent({
      ...events,
      ticketTypes: [...events.ticketTypes, { ticketName: "", price: "", availableTickets: "" }]
    });
  };

  const createNewEvent = async () => {
    try {
        const eventData = {
            ...events,        // all event fields
            organizer: user._id, // or user.id if backend expects id
            role: user.role
          };
      const { data } = await axios.post("https://msp-backend-cdho.onrender.com/api/event/create",
        eventData,
        {
        headers: {
            Authorization: `Bearer ${token}`
          }
        },
       
    );
      console.log("Event Created:", data);
      setEvent(
        {
            eventName: "",
            category: "",
            date: "",
            time: "",
            location: "",
            venue: "",
            Totalticket: "",
            eventImage: "",
            eventInformation: "",
            starGuest: "",
            whatNew: "",
            specialFor: "",
            facility: "",
            ticketTypes: [
              { ticketName: "", price: "", availableTickets: "" }
            ],
            newFeatures: [""],
            specialFeatures: [""],
            facilitiesList: [""],
            
      })
      updateEventDetails({}); // clear context
      // Optionally, you can redirect or show a success message here
    } catch (err) {
        console.error("Event Creation Error:", err.response?.data?.message || err.message || "Failed to create event");
        // Optionally, you can show an error message to the user here
    }
  };
   const updateExistingEvent = async () => {
    axios.put(
        `https://msp-backend-cdho.onrender.com/api/event/update/${event._id}`,
        events, // ✅ data
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        console.log("Event Updated:", res.data);
      
        setEvent({
          eventName: "",
          category: "",
          date: "",
          time: "",
          location: "",
          venue: "",
          Totalticket: "",
          eventImage: "",
          eventInformation: "",
          starGuest: "",
          whatNew: "",
          specialFor: "",
          facility: "",
          ticketTypes: [
            { ticketName: "", price: "", availableTickets: "" }
          ],
          newFeatures: [""],
          specialFeatures: [""],
          facilitiesList: [""],
        });
        
        // optional: navigate or show toast
      })
      .catch((err) => {
        console.error(
          "Event Update Error:",
          err.response?.data?.message || err.message || "Failed to update event"
        );
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(Object.keys(event).length );
    if(Object.keys(event).length === 0){
        console.log("Creating new event...");
        createNewEvent();
        updateEventDetails({}); // clear context after creation
    } else {
      
        updateExistingEvent();
    }
    if(user.role === 'admin')     navigate('/admin-dashboard')
    else if(user.role === 'organizer') navigate('/organizer-dashboard')
    else navigate('/')
  };

  const inputStyle = {
    backgroundColor: "#2a2a3d",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px"
  };
 return ( 
  <div style={{
    background: "#1e1e2f",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "700px",
    margin: "auto",
    color: "#fff"
  }}>
    <Form onSubmit={handleSubmit}>
  
      <h3 style={{ marginBottom: "20px" }}>Create Event</h3>
  
      {/* Event Name */}
      <Form.Group className="mb-3">
        <Form.Label>Event Name</Form.Label>
        <Form.Control
          name="eventName"
          className="custom-input"
          value={events.eventName}
          onChange={handleChange}
          placeholder="Enter event name"
          style={inputStyle}
        />
      </Form.Group>
  
      {/* Category */}
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          name="category"
          className="custom-input"
          value={events.category}
          onChange={handleChange}
          placeholder="Enter category"
          style={inputStyle}
        />
      </Form.Group>
  
      {/* Date & Time */}
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              className="custom-input"
              type="date"
              name="date"
              value={events.date}
              onChange={handleChange}
              style={inputStyle}
            />
          </Form.Group>
        </Col>
  
        <Col>
          <Form.Group>
            <Form.Label>Time</Form.Label>
            <Form.Control
              name="time"
              className="custom-input"
              value={events.time}
              onChange={handleChange}
              placeholder="10:00 AM"
              style={inputStyle}
            />
          </Form.Group>
        </Col>
      </Row>
  
      {/* Location */}
      <Form.Group className="mt-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          name="location"
          className="custom-input"
          value={events.location}
          onChange={handleChange}
          placeholder="Enter location"
          style={inputStyle}
        />
      </Form.Group>
  
      {/* Venue */}
      <Form.Group className="mt-3">
        <Form.Label>Venue</Form.Label>
        <Form.Control
          name="venue"
          className="custom-input"
          value={events.venue}
          onChange={handleChange}
          placeholder="Enter venue"
          style={inputStyle}
        />
      </Form.Group>
  
      {/* Total Tickets */}
      <Form.Group className="mt-3">
        <Form.Label>Total Tickets</Form.Label>
        <Form.Control
          type="number"
          name="Totalticket"
          className="custom-input"
          value={events.Totalticket}
          onChange={handleChange}
          placeholder="Enter total tickets"
          style={inputStyle}
        />
      </Form.Group>
  
      {/* Tickets */}
      <h5 className="mt-4">Ticket Types</h5>
      {events.ticketTypes.map((ticket, index) => (
        <Row key={index} className="mb-2">
          <Col>
            <Form.Control
              placeholder="Ticket Name"
              className="custom-input"
              value={ticket.ticketName}
              onChange={(e) =>
                handleTicketChange(index, "ticketName", e.target.value)
              }
              style={inputStyle}
            />
          </Col>
  
          <Col>
            <Form.Control
              type="number"
              placeholder="Price"
              className="custom-input"
              value={ticket.price}
              onChange={(e) =>
                handleTicketChange(index, "price", e.target.value)
              }
              style={inputStyle}
            />
          </Col>
  
          <Col>
            <Form.Control
              type="number"
              placeholder="Available"
              className="custom-input"
              value={ticket.availableTickets}
              onChange={(e) =>
                handleTicketChange(index, "availableTickets", e.target.value)
              }
              style={inputStyle}
            />
          </Col>
        </Row>
      ))}
  
      <Button
        variant="outline-light"
        size="sm"
        onClick={addTicket}
        style={{ marginTop: "5px" }}
      >
        + Add Ticket
      </Button>
  
      {/* Other Info */}
      <h5 className="mt-4">Other Info</h5>
  
      <Form.Group className="mt-3">
        <Form.Label>Star Guest</Form.Label>
        <Form.Control
          name="starGuest"
          className="custom-input"
          value={events.starGuest}
          onChange={handleChange}
          placeholder="Enter guest name"
          style={inputStyle}
        />
      </Form.Group>
  
      <Form.Group className="mt-3">
        <Form.Label>What’s New</Form.Label>
        <Form.Control
          name="whatNew"
          className="custom-input"
          value={events.whatNew}
          onChange={handleChange}
          placeholder="Enter what’s new"
          style={inputStyle}
        />
      </Form.Group>
  
      <Form.Group className="mt-3">
        <Form.Label>Special For</Form.Label>
        <Form.Control
          name="specialFor"
          className="custom-input"
          value={events.specialFor}
          onChange={handleChange}
          placeholder="Enter special for"
          style={inputStyle}
        />
      </Form.Group>
  
      <Form.Group className="mt-3">
        <Form.Label>Facility</Form.Label>
        <Form.Control
          name="facility"
          className="custom-input"
          value={events.facility}
          onChange={handleChange}
          placeholder="Enter facility"
          style={inputStyle}
        />
      </Form.Group>
  
      <Form.Group className="mt-3">
        <Form.Label>New Features (comma separated)</Form.Label>
        <Form.Control
          name="newFeatures"
          className="custom-input"
          value={events.newFeatures.join(", ")}
          onChange={(e) => setEvent({ ...events, newFeatures: e.target.value.split(",") })}
          placeholder="Feature1, Feature2"
          style={inputStyle}
        />
      </Form.Group>
  
      <Form.Group className="mt-3">
        <Form.Label>Special Features (comma separated)</Form.Label>
        <Form.Control
          name="specialFeatures"
          className="custom-input"
          value={events.specialFeatures.join(", ")}
          onChange={(e) => setEvent({ ...events, specialFeatures: e.target.value.split(",") })}
          placeholder="Feature1, Feature2"
          style={inputStyle}
        />
      </Form.Group>
  
      {/* Event Image */}
      <Form.Group className="mt-3">
        <Form.Label>Event Image URL</Form.Label>
        <Form.Control
          name="eventImage"
          className="custom-input"
          value={events.eventImage}
          onChange={handleChange}
          placeholder="Paste image URL"
          style={inputStyle}
        />
      </Form.Group>
  
      {/* Description */}
      <Form.Group className="mt-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="eventInformation"
          className="custom-input"
          value={events.eventInformation}
          onChange={handleChange}
          placeholder="Write about the event..."
          style={inputStyle}
        />
      </Form.Group>
  
      {/* Submit */}
      <Button
        type="submit"
        style={{
          marginTop: "20px",
          width: "100%",
          background: "#4f46e5",
          border: "none",
          padding: "10px",
          fontWeight: "600"
        }}
      >
       {Object.keys(event).length === 0? 'Submit Event' : 'Update Event'}
      </Button>
  
    </Form>
  </div>
 );
};

export default EventForm;
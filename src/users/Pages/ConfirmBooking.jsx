import React, { useContext } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { TicketContext } from "../Context/TicketContext";
import { EventContext } from "../Context/EventContext";
import { UserContext } from "../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmBooking = () => {
  const token = localStorage.getItem("token");
  const { ticket } = useContext(TicketContext);
  const { event } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const finalUser = JSON.parse(sessionStorage.getItem("user")) || user;
  const navigate = useNavigate();
  const ticketDetails = [
    {
      name: "General",
      qty: ticket?.qty?.General || 0,
      pricePerTicket: event?.ticketTypes?.[0]?.price,
    },
    {
      name: "VIP",
      qty: ticket?.qty?.VIP || 0,
      pricePerTicket: event?.ticketTypes?.[1]?.price,
    },
  ];
  const filteredTickets = ticketDetails.filter((t) => t.qty > 0);

  const onPay = () => {
    if (Object.keys(finalUser).length === 0) {
      navigate("/login");
      return;
    }
    axios
      .post("https://msp-backend-cdho.onrender.com/api/payments/checkout", {
        headers: { Authorization: `Bearer ${token}` },
        eventId: event._id,
        ticketType: ticket.qty,
        user: finalUser._id,
      })
      .then((resp) => {
        axios
          .post("https://msp-backend-cdho.onrender.com/api/ticket/book", {
            headers: { Authorization: `Bearer ${token}` },
            eventId: event._id,
            ticketType: ticket.qty,
            user: finalUser._id,
            email: finalUser.email,
          })
          .then((res) => {
            if (res.data.message.includes("successfully")) {
              window.location.href = resp.data.url;
              sessionStorage.setItem("paymentId", resp.data.session);
            } else {
              alert("Booking failed. Please try again.");
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log("Payment Error:", err));
  };

 return (
   <Container className="py-4 py-md-5 px-2 px-md-3">
     <Row className="justify-content-center">
       {/* Responsive width */}
       <Col xs={12} sm={10} md={8} lg={6}>
         <Card className="shadow-lg">
           <Card.Body>
             {/* Event Info */}
             <h3 className="mb-2 text-center text-md-start">
               {event.eventName}
             </h3>

             <p className="text-muted text-center text-md-start">
               {new Date(event.date).toLocaleString("en-US", {
                 month: "short",
                 day: "2-digit",
                 year: "numeric",
                 hour: "numeric",
                 minute: "numeric",
               })}{" "}
               onwards
             </p>

             <hr />

             {/* Ticket Summary */}
             <h5 className="mb-3">Ticket Summary</h5>

             <ListGroup variant="flush">
               {filteredTickets.map((t, index) => (
                 <ListGroup.Item
                   key={index}
                   className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
                 >
                   <div>
                     {t.name} ({t.qty} × ${t.pricePerTicket})
                   </div>
                   <strong>€{t.qty * t.pricePerTicket}</strong>
                 </ListGroup.Item>
               ))}
             </ListGroup>

             <hr />

             {/* Totals */}
             <div className="d-flex justify-content-between flex-wrap">
               <span>Total Quantity</span>
               <strong>{ticket.totalQty}</strong>
             </div>

             <div className="d-flex justify-content-between mt-2 flex-wrap">
               <span>Total Amount</span>
               <strong>{ticket.totalAmount}</strong>
             </div>

             {/* Pay Button */}
             <div className="d-grid mt-4">
               <Button
                 variant="primary"
                 size="lg"
                 className="w-100"
                 onClick={() => onPay()}
               >
                 Pay ${ticket.totalAmount}
               </Button>
             </div>
           </Card.Body>
         </Card>
       </Col>
     </Row>
   </Container>
 );
};

export default ConfirmBooking;

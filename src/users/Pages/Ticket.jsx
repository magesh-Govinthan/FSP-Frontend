import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import "./Ticket.css";
import { EventContext } from "../Context/EventContext";
import { TicketContext } from "../Context/TicketContext";
import { useNavigate } from "react-router-dom";
const TicketCard = () => {
  const { event } = useContext(EventContext);
  const {updateTicketDetails} = useContext(TicketContext);
  const Navigate = useNavigate();
  // store quantity per ticket using object
  const [qty, setQty] = useState({});
 

  const handleQtyChange = (ticketName, type) => {
    setQty((prev) => {
      const currentQty = prev[ticketName] || 0;

      if (type === "inc") {
        return {
          ...prev,
          [ticketName]: currentQty + 1,
        };
      }

      if (type === "dec") {
        return {
          ...prev,
          [ticketName]: currentQty > 0 ? currentQty - 1 : 0,
        };
      }

      return prev;
    });
  };
  const generalQty = Number(qty.General) || 0;
const vipQty = Number(qty.VIP) || 0;
const totalQty = generalQty + vipQty;
// total calculation
const totalAmount = event.ticketTypes.reduce((sum, ticket) => {
  const quantity = qty[ticket.ticketName] || 0;
  return sum + quantity * ticket.price;
}, 0);
const handleBookTicket = () => {
  updateTicketDetails({qty, totalQty, totalAmount});
  Navigate('/confirm-booking')
 
};

  return (
    <>
      <div className="ticket-container">
        {event.ticketTypes.map((ticket) => (
          <div className="ticket-card" key={ticket.ticketName}>
            <h5 className="title">{ticket.ticketName}</h5>

            <p className="ticket-no">
              Available Tickets:{" "}
              <strong>{ticket.availableTickets}</strong>
            </p>

            <p className="price">
              Ticket Price: ${ticket.price}
            </p>

            <hr />

            {/* Quantity Controls */}
            <div className="qty-box">
              <Button
                variant="outline-danger"
                onClick={() =>
                  handleQtyChange(ticket.ticketName, "dec")
                }
                disabled={!qty[ticket.ticketName]}
              >
                -
              </Button>

              <span className="qty">
                {qty[ticket.ticketName] || 0}
              </span>

              <Button
                variant="outline-success"
                onClick={() =>
                  handleQtyChange(ticket.ticketName, "inc")
                }
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Buttons */}
     

      <div className="summary-box">
  <div className="row-summary">
    <div>Quantity</div>
    <div>{qty.General || qty.VIP ? totalQty : 0}</div>
  </div>


  <div className="row-summary total">
    <strong>Total</strong>
    <strong>${totalAmount}</strong>
  </div>

  <Button
    className="pay-btn"
    disabled={totalAmount === 0}
    onClick={() => handleBookTicket()}
  >
    Confirm Book Ticket
  </Button>
</div>
    </>
  );
};

export default TicketCard;
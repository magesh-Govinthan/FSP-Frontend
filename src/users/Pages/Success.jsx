import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { FaArrowCircleRight } from "react-icons/fa";
import "./Success.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const sessionData = sessionStorage.getItem("paymentId");
  const verifyRef = useRef(false);
  const storeRef = useRef(false);
  useEffect(() => {
    if (verifyRef.current) return; // prevent second call in StrictMode
    verifyRef.current = true;
    axios.post(
      "https://msp-backend-cdho.onrender.com/api/payments/verify-payment",
      { session_id: sessionData }
    )
      .then((res) => {
        if (res.data.success) {
          setTextMessage(' ⭐ Payment verified successfully! Please leave a review.')
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false)
            setTextMessage("");
          }, 3000);
        }
      })
      .catch((err) => {
        console.error("Verification Error:", err);
        alert("Payment verification failed. Please try again.");
      });
  }, []);

  useEffect(() => {
    if (storeRef.current) return; // prevent second call in StrictMode
    storeRef.current = true;
    axios.post(
      "https://msp-backend-cdho.onrender.com/api/payments/store",
      { session_id: sessionData }
    )
      .then((res) => {

        if (res.data.success) {
          setTextMessage(' ⭐ Payment stored successfully in bookings page');
          setShowSuccess(true);
         
          setTimeout(() => {
            setShowSuccess(false);
            setTextMessage("");
          }, 3000);
          sessionStorage.removeItem("paymentId");
        }
      })
      .catch((err) => {
        console.error("Verification Error:", err);
        alert("Payment store failed. Please try again.");
      });
  },[sessionData])

  const handleSubmit = async () => {
    if (!name || !rating || !comment) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("https://msp-backend-cdho.onrender.com/api/reviews", {
        name,
        rating,
        comment,
      });
      setTextMessage(' ⭐ Thanks for your review!')
      setShowSuccess(true);

      // Hide after 3 sec
      setTimeout(() => setShowSuccess(false), 3000);

      // reset fields
      setName("");
      setRating(0);
      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigate = () => {
    navigate("/");
  };
  return (
    <>
      {
        <Container className="text-center py-5">
          <Row className="justify-content-center">
            <Col xs="auto">
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
                width="100"
                height="100"
              >
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
              </svg>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2 className="text-success mt-3">Payment Successful!</h2>
              <p>Your ticket is confirmed</p>
            </Col>
          </Row>
        </Container>

      }
      <Container className="holi-5 p-4 border rounded" style={{ width: "800px" }}>
        {showSuccess && (
          <div className="success-toast">
            {textMessage}
          </div>
        )}
        <h3 className="mb-3">Reviews</h3>

        {/* Rating Stars */}
        <Row className="align-items-center mb-3">
          <Col xs="auto">
            <span>Rating:</span>
          </Col>
          <Col>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  cursor: "pointer",
                  color: star <= rating ? "#ffc107" : "#e4e5e9",
                  fontSize: "1.5rem",
                  marginRight: "5px",
                }}
              >
                ★
              </span>
            ))}
          </Col>
        </Row>

        {/* Name Input */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        {/* Comment Input + Submit */}
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button variant="danger" onClick={handleSubmit}>
            <FaArrowCircleRight />
          </Button>
        </InputGroup>

      </Container>
      <Container style={{ width: "800px", placeItems: "center", marginTop: '3rem' }} className="d-flex justify-content-center">
        <Button variant="info" onClick={handleNavigate}>
          Back to Home
        </Button>
      </Container>
    </>
  );
}
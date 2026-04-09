import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import "./Success.css";

const Success = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please give rating");
      return;
    }

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    setRating(0);
    setReview("");
  };

  return (
    <Container className="success-container">
      {showToast && (
        <div className="success-toast">Review submitted successfully 🎉</div>
      )}

      <div className="success-card">
        <h2 className="success-title">🎉 Booking Successful</h2>

        <p className="success-sub">Thank you for booking the event.</p>

        <hr />

        <h5 className="review-title">Rate your experience</h5>

        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => {
            return (
              <span
                key={star}
                className={star <= (hover || rating) ? "star active" : "star"}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            );
          })}
        </div>

        <Form.Group className="mt-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </Form.Group>

        <div className="submit-area">
          <Button className="submit-btn" onClick={handleSubmit}>
            Submit Review
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Success;

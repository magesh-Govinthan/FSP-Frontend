import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          "https://msp-backend-cdho.onrender.com/api/reviews/",
        );
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://msp-backend-cdho.onrender.com/api/reviews/${id}`,
      );

      setReviews((prev) => prev.filter((r) => r._id !== id));
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
          style={{ cursor: "pointer", margin: "0" }}
          onClick={() => navigate("/admin-dashboard")}
        />
        <h4 className="m-0">User Reviews</h4>
      </div>

      {/* Reviews Grid */}
      <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-4">
        {reviews.map((review) => (
          <Col key={review._id}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{review.name}</Card.Title>

                <Card.Subtitle className="mb-2 text-muted">
                  Rating: {review.rating} ⭐
                </Card.Subtitle>

                <Card.Text className="flex-grow-1">{review.comment}</Card.Text>

                <Card.Text
                  className="text-muted"
                  style={{ fontSize: "0.85rem" }}
                >
                  {new Date(review.createdAt).toLocaleString()}
                </Card.Text>

                <Button
                  variant="danger"
                  size="sm"
                  className="mt-auto w-100"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminReviews;

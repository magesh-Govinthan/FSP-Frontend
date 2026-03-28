import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("https://msp-backend-cdho.onrender.com/api/reviews/");
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, []);

  // Delete review
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://msp-backend-cdho.onrender.com/api/reviews/${id}`);
      // Update UI instantly
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
        <div className=" mb-4 d-flex gap-4 align-items-center" >
          <ArrowLeft
            style={{ cursor: "pointer", margin:'0' }}
            onClick={() => navigate('/admin-dashboard')}
          />
       <h4 style={{margin:'0'}}>User Reviews</h4>
        </div>
     
      <Row xs={1} md={2} lg={3} className="g-4">
        {reviews.map((review) => (
          <Col key={review._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{review.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Rating: {review.rating} ⭐
                </Card.Subtitle>
                <Card.Text>{review.comment}</Card.Text>
                <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {new Date(review.createdAt).toLocaleString()}
                </Card.Text>
                <Button
                  variant="danger"
                  size="sm"
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
import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    variant: "" // "success" or "danger"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call your forgot password API
      const response = await axios.post("https://msp-backend-cdho.onrender.com/api/user/forgot-password", {
        email
      });
      setNotification({
        message: response.data.message || "Password reset link sent!",
        variant: "success"
      });

      // Optional: clear email field
      setEmail("");

    } catch (error) {
      setNotification({
        message: error.response?.data?.message || "Failed to send reset link",
        variant: "danger"
      });
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Row>
        <Col>
          <Card style={{ width: "24rem" }} className="p-4 shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Forgot Password</h3>

              {/* Notification */}
              {notification.message && (
                <Alert
                  variant={notification.variant}
                  onClose={() => setNotification({ message: "", variant: "" })}
                  dismissible
                >
                  {notification.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="warning" type="submit" className="w-100">
                  Send Reset Link
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>Remembered your password? Login</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
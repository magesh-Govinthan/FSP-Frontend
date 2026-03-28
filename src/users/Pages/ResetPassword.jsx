import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams(); // Assuming URL: /reset-password/:token
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [notification, setNotification] = useState({
    message: "",
    variant: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: "Passwords do not match", variant: "danger" });
      return;
    }

    try {
      const response = await axios.post(
        `https://msp-backend-cdho.onrender.com/api/user/reset-password/${token}`,
        { password: formData.password }
      );

      setNotification({ message: response.data.message || "Password reset successful!", variant: "success" });

      // Optional: Redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);

    } catch (error) {
      setNotification({
        message: error.response?.data?.message || "Password reset failed",
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
              <h3 className="text-center mb-4">Reset Password</h3>

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
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  Reset Password
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>Remembered your password? <a href="/login">Login</a></small>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
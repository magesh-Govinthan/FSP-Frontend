import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [notification, setNotification] = useState({
    message: "",
    variant: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendPostRequest = async (formData) => {
    try {
      const response = await axios.post(
        "https://msp-backend-cdho.onrender.com/api/user/register",
        { ...formData },
      );

      if (response.data) {
        setNotification({
          message: response.data.message,
          variant: "success",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      setNotification({
        message: "Registration failed",
        variant: "danger",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendPostRequest(formData);
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <Card className="p-3 p-md-4 shadow w-100">
            <Card.Body>
              <h3 className="text-center mb-4">Register</h3>

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
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    name="phone"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Register
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  Already have an account? <Link to="/login">Login</Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;

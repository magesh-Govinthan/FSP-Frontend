import React, { useState, useContext } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../Context/AuthContext";
import { TicketContext } from "../Context/TicketContext";

const Login = () => {
  const navigate = useNavigate();
  const { updateUserDetails } = useContext(UserContext);
  const { ticket } = useContext(TicketContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [notification, setNotification] = useState({
    message: "",
    variant: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://msp-backend-cdho.onrender.com/api/user/login?email=${formData.email}&password=${formData.password}`,
      );

      const user = response.data.user;

      updateUserDetails(user);

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("token", response.data.token);

      setNotification({ message: "Login successful!", variant: "success" });

      if (Object.keys(ticket).length > 0) navigate("/confirm-booking");
      else navigate("/");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      setNotification({
        message: error.response?.data?.message || "Login failed",
        variant: "danger",
      });
    }
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
              <h3 className="text-center mb-4">Login</h3>

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
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  Don't have an account? <Link to="/register">register</Link>
                </small>
              </div>

              <div className="text-center mt-2">
                <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './Success.css'

export default function PaymentFailed() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <Container className="text-center py-5 d-flex flex-column justify-content-center align-items-center min-vh-100">
      
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="d-flex justify-content-center">
          <svg
            className="fail-cross img-fluid"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            width="100"
            height="100"
          >
            <circle className="fail-circle" cx="26" cy="26" r="25" fill="none" />
            <line className="fail-line" x1="16" y1="16" x2="36" y2="36" />
            <line className="fail-line" x1="36" y1="16" x2="16" y2="36" />
          </svg>
        </Col>
      </Row>

      <Row className="w-100">
        <Col xs={12}>
          <h2 className="text-danger mt-3 fs-4 fs-md-3 fs-lg-2">
            Payment Failed
          </h2>
          <p className="px-3 px-md-0">
            Something went wrong. Please try again.
          </p>
        </Col>
      </Row>

    </Container>
  );
}
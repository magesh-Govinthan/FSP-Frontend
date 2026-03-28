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
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col xs="auto">
          <svg
            className="fail-cross"
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
      <Row>
        <Col>
          <h2 className="text-danger mt-3">Payment Failed</h2>
          <p>Something went wrong. Please try again.</p>
        </Col>
      </Row>
    </Container>
  );
}
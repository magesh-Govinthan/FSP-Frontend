import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Spinner,
  Alert,
  Badge,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const PaymentListPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(
          `https://msp-backend-cdho.onrender.com/api/payments/user/${user._id}`,
        );
        setPayments(data?.payments || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch payments",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case "paid":
        return (
          <Badge bg="success" className="mb-2">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge bg="warning" className="mb-2">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge bg="danger" className="mb-2">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center text-md-start">My Payments</h2>

      {/* ✅ FIXED RESPONSIVE GRID */}
      <Row xs={1} sm={2} md={2} lg={3} className="g-4">
        {payments.map((payment) => (
          <Col key={payment._id}>
            <Card className="h-100 shadow-sm" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                {/* Success Icon */}
                {payment.status === "paid" && (
                  <div
                    style={{
                      backgroundColor: "#d1e7dd",
                      borderRadius: "50%",
                      width: 60,
                      height: 60,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="#198754"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.485 1.929a.75.75 0 0 1 1.06 1.06l-8.25 8.25a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 1 1 1.06-1.06L6 9.44l7.485-7.51z" />
                    </svg>
                  </div>
                )}

                {/* Amount */}
                <h3 className="fw-bold mb-1">${payment.amount.toFixed(2)}</h3>
                <p className="text-muted mb-3">
                  {payment.status === "paid"
                    ? "paid successfully!"
                    : payment.status}
                </p>

                {/* Details */}
                <Card bg="light" className="w-100 p-3 mb-3">
                  <div className="mb-2">
                    <small className="text-muted">User</small>
                    <div className="fw-semibold">
                      {payment.user?.name || "Unknown"}
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Event</small>
                    <div className="fw-semibold">
                      {payment.event?.eventName || "Unknown Event"}
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Quantity</small>
                    <div className="fw-semibold">
                      General: {payment.quantity?.General || 0} <br />
                      VIP: {payment.quantity?.VIP || 0}
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Date</small>
                    <div className="fw-semibold">
                      {new Date(payment.createdAt).toLocaleString()}
                    </div>
                  </div>
                </Card>

                {/* Status */}
                {renderStatus(payment.status)}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PaymentListPage;

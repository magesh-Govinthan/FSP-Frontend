import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner, Alert, Badge, Card, Row, Col } from "react-bootstrap";

const PaymentListPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(`https://msp-backend-cdho.onrender.com/api/payments/user/${user._id}`);
        console.log("Fetched Payments:", data);
        setPayments(data?.payments || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case "paid":
        return <Badge bg="success" className="mb-2">Paid</Badge>;
      case "pending":
        return <Badge bg="warning" className="mb-2">Pending</Badge>;
      case "failed":
        return <Badge bg="danger" className="mb-2">Failed</Badge>;
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
    <Container className="mt-5" style={{ width: '100%' }}>
      <h2 className="mb-4">My Payments</h2>
      <Row xs={1} md={2} lg={3} className="g-4" style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
        {payments.map((payment, index) => (
          <Col key={payment._id} style={{width: '350px'}}>
            <Card
              style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)" }}
              className="h-100"
            >
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

                {/* Amount and status */}
                <h3 style={{ fontWeight: "700", marginBottom: "6px" }}>
                  ${payment.amount.toFixed(2)}
                </h3>
                <p style={{ color: "#6c757d", marginBottom: 20 }}>
                  {payment.status === "paid" ? "paid successfully!" : payment.status}
                </p>

                {/* Payment details card */}
                <Card
                  bg="light"
                  className="w-100 p-3 mb-3"
                  style={{ borderRadius: "8px", boxShadow: "none" }}
                >
                    <div className="mb-2">
                    <small className="text-muted">User</small>
                    <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      {payment.user?.name || "Unknown"}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">Event</small>
                    <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      {payment.event?.eventName || "Unknown Event"}
                    </div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Quantity</small>
                    <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      General:{payment.quantity?.General|| "Unknown Event"}{' '}<br />
                      VIP:{payment.quantity?.VIP || "Unknown Event"}
                    </div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Date</small>
                    <div style={{ fontWeight: "600" }}>
                      {new Date(payment.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                </Card>
                {/* Status badge below */}
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
import React, { useEffect, useState } from "react";
import { Table, Container, Badge, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = async () => {
    const res = await axios.get(
      "https://msp-backend-cdho.onrender.com/api/user/getallusers",
    );
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open modal
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShow(true);
  };

  // Close modal
  const handleClose = () => setShow(false);

  // Handle input change
  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  // Update user
  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://msp-backend-cdho.onrender.com/api/user/update/${selectedUser._id}`,
        selectedUser,
      );
      setShow(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://msp-backend-cdho.onrender.com/api/user/delete/${id}`,
      );

      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  return (
    <Container className="mt-4">
      {/* Header */}
      <div className="mb-4 d-flex align-items-center gap-3 flex-wrap">
        <ArrowLeft
          size={22}
          style={{ cursor: "pointer",margin:"0" }}
          onClick={() => navigate("/admin-dashboard")}
        />
        <h4 className="m-0">Users</h4>
      </div>

      {/* Users Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>

                <td>{user.name}</td>

                <td style={{ wordBreak: "break-all" }}>{user.email}</td>

                <td>{user.phone}</td>

                <td>
                  <Badge bg={user.role === "admin" ? "danger" : "primary"}>
                    {user.role}
                  </Badge>
                </td>

                <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                <td className="d-flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={selectedUser.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={selectedUser.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={selectedUser.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={selectedUser.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="success" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UsersTable;

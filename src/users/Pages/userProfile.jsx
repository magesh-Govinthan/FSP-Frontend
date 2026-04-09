import React, { useState } from "react";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";
import axios from "axios";

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const islogin = sessionStorage.getItem("isLoggedIn") === "true";
    const navigate = useNavigate();
    const [tempUser, setTempUser] = useState(user);
    const [notification, setNotification] = useState({
        message: "",
        variant: "" // "success" or "danger"
      });
    

    const handleEdit = () => {
        setTempUser(user);
        setIsEditing(true);
    };

const UpdateuserCredentials = async (updatedUser) => {
   try{
       const response =  await axios.put(`https://msp-backend-cdho.onrender.com/api/user/update/${user._id}`, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone
       }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
       })
       sessionStorage.setItem("user", JSON.stringify(response.data.user));
       setNotification({
        message: response.data.message || "Profile updated successfully!",
        variant: "success"
       })
   } catch(error){
       setNotification({
        message: error.response?.data?.message || "Failed to update profile",
        variant: "danger"
       })
   }
    
    };

    const handleSave = async() => {
        setIsEditing(false);
        UpdateuserCredentials(tempUser);
        
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setTempUser({
            ...tempUser,
            [e.target.name]: e.target.value,
        });
    };
    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <>
            {islogin && (<Container className="mt-5 d-flex justify-content-center">
                
                <Card style={{ width: "400px" }} className="shadow-sm p-4">
                {notification.message && (
                <Alert
                  variant={notification.variant}
                  onClose={() => setNotification({ message: "", variant: "" })}
                  dismissible
                >
                  {notification.message}
                </Alert>
              )}
                    {/* Profile Circle */}
                    <div className="text-center mb-4">
                        <div
                            style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                backgroundColor: "#0d6efd",
                                color: "#fff",
                                fontSize: "26px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "auto",
                            }}
                        >
                            {user.name.charAt(0)}
                        </div>
                    </div>

                    {/* VIEW MODE */}
                    {!isEditing ? (
                        <>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>

                            <div className="text-center mx-4">
                                <Button variant="primary" onClick={handleEdit}>
                                    Edit Profile
                                </Button>

                                <Button variant="danger" onClick={handleLogout} className="ms-3">
                                    Log out
                                </Button>
                            </div>
                        </>
                    ) : (
                        /* EDIT MODE (FORM) */
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={tempUser.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={tempUser.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={tempUser.phone}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <div className="text-center">
                                <Button variant="success" className="me-2" onClick={handleSave}>
                                    Save
                                </Button>
                                <Button variant="secondary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card>
            </Container>)
            }
        </>
    );
};

export default UserProfile;
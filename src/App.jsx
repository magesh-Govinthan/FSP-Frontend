import React from "react";
import Header from "./users/Compontent/Header";
import Home from "./users/Pages/Home";
import View from "./users/Pages/View";
import { Route, Routes } from "react-router-dom";
import Ticket from "./users/Pages/Ticket";
import PaymentSuccess from "./users/Pages/Success";
import NotFound from "./users/Pages/NotFound";
import Login from "./users/Pages/Login";
import Register from "./users/Pages/Register";
import ForgotPassword from "./users/Pages/ForgotPassword";
import ResetPassword from "./users/Pages/ResetPassword";
import UserProfile from "./users/Pages/userProfile";
import PaymentFailed from "./users/Pages/Failed";
import ConfirmBooking from "./users/Pages/ConfirmBooking";
import MyBookings from "./users/Pages/Mybookings";
import PaymentListPage from "./users/Pages/PaymentDetails";
import EventForm from "./organizer/CreateEvent";
import OrganiserDashboard from "./organizer/OrganiserDashboard";
import RevenueCharts from "./organizer/OrganiserChart";
import AdminDashboard from "./admin/adminDashBoard";
import UsersTable from "./admin/adminUsers";
import TicketTable from "./admin/adminTicket";
import AdminPayments from "./admin/adminPayments";
import AdminReviews from "./admin/adminReview";

function App() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log(user);
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view" element={<View />} />
        {user && user.role === "user" && (
          <Route path="/ticket" element={<Ticket />} />
        )}
        {user && user.role === "user" && (
          <Route path="/success" element={<PaymentSuccess />} />
        )}
        {user && user.role === "user" && (
          <Route path="/failed" element={<PaymentFailed />} />
        )}

        <Route path="/*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<UserProfile />} />
        {user && user.role === "user" && (
          <Route path="/confirm-booking" element={<ConfirmBooking />} />
        )}
        {user && user.role === "user" && (
          <Route path="/my-bookings" element={<MyBookings />} />
        )}
        {user && user.role === "user" && (
          <Route path="/payment-info" element={<PaymentListPage />} />
        )}
        {user && (user.role === "admin" || user.role === "organizer") && (
          <Route path="/create-event" element={<EventForm />} />
        )}
        {user && user.role === "organizer" && (
          <Route path="/organizer-dashboard" element={<OrganiserDashboard />} />
        )}
        {user && user.role === "organizer" && (
          <Route path="/revenue-charts" element={<RevenueCharts />} />
        )}
        {user && user.role === "admin" && (
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        )}
        {user && user.role === "admin" && (
          <Route path="/admin-users" element={<UsersTable />} />
        )}
        {user && user.role === "admin" && (
          <Route path="/admin-tickets" element={<TicketTable />} />
        )}
        {user && user.role === "admin" && (
          <Route path="/admin-payments" element={<AdminPayments />} />
        )}
        {user && user.role === "admin" && (
          <Route path="/admin-reviews" element={<AdminReviews />} />
        )}
      </Routes>
    </div>
  );
}

export default App;

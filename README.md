# 🎟️ Online Event Management Platform – Frontend

This is the **frontend application** for the Online Event Management Platform built using **React.js, Vite, and react-bootstrap**.
The application allows users to browse events, purchase tickets, and manage registrations while providing dashboards for organizers and administrators.

---

# 🚀 Features

## 👤 User Features

* User registration and login
* Browse available events
* Search and filter events
* View event details
* Purchase tickets
* Manage event registrations
* View purchased tickets

---

## 🧑‍💼 Organizer Features

* Organizer dashboard
* Create and manage events
* View event analytics
* Monitor ticket sales

---

## 🛠️ Admin Features

* Admin dashboard
* Manage users
* Monitor payments
* Manage tickets
* Review event listings

---

# 🧑‍💻 Tech Stack

* React.js
* Vite
* Axios
* React Router

---
#Live Demo
==========

Frontend: https://fsp-frontend-eight.vercel.app/
Backend API: https://msp-backend-cdho.onrender.com/api/event/

🔑 Demo Credentials

Use the following credentials to explore the system.

👤 User Login

Email: mageshgovinthan16@gmail.com
Password: mahi1234

🧑‍💼 Organizer Login

Email: magesgovinthan16@gmail.com
Password: mahi1234

🛠️ Admin Login

Email: add@gmail.com
Password:pal

## 📂 Frontend Project Structure

```
FSP-FRONTEND
│
├── node_modules
├── public
│
├── src
│   │
│   ├── admin
│   │   ├── adminDashboard.css
│   │   ├── adminDashBoard.jsx
│   │   ├── adminPayments.jsx
│   │   ├── adminReview.jsx
│   │   ├── adminTicket.jsx
│   │   └── adminUsers.jsx
│   │
│   ├── organizer
│   │   ├── CreateEvent.css
│   │   ├── CreateEvent.jsx
│   │   ├── OrganiserChart.jsx
│   │   └── OrganiserDashboard.jsx
│   │
│   ├── users
│   │
│   ├── Component
│   │   ├── Header.css
│   │   └── Header.jsx
│   │
│   ├── Context
│   │   ├── AuthContext.jsx
│   │   ├── EventContext.jsx
│   │   └── TicketContext.jsx
│   │
│   ├── Pages
│   │   ├── ConfirmBooking.jsx
│   │   ├── Failed.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.css
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MyBookings.jsx
│   │   ├── NotFound.jsx
│   │   ├── PaymentDetails.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Success.css
│   │   ├── Success.jsx
│   │   ├── Ticket.css
│   │   ├── Ticket.jsx
│   │   ├── useProfileIcon.jsx
│   │   ├── userProfile.jsx
│   │   ├── View.css
│   │   └── View.jsx
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vercel.json
└── vite.config.js
```

---

## 🧱 Frontend Architecture

The frontend follows a **modular React architecture**.

### Admin Module

Handles:

* Event management
* User management
* Payment monitoring
* Ticket management
* Review moderation

### Organizer Module

Allows organizers to:

* Create events
* Manage event details
* View event analytics

### User Module

Users can:

* Register and login
* Browse events
* Book tickets
* View booking history

### Context API

Global state management using:

* `AuthContext` → User authentication
* `EventContext` → Event data management
* `TicketContext` → Ticket booking state

### Components

Reusable UI components like:

* Header
* Navigation

### Pages

Contains all application pages like:

* Home
* Login
* Register
* Ticket booking
* Payment success/failure
* User profile

---

# ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/magesh-Govinthan/FSP-Frontend.git
```

### Navigate to project

```bash
cd event-management-frontend
```

### Install dependencies

```bash
npm install
```

### Run the project

```bash
npm run dev
```

---


# 🚀 Deployment

This frontend can be deployed using:

* Vercel
* GitHub Pages

---



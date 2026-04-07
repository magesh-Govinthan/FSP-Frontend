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
* TailwindCSS
* Axios
* React Router

---

# 📂 Project Structure

```
src
│
├── admin
│   ├── adminDashboard.jsx
│   ├── adminPayments.jsx
│   ├── adminReview.jsx
│   ├── adminTicket.jsx
│   └── adminUsers.jsx
│
├── organizer
│   ├── CreateEvent.jsx
│   ├── OrganiserDashboard.jsx
│   └── OrganiserChart.jsx
│
├── users
│
├── App.jsx
├── main.jsx
└── styles
```

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

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

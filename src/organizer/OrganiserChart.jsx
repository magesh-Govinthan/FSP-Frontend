import React from "react";
import { useState,useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // icon
import axios from "axios";
import { useContext } from "react";
import { EventContext } from "../users/Context/EventContext";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const RevenueCharts = () => {
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
 
 
  const { eventIds } = useContext(EventContext); 

  useEffect(() => {
    const fetchTickets = async () => {
       
          
          try {
            const token = localStorage.getItem("token");
    
            const response = await axios.post(
              "https://msp-backend-cdho.onrender.com/api/ticket/eventIds",
              { eventIds },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
    
    
            setTickets(response.data);
          } catch (err) {
            console.error("Error fetching tickets:", err);
          }
        
      };
    
      fetchTickets();
    }, [])


  
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateAndMonth = tickets.map((ticket) => {
    const date = new Date(ticket.createdAt);
    const day = date.getDate();
    const months =  month[date.getMonth()];
    return `${months} ${day}`;

  });
  const ticketQuantity = tickets.map((ticket) => ticket.quantity);
  const ticketPrice = tickets.map((ticket) => ticket.totalPrice);

  const ticketData = {
    labels: dateAndMonth,
    datasets: [
      {
        label: "Tickets Sold",
        data: ticketQuantity,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const priceData = {
  labels: dateAndMonth,
    datasets: [
      {
        label: "Ticket Price ($)",
        data: ticketPrice,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: true, color: "#eee" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#eee" },
      },
    },
  };

  return (
    <>
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: "40px",
        margin: "auto",
        maxWidth: "1200px",
        marginTop: "20px",
      }}
    >
      {/* Card */}
      
        {/* Header */}
        <div className=" mb-4 d-flex gap-4 align-items-center" >
          <ArrowLeft
            style={{ cursor: "pointer", margin:'0' }}
            onClick={() => navigate(-1)}
          />
          <h2 style={{ margin: 0 }}>Revenue Analytics</h2>
        </div>

        {/* Chart 1 */}
        <div className=" mb-4 d-flex justify-content-between align-items-center" style={{flexDirection:'column', height:'100%'}}>
        <div style={{ marginTop: "40px" , width:'100%', background: "#fff",
          borderRadius: "30px",
          padding: "30px",
          
         }} >
          <h3>Ticket Sales</h3>
          <Bar style={{width:'100%', height: '300px'}} data={ticketData} options={options} />
        </div>

        {/* Chart 2 */}
        <div style={{ marginTop: "40px" , width:'100%', background: "#fff",
          borderRadius: "30px",
          padding: "30px",
          
         }} >
          <h3>Event Revenue</h3>
          <Bar style={{width:'100%', height: '300px'}} data={priceData} options={options} />
        </div>
        </div>
      </div>
    
    </>
  );
};

export default RevenueCharts;
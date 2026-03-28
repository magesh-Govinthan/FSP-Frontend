import React from 'react'
import { useState, useEffect, useContext } from "react";
import "./Header.css"
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../Pages/useProfileIcon'
import { EventContext } from '../Context/EventContext';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { updateEventDetails } = useContext(EventContext);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("https://msp-backend-cdho.onrender.com/api/event/")
      .then((res) => {
        setEvents(res.data || []);
        // setFilteredEvents(res.data || []); // ✅ important
      })
      .catch((err) => console.log("Event Fetch Error:", err));
  }, []);
  // const isLoggedIn = localStorage.getItem("token") === null;
  const handleDirect = () => {
    navigate("/")
  }
  const handleLogin = () => {
    navigate("/login")
  }
  const handleRegister = () => {
    navigate("/register")
  }
  const handleBookings = () => {
    navigate("/my-bookings")
  }
  const handleSelectEvent = (event) => {
    updateEventDetails(event); // store selected event in context
    navigate("/view"); // go to view page
    setSearchTerm(""); // clear search input
    setFilteredEvents([]); // clear search results
  };
  const handleSearch = () => {
    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredEvents(filtered);
  };
  return (
    <>

      <div className='parent-head'>
        <div className='head-containter'>
          <div className='evt-1' onClick={handleDirect}>Event Blaster✨</div>
          <div className='evt-2'>
            <input type="text" placeholder='Search an event Name' className='input-1'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
            <button className='btn-search' onClick={handleSearch}>Search</button>
          </div>
          {searchTerm && filteredEvents.length > 0 && (
            <div className="search-results">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="search-item"
                    onClick={() => handleSelectEvent(event)}
                  >
                    {event.eventName}
                  </div>
                ))
              ) : (
                <div className="search-item">No events found</div>
              )}
            </div>
          )}
          <section className='evt-3'>
            {!user &&<div className='login' onClick={handleLogin}>Log in</div>}
            {!user && <div className='reg' onClick={handleRegister}>Register</div>}
            {user && user.role === 'user' &&<div className='book' onClick={handleBookings}>My bookings</div>}


           { user && <AppNavbar />}

          </section>
        </div>
      </div>

    </>
  )
}

export default Header

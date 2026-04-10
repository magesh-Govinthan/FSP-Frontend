import { useContext, useEffect, useState } from "react";
import { FcClock } from "react-icons/fc";
import { SlLocationPin } from "react-icons/sl";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EventContext } from "../Context/EventContext";

function FilterBar({
  filterDate,
  setFilterDate,
  filterLocation,
  setFilterLocation,
  filterCategory,
  setFilterCategory,
  clearFilters,
  upcomingEvents,
}) {
  const selectStyle = {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "6px 30px 6px 10px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    backgroundSize: "14px",
    minWidth: 120,
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "flex-end",
        fontSize: "14px",
        fontWeight: "600",
        color: "#444",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          cursor: "pointer",
        }}
      >
        {/* Category */}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
          }}
        >
          Category
          <select
            style={selectStyle}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(upcomingEvents.map((evt) => evt.category))]
              .filter(Boolean)
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </label>

        {/* Date */}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
          }}
        >
          Date
          <input
            type="date"
            style={{
              ...selectStyle,
              padding: "6px 10px",
              backgroundImage: "none",
            }}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>

        {/* Location */}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
          }}
        >
          Location
          <select
            style={selectStyle}
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(upcomingEvents.map((evt) => evt.location))].map(
              (loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ),
            )}
          </select>
        </label>
      </div>
      {/* Clear Button */}
      <div>
        <button
          onClick={clearFilters}
          style={{
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: "9px 18px",
            cursor: "pointer",
            fontWeight: "600",
            color: "#333",
            display: "flex",
            alignItems: "flex-end",
            height: "40px",
            width: "100px",
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const { updateEventDetails } = useContext(EventContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://msp-backend-cdho.onrender.com/api/event/")
      .then((res) => {
        const eventsData = res.data.filter(
          (data) => data.status === "approved",
        );
        setEvents(eventsData || []);
      })
      .catch((err) => console.log("Event Fetch Error:", err));
  }, []);
  const now = new Date();
  const upcomingSorted = events
    .filter((evt) => new Date(evt.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const currentEvent = upcomingSorted[0] || null;

  useEffect(() => {
    const now = new Date();

    // Recompute upcomingEvents fresh inside effect (avoid reference changes outside)
    const upcomingSorted = events
      .filter((evt) => new Date(evt.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const upcomingEvents = upcomingSorted.slice(1);
    let filtered = [...upcomingEvents];
    setUpcomingEvents(upcomingEvents);

    if (filterDate) {
      filtered = filtered.filter(
        (evt) =>
          new Date(evt.date).toDateString() ===
          new Date(filterDate).toDateString(),
      );
    }
    if (filterLocation) {
      filtered = filtered.filter((evt) =>
        evt.location.toLowerCase().includes(filterLocation.toLowerCase()),
      );
    }
    if (filterCategory) {
      filtered = filtered.filter(
        (evt) =>
          evt.category &&
          evt.category.toLowerCase().includes(filterCategory.toLowerCase()),
      );
    }

    setFilteredEvents(filtered);
  }, [filterDate, filterLocation, filterCategory, events]);

  const handleEdit = (evt, e) => {
    e.stopPropagation(); // prevent card click
    updateEventDetails(evt);
    navigate("/create-event");
  };

  const handleDeleteEvent = async (id, e) => {
    e.stopPropagation();

    try {
      await axios.delete(`https://msp-backend-cdho.onrender.com/api/event/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents((prev) => prev.filter((ev) => ev._id !== id));
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  const clearFilters = () => {
    setFilterDate("");
    setFilterLocation("");
    setFilterCategory("");
  };

  const handleChange = (evt) => {
    navigate("/view");
    updateEventDetails(evt);
  };
  const handleCreateEvent = () => {
    navigate("/create-event");
    updateEventDetails({});
  };
  const handleOrganiser = () => {
    navigate("/organizer-dashboard");
  };

  const handleAdmin = () => {
    navigate("/admin-dashboard");
  };
  return (
    <div>
      {/* ---------------- Current Event ---------------- */}
      <div style={{ marginBottom: "2rem", marginTop: "1rem" }}>
        {user && user.role !== "user" && (
          <button
            onClick={() => handleCreateEvent()}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "8px 16px",
              cursor: "pointer",
              margin: "2rem",
              fontWeight: "600",
            }}
          >
            + Create Event
          </button>
        )}
        {user && user.role === "admin" && (
          <button
            onClick={() => handleAdmin()}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "8px 16px",
              cursor: "pointer",
              margin: "2rem",
              fontWeight: "600",
            }}
          >
            admin
          </button>
        )}
        {user && user.role === "organizer" && (
          <button
            onClick={() => handleOrganiser()}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "8px 16px",
              cursor: "pointer",
              margin: "2rem",
              fontWeight: "600",
            }}
          >
            Organiser
          </button>
        )}
        <>
          <h2>Current Event</h2>
          {currentEvent && (
            <div
              className="home-1"
              onClick={() => handleChange(currentEvent)}
              style={{ cursor: "pointer" }}
            >
              <div className="img-child">
                <img
                  src={currentEvent.eventImage}
                  alt={currentEvent.eventName}
                />
              </div>
              <h2>{currentEvent.eventName}</h2>
              <div className="time">
                <p>
                  <FcClock />
                </p>
                <p>
                  {new Date(currentEvent.date).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {currentEvent.time} onwards
                </p>
              </div>
              <div className="loc">
                <p>
                  <SlLocationPin color="red" />
                </p>
                <p>{currentEvent.location}</p>
              </div>
              {user && user.role === "admin" && (
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <button
                    onClick={(e) => handleEdit(currentEvent, e)}
                    style={{
                      backgroundColor: "#ffc107",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => handleDeleteEvent(currentEvent._id, e)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      </div>

      {/* ---------------- Upcoming Events ---------------- */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "3rem" }}
      >
        <h2 style={{ marginLeft: 0 }}>Upcoming Events</h2>
        <FilterBar
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          clearFilters={clearFilters}
          upcomingEvents={upcomingEvents}
        />
      </div>

      <div className="event-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt, id) => (
            <div
              className="home-1"
              key={id}
              onClick={() => handleChange(evt)}
              style={{ cursor: "pointer" }}
            >
              <div className="img-child">
                <img src={evt.eventImage} alt={evt.eventName} />
              </div>
              <h2>{evt.eventName}</h2>
              <div className="time">
                <p>
                  <FcClock />
                </p>
                <p>
                  {new Date(evt.date).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {evt.time} onwards
                </p>
              </div>
              <div className="loc">
                <p>
                  <SlLocationPin color="red" />
                </p>
                <p>{evt.location}</p>
              </div>
              {user && user.role === "admin" && (
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <button
                    onClick={(e) => handleEdit(currentEvent, e)}
                    style={{
                      backgroundColor: "#ffc107",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => handleDeleteEvent(currentEvent._id, e)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No upcoming events match your filters.</p>
        )}
      </div>
    </div>
  );
}

export default Home;

import "./View.css"
import { FcCalendar } from 'react-icons/fc'
import { SlLocationPin } from 'react-icons/sl'
import { FaArrowLeft, FaArrowRightLong, FaAsterisk, FaBolt, FaCampground, FaCloud, FaGlobe, FaStar, FaUserShield, FaWheelchairMove } from "react-icons/fa6"
import { LuSquareParking, LuToilet } from "react-icons/lu"
import { GiForkKnifeSpoon } from "react-icons/gi"
import {  FaCoffee, FaMagic} from "react-icons/fa"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { EventContext } from "../Context/EventContext"
import { UserContext } from "../Context/AuthContext"



function View() {
  const { event } = useContext(EventContext);

  const navigate = useNavigate()
  const handleBack = () => {
    navigate("/")
  }
  const handleTicket = () => {
     
    navigate("/ticket")
      
  }
  return (
    <div className="view-head">
      <div className="btn-back">
        <button className="btn-3" onClick={handleBack}><FaArrowLeft /> </button>
      </div>
      <div className="view-1">
        <div className='img-child2'>
          <img src={event.eventImage} />
        </div>
        <div className="btn-ticket">
          <button className="btn-2" onClick={handleTicket}><FaArrowRightLong color="white" /> Get Ticket</button>
        </div>
        <div className="holi-1">

          <h1>{event.eventName}</h1>
          <div className='time'><p>< FcCalendar /></p><p>{new Date(event.date).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}{" "}
            onwards</p></div>
          <div className='loc'><p><SlLocationPin color="red" /></p><p>{event.location}</p></div>
        </div>
        <div className="holi-2">

          <h1>Event Information</h1>
          <section className="evt-sec">
            <p>{event.eventInformation}</p>
            <section>
              <h3>🎶 What's Waiting for You?</h3>
              <ul>
                {event?.newFeatures?.map((feature, index) => {
                  return (
                    <li key={index}>{feature}</li>
                  )
                })}
              </ul>
            </section>
            <section>
              <h3> 🎁 Special for Everyone: {event.specialFor} </h3>
              <ul>
                {event.specialFeatures?.map((feature, index) => {
                  return (
                    <li key={index}>{feature}</li>
                  )
                })}
              </ul>
            </section>
          </section>
        </div>
        <div className="holi-3">
          <h3>Event Comforts & Features</h3>
          <p>About the event's comforts and features</p>
          <div className="evt-fac">
            <div className="evt-fac1">
              <p className="icons"><LuSquareParking /></p>
              <p className="evt-fac3">Parking Available (FCFS)</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><LuToilet /></p>
              <p className="evt-fac3">WashRoom</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><GiForkKnifeSpoon /></p>
              <p className="evt-fac3">Food</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaWheelchairMove /></p>
              <p className="evt-fac3">Differently-abled friendly</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaUserShield /></p>
              <p className="evt-fac3">All safety measures enabled</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaCoffee /></p>
              <p className="evt-fac3">Refreshments</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaAsterisk /></p>
              <p className="evt-fac3">Mandatory Check-In</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaBolt /></p>
              <p className="evt-fac3">Fast Check-In</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaGlobe /></p>
              <p className="evt-fac3">Social Mixers</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaMagic /></p>
              <p className="evt-fac3">Suitable for all ages</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaCloud /></p>
              <p className="evt-fac3">Outdoor Event</p>
            </div>
            <div className="evt-fac1">
              <p className="icons"><FaCampground /></p>
              <p className="evt-fac3">Family-Friendly</p>
            </div>
          </div>
        </div>
        <div>

        </div>
        <div className="holi-4">
          <h3>Event Location</h3>
          <div className="evt-loc">
            <div>
              <p>Venue : {event.venue}</p>
              <p>City : {event.location}</p>

            </div>
          </div>
        </div>
        <div className="holi-6">
          <h3>Cancellation & Refunds</h3>
          <div className="cncl-1">
            <h3>Organizer-Managed Cancellations</h3>
            <p>No refunds are applicable on purchased tickets, even in the case of event rescheduling.</p>
          </div>
          <div className="cncl-2">
            <h3>No Refund for Missed Events</h3>
            <p>Refunds will not be issued for missed events, late arrivals, or change of plans.
              We recommend double-checking event details before booking.</p>
          </div>
        </div>
      </div>
    </div>


  )
}


export default View

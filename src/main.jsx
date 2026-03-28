import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './users/Context/AuthContext.jsx';
import { EventProvider } from './users/Context/EventContext.jsx';
import { TicketProvider } from './users/Context/TicketContext.jsx';
createRoot(document.getElementById('root')).render(
   
    <StrictMode>
    <EventProvider>
      <UserProvider>
        <TicketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </TicketProvider>
      </UserProvider>
    </EventProvider>
  </StrictMode>
  
)

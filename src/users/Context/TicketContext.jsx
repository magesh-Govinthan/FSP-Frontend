import { createContext, useReducer } from "react";

const ACTION = {
  SET_TICKET_DETAILS: "SET_TICKET_DETAILS",
};

const initState = {
  ticket: {},
};
const TicketReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTION.SET_TICKET_DETAILS:
      return { ...state, ...payload };
    default:
      throw new Error(`unhandle type in cart reducer ${type}`);
  }
};

export const TicketContext = createContext({
 ticket: {},
});

export const TicketProvider = ({ children }) => {
  const [{ticket}, dispatch] = useReducer(TicketReducer, initState);
  const updateTicketDetails = (ticket) => {
    const payload = {
      ticket,
    };
    dispatch({ type: "SET_TICKET_DETAILS", payload });
  };

  const value = {
    ticket,
    updateTicketDetails,
  };
  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
};

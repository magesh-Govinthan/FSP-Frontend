import { createContext, useReducer } from "react";

const ACTION = {
  SET_EVENT_DETAILS: "SET_EVENT_DETAILS",
  SET_EVENT_IDS: "SET_EVENT_IDS",
};

const initState = {
  event: {},
};
const EventReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTION.SET_EVENT_DETAILS:
      return { ...state, ...payload };
      case ACTION.SET_EVENT_IDS:
        return { ...state, ...payload };
    default:
      throw new Error(`unhandle type in cart reducer ${type}`);
  }
};

export const EventContext = createContext({
 event: {},
 eventIds: [],
});

export const EventProvider = ({ children }) => {
  const [{event, eventIds}, dispatch] = useReducer(EventReducer, initState);
  const updateEventDetails = (event) => {
    const payload = {
      event,
    };
    dispatch({ type: "SET_EVENT_DETAILS", payload });
  };
  
   const updateEventIds = (eventIds) => {
    const payload = {
      eventIds,
    };
    dispatch({ type: "SET_EVENT_DETAILS", payload });
  };

  const value = {
    event,
    eventIds,
    updateEventDetails,
    updateEventIds,
  };
  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};

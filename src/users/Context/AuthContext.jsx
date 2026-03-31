import { createContext, useEffect, useReducer } from "react";

const ACTION = {
  SET_USER_DETAILS: "SET_USER_DETAILS",
};

const initState = {
  user: {},
};
const userReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTION.SET_USER_DETAILS:
      return { ...state, ...payload };
    default:
      throw new Error(`unhandle type in cart reducer ${type}`);
  }
};

export const UserContext = createContext({
 user: {},
});

export const UserProvider = ({ children }) => {
  const [{user}, dispatch] = useReducer(userReducer, initState);
  useEffect(()=>{
    const userData=sessionStorage.getItem("user")
    if(userData){
          dispatch({
            type: "SET_USER_DETAILS",
            payload: { user: JSON.parse(userData) },
          });
    }
  })
  const updateUserDetails = (user) => {
    console.log(user);
    const payload = {
      user,
    };
    dispatch({ type: "SET_USER_DETAILS", payload });
  };

  const value = {
    user,
    updateUserDetails,
  };
  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

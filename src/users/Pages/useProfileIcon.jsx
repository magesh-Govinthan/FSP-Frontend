import React from "react";
import { useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const navigate = useNavigate();

  return (
   
        <div>
          <img
            src="https://lh3.googleusercontent.com/a/default-user=s40-c"
            alt="profile"
            onClick={() => navigate("/profile")}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              cursor: "pointer",
              objectFit: "cover",
            }}
          />
        </div>
    
  );
};

export default AppNavbar;
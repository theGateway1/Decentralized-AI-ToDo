import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../Services/Auth/auth-service";

export const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = (props) => {
  const [userAuthToken, setUserAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const contextValue = {
    userAuthToken,
    setUserAuthToken,
    isAuthenticated,
    setIsAuthenticated,
  };

  // Automatically login the user, and redirect to the path user tried to access
  useEffect(() => {
    let userAuthToken = localStorage.getItem("userAuthToken");
    if (userAuthToken) {
      setUserAuthToken(userAuthToken);
      setAuthToken(userAuthToken);
      setIsAuthenticated(true);
      navigate(props.path);
    }
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

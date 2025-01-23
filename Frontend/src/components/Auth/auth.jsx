import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { connectWallet } from "../../shared/Services/Auth/auth-service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../shared/contexts/auth-context";
import Spinner from "../../shared/components/Loader/loader";

const Auth = (props) => {
  const [loginDisabled, setLoginDisabled] = useState(false);
  const { setUserAuthToken, setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Auth context will try to login user automatically, if that succeeds, redirect user to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  });

  const loginButtonClicked = async () => {
    setLoginDisabled(true);
    connectWallet()
      .then((userAuthToken) => {
        setLoginDisabled(false);
        setUserAuthToken(userAuthToken);
        setIsAuthenticated(true);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setLoginDisabled(false);
        toast.error("Error Occured");
      });
  };

  return (
    <>
      <div className={"mainContainer"}>
        <div className={"titleContainer"}>
          <div className=" heading">Modern AI ToDo</div>
        </div>
        <br />

        <button
          type="button"
          className={`login-btn ${loginDisabled ? "login-btn__disabled" : ""}`}
          disabled={loginDisabled}
          onClick={loginButtonClicked}
        >
          Connect Wallet
        </button>
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          limit={1}
          theme="dark"
        />
        <Spinner showSpinner={loginDisabled} />
      </div>
    </>
  );
};

export default Auth;

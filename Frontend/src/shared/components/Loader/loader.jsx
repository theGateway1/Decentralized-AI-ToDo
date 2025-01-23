import FadeLoader from "react-spinners/FadeLoader";
import "./loader.css";

const override = {
  display: "block",
  position: "absolute",
  top: "45%",
  left: "50%",
};

const Spinner = ({ showSpinner }) => {
  return showSpinner ? (
    <div>
      <div className="loading-overlay"></div>
      <FadeLoader
        color={"#0073ff"}
        loading={showSpinner}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  ) : (
    <></>
  );
};

export default Spinner;

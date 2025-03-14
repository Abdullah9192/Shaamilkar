import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLoader } from "react-icons/lu";
import { BASE_URL } from "../../BASE_URL";
import axios from "axios";
import { toast } from "react-toastify";

const OTPModal = ({ show, handleClose }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const [otpError, setOtpError] = useState("");

  const navigate = useNavigate();
  const handleChange = (value, index) => {
    if (!isNaN(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async () => {
    if (otp.includes("")) {
      setOtpError("Please fill OTP fields.");
      return;
    }
    setOtpError("");
    const otpCode = otp.join("");
    // console.log("Entered OTP:", otpCode);
    const payload = {
      email: JSON.parse(localStorage.getItem("DatabeforeOTP")).email,
      otp: otpCode,
    };
    // console.log("payload before", payload);
    const response = await axios.post(`${BASE_URL}/auth/registration`, payload);
    console.log("response", response);
    if (response.data.status === "success") {
      navigate("/login");
      toast.success("Email verified successfully");
    } else if (response.data.status === "error") {
      toast.error(response.data.message);
    } else {
      toast.error("Error verifying otp");
    }
  };

  return (
    <>
      <div
        className={`modal fade ${show ? "show" : ""}`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: show ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
        }}
        tabIndex="-1"
        aria-labelledby="otpModalLabel"
        aria-hidden={!show}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header shadow-sm">
              <h5 className="modal-title" id="otpModalLabel">
                Email-based OTP
              </h5>
            </div>
            <div className="modal-body p-0">
              <p className="bg-light p-2 mt-3 px-3">
                Enter the 6-digit OTP sent via SMS to your email or phone.
              </p>
              <div className="d-flex justify-content-center gap-3 mb-2">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="otp-box text-center form-control"
                    style={{ width: "40px", fontSize: "20px" }}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-danger text-center">{otpError}</p>
              )}
              <div className="d-flex justify-content-around">
                <span className="text-center">Didn't receive the OTP?</span>
                <Link to="#" className="fw-bold text-dark text-decoration-none">
                  <LuLoader color="#000" /> Resend OTP
                </Link>
              </div>
              <div
                style={{
                  height: ".1px",
                  marginTop: "8px",
                  width: "100%",
                  backgroundColor: "grey",
                }}
              />
              <div className="m-3 text-center">
                <button className="btn btn-success w-75" onClick={handleSubmit}>
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPModal;

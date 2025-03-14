import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import loginimg from "../../assets/authimg.png";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BASE_URL } from "../../BASE_URL";
import OTPModal from "../../Components/OtpModal/OTPModal";

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    countryCode: "+92",
    password: "",
    confirmPassword: "",
    cnic: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required."),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required."),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits.")
      .required("Phone number  required."),
    countryCode: Yup.string().required("Country code."),
    password: Yup.string()
      .min(8, "Password at least 8 characters.")
      .required("Password required."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
      .required("Confirm password."),
    cnic: Yup.string()
      .required("CNIC is required")
      .matches(/^\d+$/, "Only numeric values")
      .required("CNIC is required."),
  });
  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => {
    const payload = {
      name: values.name,
      email: values.email,
      phoneNumber: `${values.countryCode}${values.phoneNumber}`,
      cnic: values.cnic,
      role: "user",
      password: values.password,
      image: "fake-url",
    };

    // console.log(payload);

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/registration`,
        payload
      );
      console.log(response);
      if (response.data.status === "error") {
        if (response.data.statusCode === 400) {
          if (response.data.message.includes("CNIC")) {
            setFieldError("cnic", response.data.message);
          } else if (response.data.message.includes("Email")) {
            setFieldError("email", response.data.message);
          } else if (response.data.message.includes("Phone")) {
            setFieldError("phoneNumber", response.data.message);
          } else {
            setApiError(response.data.message);
          }
        } else if (response.data.statusCode === 409) {
          setApiError(response.data.message);
        }
      } else if (response.data.status === "success") {
        setApiError("");
        toast.success("OTP Email verification set successfully.");
        resetForm();
        localStorage.setItem("DatabeforeOTP", JSON.stringify(payload));
        setShowOTPModal(true);
        // navigate("");
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
  };

  return (
    <div className="loginbg">
      <div className="container p-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 py-5">
            <h2 className=" text-center">
              Create Account <span className="fw-bold">on Shaamilkar</span>
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="d-flex flex-column gap-2">
                  <div>
                    <p className="form-label text-start" htmlFor="name">
                      Full Name
                    </p>
                    <Field
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger text-start"
                    />
                  </div>
                  <div>
                    <p className="form-label text-start" htmlFor="email">
                      Email Address
                    </p>
                    <Field
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger text-start"
                    />
                    {apiError && (
                      <span className="text-danger">{apiError}</span>
                    )}
                  </div>
                  <div>
                    <p className="form-label text-start" htmlFor="cnic">
                      CNIC
                    </p>
                    <Field
                      type="text"
                      className="form-control"
                      name="cnic"
                      placeholder="CNIC (xxxxx-xxxxxxx-x)"
                    />
                    <ErrorMessage
                      name="cnic"
                      component="div"
                      className="text-danger text-start"
                    />
                    {apiError && (
                      <span className="text-danger">{apiError}</span>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <p
                        className="form-label text-start"
                        htmlFor="countryCode"
                      >
                        Code
                      </p>
                      <Field
                        as="select"
                        className="form-control col-md-4"
                        name="countryCode"
                      >
                        <option value="+92">+92</option>
                      </Field>
                      <ErrorMessage
                        name="countryCode"
                        component="div"
                        className="text-danger text-start"
                      />
                    </div>
                    <div className="col-md-9">
                      <p
                        className="form-label text-start"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </p>
                      <Field
                        type="number"
                        className="form-control"
                        name="phoneNumber"
                        placeholder="3xxxxxxxxx"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-danger text-start"
                      />
                      {apiError && (
                        <span className="text-danger">{apiError}</span>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="form-label text-start" htmlFor="password">
                        Password
                      </p>
                      <Field
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        className="form-control"
                        placeholder="Enter  password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger text-start"
                      />
                    </div>
                    <div className="col-md-6">
                      <p
                        className="form-label text-start"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password
                      </p>
                      <Field
                        type={passwordVisible ? "text" : "password"}
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm password"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-danger text-start"
                      />
                    </div>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="passwordVisibility"
                      onChange={() => setPasswordVisible(!passwordVisible)}
                    />
                    <label
                      className="form-check-label text-start"
                      htmlFor="passwordVisibility"
                      style={{ cursor: "pointer" }}
                    >
                      Show Password
                    </label>
                  </div>
                  <div className="d-flex justify-content-center mb-3">
                    <button
                      type="submit"
                      className="btn button text-white fw-bold w-75"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Register"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="mt-2 text-center">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none fw-bold"
                  style={{ color: "var(--btncolor)" }}
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
          <div className="col-md-6 px-5">
            <div className="d-flex justify-content-center align-items-center">
              <img
                src={loginimg}
                alt="Person on Scooter"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
      <OTPModal show={showOTPModal} handleClose={handleCloseOTPModal} />
    </div>
  );
};
export default Register;

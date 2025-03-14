import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import loginimg from "../../assets/authimg.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BASE_URL } from "../../BASE_URL";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [identifierType, setIdentifierType] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const product = queryParams.get("product_id");
  const variant = queryParams.get("variant_id");
  const plan = queryParams.get("plan");

  useEffect(() => {
    if (product) {
      localStorage.setItem("product_id", product);
      console.log(
        "Stored Product in localStorage:",
        localStorage.getItem("product_id")
      );
    }
    if (variant) {
      localStorage.setItem("variant_id", variant);
      console.log(
        "Stored Variant in localStorage:",
        localStorage.getItem("variant_id")
      );
    }
    if (plan) {
      localStorage.setItem("plan", plan);
      console.log("Stored Plan in localStorage:", localStorage.getItem("plan"));
    }
  }, [product, variant, plan]);

  const initialValues = {
    identifier: "",
    password: "",
  };

  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required("Email, phone number, or CNIC is required.")
      .test(
        "validIdentifier",
        "Please enter a valid email, phone number, or CNIC.",
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^\+\d{1,3}\d{8,12}$/;
          const cnicRegex = /^\d{13}$/;
          if (emailRegex.test(value)) {
            setIdentifierType("email");
          } else if (phoneRegex.test(value)) {
            setIdentifierType("phoneNumber");
          } else if (cnicRegex.test(value)) {
            setIdentifierType("cnic");
          } else {
            setIdentifierType("");
          }
          return (
            emailRegex.test(value) ||
            phoneRegex.test(value) ||
            cnicRegex.test(value)
          );
        }
      ),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long.")
      .required("Password is required."),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values, identifierType);
    if (identifierType === "email") {
      values.email = values.identifier;
    } else if (identifierType === "phoneNumber") {
      values.phoneNumber = values.identifier;
    } else if (identifierType === "cnic") {
      values.cnic = values.identifier;
    } else {
      toast.error("Please enter a valid email, phone number, or CNIC.");
      return false;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, values);
      console.log(response);
      if (
        response.data.status === "success" &&
        response.data.user.role === "user"
      ) {
        setLoginError("");

        localStorage.setItem("loggedIn", true);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");

        navigate("/");
      } else if (response.data.status === "error") {
        toast.error("Error logging In");
        setLoginError(
          response.data.message || "Login failed. Please try again."
        );
      } else if (response.data.user.role !== "user") {
        toast.error("INvalidnCEdEMRAJIANL user");
      } else {
        toast.error("Internal Server Error");
      }
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };
  return (
    <div className="loginbg ">
      <div className="container">
        <div className="row">
          <div className="col-md-6 py-5">
            <h2 className="mb-4 text-center">
              Sign In to <span className="fw-bold">Shaamilkar</span>
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="d-flex flex-column gap-3">
                  <div>
                    <label htmlFor="identifier" className="form-label">
                      Email / Phone Number / CNIC
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      name="identifier"
                      placeholder="Enter your email, phone, or CNIC"
                    />
                    <ErrorMessage
                      name="identifier"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="position-relative">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <Field
                      type={passwordVisible ? "text" : "password"}
                      className="form-control"
                      name="password"
                      placeholder="Password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="passwordVisibility"
                      onChange={() => setPasswordVisible(!passwordVisible)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="passwordVisibility"
                      style={{ cursor: "pointer" }}
                    >
                      Show Password
                    </label>
                  </div>
                  {loginError && (
                    <div className="text-danger text-start">{loginError}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn mt-2 w-75 text-center align-self-center fw-bold"
                    style={{
                      backgroundColor: "#90C997",
                      color: "#fff",
                    }}
                  >
                    {isSubmitting ? "Logging in..." : "Log In"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="footer-links mt-3 text-center">
              <p>
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-decoration-none fw-bold"
                  style={{ color: "var(--btncolor)" }}
                >
                  Sign Up
                </Link>
              </p>
              <Link
                to="/forget-password"
                className="text-decoration-none fw-bold m-0"
                style={{ color: "var(--btncolor)" }}
              >
                Forgot Password
              </Link>
            </div>
          </div>

          <div className=" col-md-6 p-2 d-flex justify-content-center align-items-center">
            <img
              src={loginimg}
              alt="Person on Scooter"
              className="img-fluid w-75"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

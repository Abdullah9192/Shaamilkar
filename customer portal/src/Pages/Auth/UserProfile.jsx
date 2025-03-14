import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BASE_URL } from "../../BASE_URL";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    cnic: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required."),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required."),
    phoneNumber: Yup.string()
      .matches(/^\+\d{1,3}\d{8,12}$/, "Phone number must be 10 digits.")
      .required("Phone number required."),
    cnic: Yup.string()
      .matches(/^[0-9]{13}$/, "CNIC should be exactly 13 digits.")
      .required("CNIC is required."),
  });

  const handleSubmit = (values) => {
    const accessToken = localStorage.getItem("accessToken");
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    axios
      .patch(`${BASE_URL}/user/updateuser/${userData.id}`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log(res)
        setLoading(false);
        setSuccessMessage("Profile updated successfully!");
        if (res.data.status === "success") {
          localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
          toast.success(res.data.message);
        } else if (res.data.status === "error") {
          toast.error(res.data.message);
        } else {
          toast.error("Error Updating User");
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage("An error occurred. Please try again.");
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          width: "100%",
          flex: 1,
          alignContent: "center",
        }}
        className="loginbg"
      >
        <div className="container">
          <div className="row justify-content-center align-items-center pt-2 pt-lg-0">
            <div className="col-md-6 ">
              <div className="profile-img-container text-center">
                <FaUserCircle
                  size={100}
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    justifyContent: "center",
                    alignSelf: "center",
                    color: "var(--btncolor)",
                  }}
                />
                <h3 className="mt-3">{userData?.name}</h3>

                <div>
                  <button
                    type="button"
                    className="btn  w-75 mb-2 shadow-none button"
                    style={{ backgroundColor: "var(--btncolor)" }}
                    onClick={() => {
                      setShowPersonalInfo(true);
                      setShowPasswordInfo(false);
                    }}
                  >
                    Personal Info
                  </button>
                  <button
                    type="button"
                    className="btn w-75 shadow-none button"
                    style={{ backgroundColor: "var(--btncolor)" }}
                    onClick={() => {
                      setShowPersonalInfo(false);
                      setShowPasswordInfo(true);
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-sm-3 mt-3 ">
              <h2 className="mb-4 text-center">Edit Your Profile</h2>
              {showPersonalInfo && (
                <Formik
                  initialValues={
                    userData && userData.id !== "" ? userData : initialValues
                  }
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  <Form className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label text-start" htmlFor="name">
                        Full Name
                      </label>
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
                      <label className="form-label text-start" htmlFor="email">
                        Email Address
                      </label>
                      <Field
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter your email"
                        disabled
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger text-start"
                      />
                    </div>
                    <div>
                      <label className="form-label text-start" htmlFor="cnic">
                        CNIC No.
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        name="cnic"
                        placeholder="Enter your CNIC"
                        disabled
                      />
                      <ErrorMessage
                        name="cnic"
                        component="div"
                        className="text-danger text-start"
                      />
                    </div>
                    <div>
                      <label
                        className="form-label text-start"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        name="phoneNumber"
                        placeholder="Enter your phone number"
                        disabled
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-danger text-start"
                      />
                    </div>
                    <div
                      style={{
                        backgroundColor: "var(--btncolor)",
                        alignSelf: "center",
                      }}
                      className="rounded my-3 w-75"
                    >
                      <button
                        as="submit"
                        className="btn w-100 button shadow-none"
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </button>
                    </div>
                    {errorMessage && (
                      <div className="text-danger text-center">
                        {errorMessage}
                      </div>
                    )}
                    {successMessage && (
                      <div className="text-success text-center">
                        {successMessage}
                      </div>
                    )}
                  </Form>
                </Formik>
              )}
              {showPasswordInfo && (
                <Formik
                  initialValues={{ password: "", confirmPassword: "" }}
                  onSubmit={handleSubmit}
                  validationSchema={Yup.object({
                    password: Yup.string()
                      .min(8, "Password must be at least 8 characters")
                      .required("Password is required"),
                    confirmPassword: Yup.string()
                      .oneOf(
                        [Yup.ref("password"), null],
                        "Passwords must match"
                      )
                      .required("Confirm Password is required"),
                  })}
                >
                  <Form className="d-flex flex-column gap-3">
                    <div>
                      <label
                        className="form-label text-start"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <Field
                        type={passwordVisible ? "text" : "password"}
                        className="form-control"
                        name="password"
                        placeholder="Enter your password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger text-start"
                      />
                    </div>
                    <div>
                      <label
                        className="form-label text-start"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password
                      </label>
                      <Field
                        type={passwordVisible ? "text" : "password"}
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-danger text-start"
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
                        className="form-check-label text-start"
                        htmlFor="passwordVisibility"
                      >
                        Show Password
                      </label>
                    </div>
                    <div
                      style={{
                        backgroundColor: "var(--btncolor)",
                        alignSelf: "center",
                      }}
                      className="rounded my-3 w-75 "
                    >
                      <button
                        as="submit"
                        className="btn w-100 button shadow-none"
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </button>
                    </div>
                    {errorMessage && (
                      <div className="text-danger text-center">
                        {errorMessage}
                      </div>
                    )}
                    {successMessage && (
                      <div className="text-success text-center">
                        {successMessage}
                      </div>
                    )}
                  </Form>
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;

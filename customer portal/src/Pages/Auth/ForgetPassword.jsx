import React, { useState } from "react";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import forgetPasswordImg from "../../assets/authimg.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { BASE_URL } from "../../BASE_URL";
import OTPForgetPasswordModal from "../../Components/OtpModal/OTPForgetpasswordModal";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const initialValues = {
    email: "",
    countryCode: "+92",
    phone: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address.")
      .required("Email is required."),
    // phone: Yup.string()
    //   .matches(
    //     /^[0-9]{10,15}$/,
    //     "Phone number must be between 10 and 15 digits."
    //   )
    //   .required("Phone number is required."),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmittedData(values);
    console.log(values);
    const payload = {
      email: values.email,
    };
    const response = await axios.post(
      `${BASE_URL}/auth/requestOtp`,
      payload
    );
    console.log(response);
    if (response.data.status === "success") {
      toast.success("Email sent successfully");
      setOtpModalVisible(true);
      localStorage.setItem("PSEmail", values.email);
    } else if (response.data.status === "error") {
      toast.error(response.data.message);
    } else {
      toast.error("Error sending email. Please try again later");
    }
    setSubmitting(false);
  };

  return (
    <div className="loginbg">
      <div className="container p-5">
        <div className="row  justifiy-content-center align-items-center">
          <div className="col-md-6 p-5">
            <h2 className="mb-4">
              Reset Password <span className="fw-bold">for Shaamilkar</span>
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="d-flex flex-column">
                  <div className="">
                    <p htmlFor="email" className="form-label text-start">
                      Email
                    </p>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger text-start"
                    />
                  </div>
                  <span className="my-4 fw-bold text-center">OR</span>
                  <div className="">
                    <p htmlFor="phone" className="form-label  text-start">
                      Phone Number
                    </p>
                    <div className="d-flex m-0 p-0">
                      <Field
                        as="select"
                        name="countryCode"
                        className="form-select me-2"
                        style={{ width: "22%" }}
                      >
                        <option value="+92">+92</option>
                      </Field>
                      <Field
                        style={{ width: "78%" }}
                        type="text"
                        name="phone"
                        className="form-control"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="d-flex justify-content-center mt-3">
                    <button
                      type="submit"
                      className={`btn fw-bold button text-white fw-bold w-75 mt-2 ${
                        isSubmitting ? "disabled" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="footer-links mt-3 text-center">
              <p>
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none fw-bold"
                  style={{ color: "var(--btncolor)" }}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="col-md-6 p-2 d-flex justify-content-center align-items-center">
            <img
              src={forgetPasswordImg}
              alt="Forget Password"
              className="img-fluid w-75"
            />
          </div>
        </div>

        <OTPForgetPasswordModal
          show={otpModalVisible}
          handleClose={() => setOtpModalVisible(false)}
          submittedFrom={"forget"}
        />
      </div>
    </div>
  );
};

export default ForgetPassword;

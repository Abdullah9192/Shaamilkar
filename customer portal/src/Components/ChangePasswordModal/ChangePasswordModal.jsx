import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "../../BASE_URL";

const ChangePasswordModal = ({ show, handleClose }) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values, "values");

    const payload = {
      email: localStorage.getItem("PSEmail"),
      newPassword: values.newPassword,
    };
    console.log(payload);

    const response = await axios.post(
      `${BASE_URL}/auth/resetPassword`,
      payload
    );
    console.log(response);
    if (response.data.status === "success") {
      toast.success("Password changed successfully");
      navigate("/login");
      handleClose();
    } else if (response.data.status === "error") {
      toast.error(response.data.message || "Error changing password");
    } else {
      toast.error(response.data.message);
    }

    setSubmitting(false);
  };

  return (
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
              Change Password
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="newPassword">New Password</label>
                    <Field
                      type="password"
                      name="newPassword"
                      className="form-control"
                      placeholder="Enter new password"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm new password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-success w-75"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Change Password" : "Change Password"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

import React from "react";
import { FaCheck } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AcceptModal = ({ show, onHide }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    onHide();
  };
  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal ">
      <Modal.Body className="text-center   ">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            position: "absolute",
            top: "-50px",
            left: "calc(50% - 40px)",
            border: "3px solid #a0e75a",
            width: "80px",
            height: "80px",
            backgroundColor: "#a0e75a",
            borderRadius: "50%",
          }}
        >
          <FaCheck style={{ fontSize: "40px", color: "white" }} />
        </div>
        
        <div className="my-3 pt-2">
          <h3 className="fw-bold" style={{}}>
            Application Submitted Successfully!
          </h3>
          <div className="text-muted  ">
            <h5>Your application is being processed.</h5>
          </div>
        </div>
        <Button
          variant="success"
          className="w-50 border-3"
          onClick={() => {
            onHide();
            return navigate("/application-history");
          }}
        >
          Got It Thanks!
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AcceptModal;

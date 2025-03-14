import React from "react";
import Modal from "react-bootstrap/Modal";

const Disclaimer = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      centered
      style={{
        borderRadius: "20px",
        backdropFilter: "blur(5px)",
      }}
      className="custom-modal text-center "
    >
      <Modal.Body style={{ borderRadius: "28px" }} className="glow">
        <div className="d-flex mb-3">
          <h1 className="text-center text-danger w-100">Disclaimer</h1>
          <button className="btn btn-close" onClick={props.onHide}></button>
        </div>
        <p className="text-center">
          Instalment plans are subject to approval based on submitted
          information and verification. Interest rates and payment terms may
          vary depending on the selected plan and product category. A minimum
          down payment of 30% is required, with higher down payments reducing
          total interest. Late payments may incur penalties and affect future
          credit eligibility. All calculations provided are estimates and may
          vary upon final approval. By proceeding, you agree to the terms and
          conditions outlined.
        </p>
      </Modal.Body>
    </Modal>
  );
};
export default Disclaimer;

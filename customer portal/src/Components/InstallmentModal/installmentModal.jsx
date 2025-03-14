import React from "react";
import { Modal } from "react-bootstrap";
import { formatTimestamp } from "../../Utils/Utils";

const InstallmentModal = ({ isOpen, onClose, installments, lastPaidDate }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered className="px-2 ">
      <Modal.Header closeButton className="py-2">
        <Modal.Title className="fs-10">Installment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2 ">
        <p className="mb-1 text-center">
          <strong>Total Installments:</strong>{" "}
          {installments?.length - 1 || "N/A"} Months
        </p>
        <table className="table table-hover text-center">
          <thead>
            <th>Sr#</th>
            <th>Due Date</th>
            <th>Amount</th>
          </thead>
          {installments && installments.length > 0 ? (
            <tbody>
              {installments.map((installment, idx) => (
                <tr key={idx} className="mb-2">
                  <td className="text-center">{installment.installmentNo}</td>
                  <td className="text-center">
                    {formatTimestamp(installment.dueDate)}
                  </td>
                  <td className="text-center">
                    {Number(installment.amount.toFixed(0)).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="3" className="text-center">
                  No installments available.
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <p className="mt-2 text-center">
          Last Installment Paid on: <strong>{lastPaidDate}</strong>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default InstallmentModal;

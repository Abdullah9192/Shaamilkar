import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const DataModal = ({ item }) => {
  const [show, setShow] = useState(false)

  // Functions to open and close the modal
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  return (
    <>
      <Button
        className="btn btn-secondary py-0 rounded-2 text-light"
        onClick={handleShow}
      >
        View Details
      </Button>

      <Modal show={show} centered onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Details for {item.firstName} {item.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>City:</strong> {item.city}
            </li>
            <li className="list-group-item">
              <strong>CNIC:</strong> {item.cnic}
            </li>
            <li className="list-group-item">
              <strong>Date of Birth:</strong> {item.dateOfBirth}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {item.email}
            </li>
            <li className="list-group-item">
              <strong>Mobile Number:</strong> {item.mobileNumber}
            </li>
            <li className="list-group-item">
              <strong>Occupation:</strong> {item.occupation}
            </li>
            <li className="list-group-item">
              <strong>Organization Address:</strong> {item.organizationAddress}
            </li>
            <li className="list-group-item">
              <strong>Organization Name:</strong> {item.organizationName}
            </li>
            <li className="list-group-item">
              <strong>Status:</strong> {item.status}
            </li>
            <li className="list-group-item">
              <strong>Working Since:</strong> {item.workingSince}
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DataModal

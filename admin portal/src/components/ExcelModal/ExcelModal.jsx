import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { saveAs } from 'file-saver'

const ExcelModal = ({ show, handleClose, base64Data }) => {
  const handleDownload = () => {
    if (!base64Data) return

    // Decode Base64 string and create Blob
    const byteCharacters = atob(base64Data.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i))
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    // Save file using FileSaver
    saveAs(blob, 'data.xlsx')
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Excel File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Click the button below to download or view the Excel file.</p>
        <Button variant="primary" onClick={handleDownload}>
          Download Excel
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default ExcelModal

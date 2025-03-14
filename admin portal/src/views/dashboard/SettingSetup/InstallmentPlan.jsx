import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'

const InstallmentPlan = () => {
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [visibleRows, setVisibleRows] = useState({})
  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const initialValues = {
    // productId: '',
    planDuration: '',
    planPercentage: '',
    status: ''
  }

  const validationSchema = Yup.object({
    // productId: Yup.string().required('Product ID is required'),
    planDuration: Yup.string().required('Company Name is required'),
    planPercentage: Yup.string().required('Phone Number is required')
    // status: Yup.string().required('Status is required'),
  })

  const handleSubmit = (values, { resetForm }) => {
    //console.log(values)
    if (editIndex !== null) {
      // Update the existing entry
      const updatedData = [...data]
      updatedData[editIndex] = values
      setData(updatedData)
      setEditIndex(null)
    } else {
      // Add new entry
      setData([...data, values])
    }
    resetForm()
    setShowModal(false)
  }

  const handleAddNew = () => {
    setEditIndex(null)
    setShowModal(true)
  }

  const handleEdit = (index) => {
    setEditIndex(index)
    setShowModal(true)
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Installment Plan Setup</h4>
        <Button className="btn btn-success" onClick={handleAddNew}>
          Add Installment Plan
        </Button>
      </div>

      {/* Form Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null
              ? 'Edit Installment Plan'
              : 'Add Installment Plan'}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={editIndex !== null ? data[editIndex] : initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ resetForm }) => (
            <Form>
              <Modal.Body>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="planDuration">Plan Duration</label>
                    <Field
                      type="text"
                      id="planDuration"
                      name="planDuration"
                      className="form-control"
                      placeholder="Plan Durantion"
                    />
                    <ErrorMessage
                      name="planDuration"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="planPercentage">Plan Percentage</label>
                    <Field
                      id="planPercentage"
                      type="number"
                      name="planPercentage"
                      className="form-control"
                      placeholder="Plan Percentage"
                    />
                    <ErrorMessage
                      name="planPercentage"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-8">
                    <label htmlFor="status">Status</label>
                    <span className="d-flex gap-2">
                      <Field
                        type="checkbox"
                        id="status"
                        name="status"
                        className="form-check"
                      />
                      <label htmlFor="status">Active</label>
                    </span>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    resetForm()
                    setShowModal(false)
                  }}
                >
                  Cancel
                </Button>
                <Button className="btn btn-success" type="submit">
                  {editIndex !== null ? 'Update' : 'Activate'}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Table */}
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell>Plan ID</CTableHeaderCell>
            <CTableHeaderCell>Plan Duration</CTableHeaderCell>
            <CTableHeaderCell>Plan Percentage</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <CTableRow>
                <CTableDataCell>{index}</CTableDataCell>
                <CTableDataCell>{row.planDuration}</CTableDataCell>
                <CTableDataCell>{row.planPercentage}</CTableDataCell>
                <CTableDataCell>
                  {row.status ? (
                    <CBadge
                      className="py-2 rounded-pill green-bg1"
                      style={{ width: '80px' }}
                    >
                      Active
                    </CBadge>
                  ) : (
                    <CBadge
                      className=" py-2 rounded-pill red-bg1"
                      style={{ width: '80px' }}
                    >
                      Inactive
                    </CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell className="w-25">
                  <Button
                    className={`btn ${row.status ? 'btn-danger text-light' : 'btn-success'} w-100 py-0`}
                    onClick={() => {
                      // Toggle the status
                      const updatedData = [...data]
                      updatedData[index].status = !row.status
                      setData(updatedData)
                    }}
                  >
                    {row.status ? 'Set as Inactive' : 'Set as Active'}
                  </Button>
                </CTableDataCell>
              </CTableRow>
            </React.Fragment>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default InstallmentPlan

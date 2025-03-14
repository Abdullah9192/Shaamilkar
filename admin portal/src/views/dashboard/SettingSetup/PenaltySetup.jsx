import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  CBadge,
  CCollapse,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'

const PenaltySetup = () => {
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
    productCategory: '',
    penaltyPercentage: '',
    status: false
  }

  const validationSchema = Yup.object({
    productCategory: Yup.string().required('Category Name is required'),
    penaltyPercentage: Yup.string().required('Description is required')
  })

  const handleSubmit = (values, { resetForm }) => {
    if (editIndex !== null) {
      const updatedData = [...data]
      updatedData[editIndex] = values
      setData(updatedData)
      setEditIndex(null)
    } else {
      setData([...data, values])
    }
    resetForm()
    setShowModal(false)
  }

  const handleAddNew = () => {
    setEditIndex(null)
    setShowModal(true)
  }

  const toggleStatus = (index) => {
    const updatedData = [...data]
    updatedData[index].status = !updatedData[index].status
    setData(updatedData)
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Penalty Setup </h4>
        <Button className="btn btn-success" onClick={handleAddNew}>
          Add Penalty
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
            {editIndex !== null ? 'Edit Penalty' : 'Add Penalty'}
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
                    <label htmlFor="productCategory">Product Category</label>
                    <Field
                      as="select"
                      id="productCategory"
                      name="productCategory"
                      className="form-select"
                      placeholder="Product Category"
                    >
                      <option value="">Select</option>
                      {[
                        'Electronics',
                        'Auto-Mobiles',
                        'Accessories',
                        'Others'
                      ].map((item, index) => (
                        <React.Fragment key={index}>
                          <option value={item}>{item}</option>
                        </React.Fragment>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="productCategory"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="penaltyPercentage">
                      Penalty Percentage
                    </label>
                    <Field
                      id="penaltyPercentage"
                      type="number"
                      name="penaltyPercentage"
                      className="form-control"
                      placeholder="Penalty Percentage"
                    />
                    <ErrorMessage
                      name="penaltyPercentage"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="gracePeriod">Grace Period</label>
                    <Field
                      id="gracePeriod"
                      type="text"
                      name="gracePeriod"
                      className="form-control"
                      placeholder="Grace Period"
                    />
                    <ErrorMessage
                      name="gracePeriod"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
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
                  {editIndex !== null ? 'Update' : 'Save'}
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
            <CTableHeaderCell>Penalty ID</CTableHeaderCell>
            <CTableHeaderCell>Product Category</CTableHeaderCell>
            <CTableHeaderCell>Penalty Percentage</CTableHeaderCell>
            <CTableHeaderCell>Grace Period</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((row, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{index}</CTableDataCell>
              <CTableDataCell>{row.productCategory}</CTableDataCell>
              <CTableDataCell>{row.penaltyPercentage}</CTableDataCell>
              <CTableDataCell>{row.gracePeriod}</CTableDataCell>
              <CTableDataCell className="">
                {row.status ? (
                  <CBadge
                    style={{ width: '100px' }}
                    className=" green-bg1  rounded-pill  border-2 border-success"
                  >
                    Active
                  </CBadge>
                ) : (
                  <CBadge
                    style={{ width: '100px' }}
                    className=" red-bg1  rounded-pill border-2 border-danger"
                  >
                    Inactive
                  </CBadge>
                )}
              </CTableDataCell>
              <CTableDataCell className="w-25">
                <Button
                  className={
                    row.status
                      ? 'btn btn-danger text-light py-0 '
                      : 'btn btn-success py-0'
                  }
                  onClick={() => toggleStatus(index)}
                >
                  {row.status ? 'Set as Inactive' : 'Set as Active'}
                </Button>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default PenaltySetup

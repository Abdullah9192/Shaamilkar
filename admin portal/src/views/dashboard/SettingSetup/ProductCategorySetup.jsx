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
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'

const ProductCategorySetup = () => {
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
    categoryName: '',
    description: '',
    status: ''
  }

  const validationSchema = Yup.object({
    // productId: Yup.string().required('Product ID is required'),
    categoryName: Yup.string().required('Category Name is required'),
    description: Yup.string().required('Description is required')
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
        <h4>Product Category Setup</h4>
        <Button className="btn btn-success" onClick={handleAddNew}>
          Add Category
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
            {editIndex !== null ? 'Edit Product' : 'Add New Product'}
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
                  <div className="mb-3 col-md-4">
                    <label htmlFor="categoryName">Category Name</label>
                    <Field
                      type="text"
                      id="categoryName"
                      name="categoryName"
                      className="form-control"
                      placeholder="Category Name"
                    />
                    <ErrorMessage
                      name="categoryName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-8">
                    <label htmlFor="description">Description</label>
                    <Field
                      id="description"
                      as="textarea"
                      rows={1}
                      name="description"
                      className="form-control"
                      placeholder="description"
                    />
                    <ErrorMessage
                      name="description"
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
            <CTableHeaderCell>Category ID</CTableHeaderCell>
            <CTableHeaderCell>Category Name</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((row, index) => (
            <React.Fragment>
              <CTableRow key={index}>
                <CTableDataCell>{index}</CTableDataCell>
                <CTableDataCell>{row.categoryName}</CTableDataCell>
                <CTableDataCell>{row.description}</CTableDataCell>
                <CTableDataCell>
                  {row.status ? (
                    <CBadge className="w-75  rounded-pill green-bg1">
                      Active
                    </CBadge>
                  ) : (
                    <CBadge
                      color="danger"
                      className="w-75 rounded-pill red-bg1"
                    >
                      Inactive
                    </CBadge>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <Button
                    className="btn btn-secondary py-0"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
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

export default ProductCategorySetup

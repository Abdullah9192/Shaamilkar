import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import DynamicFields from '../../components/DynamicFields'

const EnterPrizes = () => {
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const initialValues = {
    // productId: '',
    companyName: '',
    funds: '',
    returnOnFunds: '',
    profits: '',
    products: ''
  }

  const validationSchema = Yup.object({
    companyName: Yup.string().required('Enterprise Name is required'),
    funds: Yup.string().required('Funds is required')
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
  const fieldConfig = [
    {
      id: 'enterpriseName',
      label: 'Enterprise Name',
      type: 'text',
      name: 'enterpriseName',
      placeholder: 'Enterprise Name',
      className: 'form-control mt-2'
    },
    {
      id: 'funds',
      label: 'Funds',
      type: 'number',
      name: 'funds',
      placeholder: 'Funds ',
      className: 'form-control mt-2'
    },
    {
      id: 'returnOnFunds',
      label: 'Return On Funds',
      type: 'number',
      name: 'returnOnFunds',
      placeholder: 'Return On Funds',
      className: 'form-control mt-2'
    },
    {
      id: 'profits',
      label: 'Profits',
      type: 'number',
      name: 'profits',
      placeholder: 'Profits',
      className: 'form-control mt-2'
    },
    {
      id: 'products',
      label: 'Products',
      type: 'number',
      name: 'products',
      placeholder: 'Products',
      className: 'form-control mt-2'
    }
  ]

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4 className='fw-bold'>Enterprise Setup</h4>
        <Button className="btn btn-success" onClick={handleAddNew}>
          Add Enterprise
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
            {editIndex !== null ? 'Edit Enterprise' : 'Add Enterprise'}
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
                {/* <div className="row">
                  {fieldConfig.map((field, index) => (
                    <DynamicFields key={index} {...field} />
                  ))}
                </div> */}
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="companyName">Enterprise Name</label>
                    <Field
                      type="text"
                      id="companyName"
                      name="companyName"
                      className="form-control mt-2"
                      placeholder="Enterprise Name"
                    />
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="funds">Funds(Portfolio size)</label>
                    <Field
                      id="funds"
                      type="number"
                      name="funds"
                      className="form-control mt-2"
                      placeholder="Funds"
                    />
                    <ErrorMessage
                      name="funds"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="returningFunds">Return On funds</label>
                    <Field
                      id="text"
                      type="returningFunds"
                      name="returningFunds"
                      className="form-control mt-2"
                      placeholder="Returning Funds"
                    />
                    <ErrorMessage
                      name="returningFunds"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="profits">Profits</label>
                    <Field
                      id="profits"
                      type="text"
                      name="profits"
                      className="form-control mt-2"
                      placeholder="Profits"
                    />
                    <ErrorMessage
                      name="profits"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="products">Products</label>
                    <Field
                      type="number"
                      placeholder="Number of Products"
                      id="products"
                      name="products"
                      className="form-control mt-2"
                    />
                    <ErrorMessage
                      name="profits"
                      component="div"
                      className="text-danger"
                    />
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
            <CTableHeaderCell>Enterprise ID</CTableHeaderCell>
            <CTableHeaderCell>Enterprise Name</CTableHeaderCell>
            <CTableHeaderCell>Funds</CTableHeaderCell>
            <CTableHeaderCell>Returning Funds</CTableHeaderCell>
            <CTableHeaderCell>Profits</CTableHeaderCell>
            <CTableHeaderCell>Products</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((row, index) => (
            <React.Fragment>
              <CTableRow key={index}>
                <CTableDataCell>{index}</CTableDataCell>
                <CTableDataCell>{row.companyName}</CTableDataCell>
                <CTableDataCell>{row.funds}</CTableDataCell>
                <CTableDataCell>{row.returningFunds}</CTableDataCell>
                <CTableDataCell>{row.profits}</CTableDataCell>
                <CTableDataCell>{row.products}</CTableDataCell>
                <CTableDataCell>
                  <Button
                    className="btn btn-secondary py-0 "
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

export default EnterPrizes

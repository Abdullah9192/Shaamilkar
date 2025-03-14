import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  CBadge,
  CCollapse,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

const CompanySetup = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [visibleRows, setVisibleRows] = useState({})
  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const initialValues = {
    // productId: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    address: '',
    status: '',
  };

  const validationSchema = Yup.object({
    // productId: Yup.string().required('Product ID is required'),
    companyName: Yup.string().required('Company Name is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    email: Yup.string().required('Email is required'),
    address: Yup.string().required('address is required'),
    // status: Yup.string().required('Status is required'),
  });

  const handleSubmit = (values, { resetForm }) => {
    //console.log(values)
    if (editIndex !== null) {
      // Update the existing entry
      const updatedData = [...data];
      updatedData[editIndex] = values;
      setData(updatedData);
      setEditIndex(null);
    } else {
      // Add new entry
      setData([...data, values]);
    }
    resetForm();
    setShowModal(false);
  };

  const handleAddNew = () => {
    setEditIndex(null);
    setShowModal(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Company Setup</h4>
        <Button className="btn btn-success" onClick={handleAddNew}>
          Add Company
        </Button>
      </div>

      {/* Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Edit Company' : 'Add Company'}</Modal.Title>
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
                    <label htmlFor="companyName">Company Name</label>
                    <Field type="text" id="companyName" name="companyName" className="form-control" placeholder="Company Name" />
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-4">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <Field id="phoneNumber" as="textarea" rows={1} name="phoneNumber" className="form-control" placeholder="phoneNumber" />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-4">
                    <label htmlFor="email">Email</label>
                    <Field id="email" type="email" name="email" className="form-control" placeholder="Email" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-4">
                    <label htmlFor="address">Address</label>
                    <Field id="address" type="text" name="address" className="form-control" placeholder="Address" />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3 col-md-8">
                    <label htmlFor="status">Status</label>
                    <span className='d-flex gap-2'>
                      <Field type="checkbox" id="status" name="status" className="form-check" /><label htmlFor="status">Active</label>
                    </span>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className='btn btn-success' type="submit">
                  {editIndex !== null ? 'Update' : 'Save'}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Table */}
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className='text-nowrap'>
          <CTableRow>
            <CTableHeaderCell>Company ID</CTableHeaderCell>
            <CTableHeaderCell>Company Name</CTableHeaderCell>
            <CTableHeaderCell>Phone Number</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Address</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody >
          {data.map((row, index) => (
            <React.Fragment>
              <CTableRow key={index}>
                <CTableDataCell>{index}</CTableDataCell>
                <CTableDataCell>{row.companyName}</CTableDataCell>
                <CTableDataCell>{row.phoneNumber}</CTableDataCell>
                <CTableDataCell>{row.email}</CTableDataCell>
                <CTableDataCell>{row.address}</CTableDataCell>
                <CTableDataCell>{row.status ? (
                  <CBadge  className="w-100 py-1 rounded-pill green-bg1">
                    Active
                  </CBadge>
                ) : (
                  <CBadge  className="w-100 py-1 rounded-pill red-bg1">
                    Inactive
                  </CBadge>
                )}</CTableDataCell>
                <CTableDataCell>
                  <Button className="btn btn-secondary py-0 " onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                </CTableDataCell>
              </CTableRow>
            </React.Fragment>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default CompanySetup;
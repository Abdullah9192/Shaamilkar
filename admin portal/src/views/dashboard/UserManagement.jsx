import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import DynamicFields from '../../components/DynamicFields.jsx'
import DynamicTable from '../../components/DynamicTable.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Post } from '../../Utitls/Utils.js'

const UserManagement = () => {
  const users = useSelector((state) => state.users)
  const defaultUrl = useSelector((state) => state.BaseUrl)

  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const initialValues = {
    name: '',
    role: '',
    password: '',
    email: '',
    phoneNumber: '',
    cnic: ''
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('User Name is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string().required('Password is required'),
    cnic: Yup.string()
      .matches(/^\d{13}$/, 'CNIC must be exactly 13 digits')
      .required('CNIC is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .matches(
        /^\+[\d]{1,3}[\d]{8,12}$/,
        'Phone number must include a +, country code (1-3 digits), and a valid local number (8-12 digits).'
      )
      .required('Phone number is required')
  })

  const handleSubmit = async (values, { resetForm }) => {
    // console.log('form values', values)
    if (editIndex !== null) {
      axios
        .patch(`${defaultUrl}/user/updaterole/${editIndex}`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          // console.log(res)
          if (res.data.status == 'error') {
            toast.error(res.data.message)
          } else if (res.data.status == 'success') {
            toast.success(res.data.message)
            dispatch({
              type: 'UPDATE_USER',
              payload: { index: editIndex, user: values }
            })
          } else {
            toast.error('Error Updating User')
          }
        })
        .catch((err) => {
          console.log(err)
          toast.error('Error Updating User')
        })
      setEditIndex(null)
    } else {
      values.image = 'no image'
      let response
      try {
        response = await Post(`${defaultUrl}/auth/registration`, values)
        if (response.status === 'error') {
          toast.error(response.message)
          return false
        } else if (response.status === 'success') {
          toast.success(response.message)
          dispatch({ type: 'ADD_USER', payload: response.user })
        }
      } catch (error) {
        console.error('API call failed:', error.message)
        toast.error('Failed to add user. Please try again.')
      }
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
      id: 'name',
      label: 'User Name',
      type: 'text',
      name: 'name',
      placeholder: 'User Name',
      className: 'form-control'
    },
    {
      id: 'cnic',
      label: 'CNIC',
      type: 'text',
      name: 'cnic',
      placeholder: 'Cnic',
      className: 'form-control',
      readOnly: editIndex === null ? false : true
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      name: 'email',
      placeholder: 'Email',
      className: 'form-control',
      readOnly: editIndex === null ? false : true
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'text',
      name: 'phoneNumber',
      placeholder: 'Phone Number',
      className: 'form-control',
      readOnly: editIndex === null ? false : true
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      name: 'password',
      placeholder: 'Password',
      className: 'form-control'
    },
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      name: 'role',
      options: [
        'Admin',
        'CEO',
        'CFO',
        'Credit Manager',
        'Loan Officer',
        'user',
        'Enterprise'
      ],
      className: 'form-select'
    }
  ]

  const tableHeader = [
    'User ID',
    'User Name',
    'Role',
    'Phone Number',
    'Email',
    'CNIC',
    'Action'
  ]

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // console.log(index)
      axios
        .delete(`${defaultUrl}/user/deleteuser/${index}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          // console.log(res.data)
          if (res.data.status == 'error') {
            toast.error('Error Deleting User')
          } else if (res.data.status == 'success') {
            toast.success('User Deleted Successfully')
            dispatch({
              type: 'DELETE_USER',
              payload: index
            })
          }
        })
    }
  }

  // console.log(users)
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4 className='fw-bold'>User Management</h4>
        <Button className="btn btn-success" onClick={handleAddNew}>
          Add User
        </Button>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Formik
          initialValues={
            editIndex !== null
              ? users.find((user) => user.id === editIndex) || initialValues
              : initialValues
          }
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ resetForm }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editIndex !== null ? 'Update User Role' : 'Add User'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  {fieldConfig
                    .filter(
                      (field) =>
                        editIndex === null ||
                        (field.type === 'select' && editIndex !== null)
                    )
                    .map((field, index) => (
                      <div
                        className={`${editIndex == null ? 'col-md-6' : 'col-md-12'}`}
                        key={index}
                      >
                        <DynamicFields {...field} />
                      </div>
                    ))}
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

      <DynamicTable
        tableHeader={tableHeader}
        data={users}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default UserManagement

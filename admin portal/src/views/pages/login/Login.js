import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/ShaamilKar logo.png'
import * as Yup from 'yup'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow
} from '@coreui/react'
import { Form, Formik } from 'formik'
import DynamicFields from '../../../components/DynamicFields'
import { Post } from '../../../Utitls/Utils'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const Login = () => {
  const [error, setError] = useState('')
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()
  const [identifierType, setIdentifierType] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const defaultUrl = useSelector((state) => state.BaseUrl)

  const initialValues = { identifier: '', password: '' }
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required('Email, phone number, or CNIC is required.')
      .test(
        'validIdentifier',
        'Please enter a valid email, phone number, or CNIC.',
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          const phoneRegex = /^\+\d{1,3}\d{8,12}$/
          const cnicRegex = /^\d{13}$/
          if (emailRegex.test(value)) {
            setIdentifierType('email')
          } else if (phoneRegex.test(value)) {
            setIdentifierType('phoneNumber')
          } else if (cnicRegex.test(value)) {
            setIdentifierType('cnic')
          } else {
            setIdentifierType('')
          }
          return (
            emailRegex.test(value) ||
            phoneRegex.test(value) ||
            cnicRegex.test(value)
          )
        }
      ),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long.')
      .required('Password is required.')
  })

  const handleSubmit = async (values, { resetForm }) => {
    setLoader(true)
    if (identifierType === 'email') {
      values.email = values.identifier
    } else if (identifierType === 'phoneNumber') {
      values.phoneNumber = values.identifier
    } else if (identifierType === 'cnic') {
      values.cnic = values.identifier
    } else {
      toast.error('Please enter a valid email, phone number, or CNIC.')
      return false
    }

    console.log(values)
    // return false
    try {
      const response = await Post(`${defaultUrl}/auth/login`, values)
      console.log('Response received:', response)
      setError('')
      if (response.status === 'error') {
        toast.error(response.message || 'Invalid username or password')
        setError('Invalid username or password')
      } else if (response.status === 'success') {
        const userRole = response.user.role
        if (userRole === 'user') {
          toast.error('Unauthorized Login')
        } else if (
          [
            'Admin',
            'super admin',
            'Credit Manager',
            'Loan Officer',
            'EnterPrise'
          ].includes(userRole)
        ) {
          await localStorage.setItem('accesstoken', response.accessToken)
          await localStorage.setItem('loggedIn', true)
          await localStorage.setItem('user', JSON.stringify(response.user))
          toast.success(response.message)
          window.location.reload()
          navigate('/dashboard')
        } else {
          toast.error('Unauthorized Login Access')
        }
      } else {
        console.error('Unexpected response format:', response)
        toast.error('Unexpected response. Please contact support.')
      }
    } catch (error) {
      console.error('API call failed:', error.message)
      toast.error('Failed to Login. Please try again.')
    }
    setLoader(false)
    resetForm()
  }

  const FieldConfig = [
    {
      id: 'identifier',
      label: 'CNIC / Phone Number /Email',
      type: 'text',
      name: 'identifier',
      placeholder: 'CNIC / Phone Number /Email',
      className: 'form-control'
    },
    {
      id: 'password',
      label: 'Password',
      type: passwordVisible ? 'text' : 'password',
      name: 'password',
      placeholder: 'Pasword',
      className: 'form-control'
    }
  ]
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {() => (
                      <Form>
                        <h1>Login</h1>
                        <p className="text-body-secondary">
                          Sign In to your account
                        </p>

                        {FieldConfig.map((field, index) => (
                          <DynamicFields key={index} {...field} />
                        ))}

                        {error && (
                          <p className="text-danger text-center mb-3">
                            {error}
                          </p>
                        )}

                        <CRow className="mt-4">
                          <CCol xs={5}>
                            <button
                              as="submit"
                              disabled={loader}
                              className="px-4 btn btn-success text-light"
                            >
                              {loader ? (
                                <span className="spinner-border spinner-border-sm"></span>
                              ) : (
                                'Login'
                              )}
                            </button>
                          </CCol>
                          <CCol xs={7} className="text-right">
                            <CButton
                              color="link"
                              className="px-0 text-decoration-none colorprimary"
                            >
                              Forgot password?
                            </CButton>
                          </CCol>
                        </CRow>
                      </Form>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>

              <CCard className="text-white green-bg py-5">
                <CCardBody className="text-center d-flex flex-column align-items-center justify-content-center">
                  <img src={logo} className="img-fluid w-50" alt="Logo" />
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

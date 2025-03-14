import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { MdDownload } from 'react-icons/md'
import { saveAs } from 'file-saver'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { FaChevronDown, FaChevronUp, FaFile } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { formatTimestamp } from '../../Utitls/Utils'
import { Field, Form, Formik } from 'formik'

const Application = () => {
  const defaultUrl = useSelector((state) => state.BaseUrl)
  const [showModal, setShowModal] = useState(false)
  const [showModalNote, setShowModalNote] = useState(false)
  const [showCMModalNote, setShowCMModalNote] = useState(false)
  const [showModalPdf, setShowModalPdf] = useState(false)
  const [showExcelModal, setShowExcelModal] = useState(false)
  const [creditScoreData, setCreditScoreData] = useState([])
  const [imageSrc, setImageSrc] = useState('')
  const [visibleRows, setVisibleRows] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [applications, setApplications] = useState([])
  const [editApplicationID, setEditApplicationID] = useState([])
  const ApplicationList = useSelector((state) => state.applications)
  const [selectedFile, setSelectedFile] = useState(null)
  const [updatedApplicationId, setUpdatedApplicationId] = useState(null)
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }
  const handleSave = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('creditscore', selectedFile)

    try {
      toast
        .promise(
          axios.patch(
            `${defaultUrl}/application/updateapplication/${updatedApplicationId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          ),
          {
            pending: 'Saving Credit Score...',
            success: 'Credit Score Saved Successfully',
            error: 'Error while saving Credit Score'
          }
        )
        .then((response) => {
          if (response.data.status !== 'success') {
            throw new Error('Error while saving Credit Score')
          }
          setShowExcelModal(false)
        })
        .catch((err) => {
          console.log('Error While Saving', err)
        })
    } catch (error) {
      console.error('Error while saving Excel:', error)
    }
  }

  const dispatch = useDispatch()
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    if (ApplicationList.length === 0 && ApplicationList) {
      try {
        await axios
          .get(`${defaultUrl}/application/getapplication`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            console.log('API Response: in application', res)
            if (res.data.status == 'error') {
              console.log('Error Fetching Data', res.data.message)
            } else if (res.data.status == 'success') {
              console.log('Successfully fetched data', res)
              dispatch({
                type: 'SET_APPLICATIONS',
                payload: res.data.Applications || []
              })
              setApplications(res.data.Applications)
            } else {
              console.log(' Error Fetching Data')
            }
          })
          .catch((err) => {
            console.log(err)
          })

        // if (res.data?.applications) {
        //   setApplications(res.data.applications)
        //   dispatch({ type: 'SET_APPLICATIONS', payload: res.data.applications })
        // }
      } catch (err) {
        console.error('Error fetching applications:', err)
      }
    } else {
      setApplications(ApplicationList)
    }
  }

  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleViewClick = (image) => {
    setImageSrc(image)
    setShowModal(true)
  }

  // const dummyImage = dummyimg
  // const userRole = 'Admin'
  const userRole = useSelector((state) => state.loggedUser.role)
  // let navigate = useNavigate()
  const handleExcelUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const parsedData = XLSX.utils.sheet_to_json(sheet)
      setCreditScoreData(parsedData)
      toast.success('Credit Score Data Uploaded Successfully')
      // setShowExcelModal(true)
    }
    reader.readAsBinaryString(file)
  }

  const addNotehandler = (id) => {
    setShowModalNote(true)
    console.log(id)
    setEditApplicationID(id)
  }
  const addCMNotehandler = (id) => {
    setShowCMModalNote(true)
    console.log(id)
    setEditApplicationID(id)
  }
  const handleSubmitCMNote = async (values) => {
    console.log(values)

    const obj = {
      creditofficerattachments: [values.note, values.attachment]
    }

    console.log(obj, 'object', editApplicationID)

    try {
      const res = await axios.patch(
        `${defaultUrl}/application/updateapplication/${editApplicationID}`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log(res)

      if (res.data.status === 'error') {
        toast.error(res.data.message)
      } else if (res.data.status === 'success') {
        toast.success(res.data.message)
        setApplications(() => {
          const updateApp = applications.map((app) => {
            if (app.id === res.data.updatedApplication.id) {
              return res.data.updatedApplication
            }
            return app
          })
          return updateApp
        })
        dispatch({
          type: 'UPDATE_APPLICATION',
          payload: applications
        })
        console.log(res.data.updatedApplication)
      } else {
        toast.error('Error Updating Application')
      }
    } catch (err) {
      console.log(err)
      toast.error('Error Updating Application')
    }

    setShowCMModalNote(false)
  }
  const handleSubmitNote = async (values) => {
    console.log(values)

    const obj = {
      loanofficerattachments: [values.note, values.attachment]
    }

    console.log(obj, 'object', editApplicationID)

    try {
      const res = await axios.patch(
        `${defaultUrl}/application/updateapplication/${editApplicationID}`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log(res)

      if (res.data.status === 'error') {
        toast.error(res.data.message)
      } else if (res.data.status === 'success') {
        toast.success(res.data.message)
        setApplications(() => {
          const updateApp = applications.map((app) => {
            if (app.id === res.data.updatedApplication.id) {
              return res.data.updatedApplication
            }
            return app
          })
          return updateApp
        })
        dispatch({
          type: 'UPDATE_APPLICATION',
          payload: applications
        })
        console.log(res.data.updatedApplication)
      } else {
        toast.error('Error Updating Application')
      }
    } catch (err) {
      console.log(err)
      toast.error('Error Updating Application')
    }

    setShowModalNote(false)
  }

  const handleForward = async (id, forwardedto) => {
    console.log(forwardedto)
    const obj = {
      forwardedtocm: forwardedto == 'Credit Manager' ? true : false
    }
    console.log(obj, 'object', id)
    await axios
      .patch(`${defaultUrl}/application/updateapplication/${id}`, obj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        console.log(res)
        if (res.data.status == 'error') {
          toast.error(res.data.message)
        } else if (res.data.status == 'success') {
          toast.success('Application Forwarded to Credit Manager')
          setApplications(() => {
            const updateApp = applications.map((app) => {
              if (app.id === res.data.updatedApplication.id) {
                return res.data.updatedApplication
              }
              return app
            })
            return updateApp
          })
          dispatch({
            type: 'UPDATE_APPLICATION',
            payload: applications
          })
        } else {
          toast.error('Error Updating Application')
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error('Error Updating Application')
      })
  }

  const handleApplicationStatus = async (id, status) => {
    console.log(id)
    const obj = { status }

    try {
      const res = await axios.patch(
        `${defaultUrl}/application/updateapplication/${id}`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log(res)

      if (res.data.status === 'error') {
        toast.error(res.data.message)
      } else if (res.data.status === 'success') {
        toast.success(`Application ${status}`)

        // Update the local state
        const updatedApplications = applications.map((app) =>
          app.id === res.data.updatedApplication.id
            ? res.data.updatedApplication
            : app
        )

        setApplications(updatedApplications)

        // Dispatch updated application to Redux
        dispatch({
          type: 'UPDATE_APPLICATION',
          payload: res.data.updatedApplication
        })
      } else {
        toast.error('Error Updating Application')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error Updating Application')
    }
  }

  // console.log(applications, 'apps')
  const handleDownloadCreditScore = (base64Data) => {
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
    saveAs(blob, 'Creditscore.xlsx')
  }

  // console.log(ApplicationList)
  return (
    <div>
      <h4 className="fw-bold">Applications List</h4>
      <div className="mb-3">
        <input
          type="text"
          className="form-control fw-bold"
          placeholder="Search Application by Id , Name ,Mobile Number and CNIC "
          value={searchTerm}
          style={{ height: '50px' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CTable
        align="middle"
        className="mb-0 border text-center"
        hover
        responsive
      >
        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell></CTableHeaderCell>
            <CTableHeaderCell>Application ID</CTableHeaderCell>
            <CTableHeaderCell>Customer Name</CTableHeaderCell>
            <CTableHeaderCell>Mobile Number</CTableHeaderCell>
            <CTableHeaderCell>Product</CTableHeaderCell>
            <CTableHeaderCell>Submitted At</CTableHeaderCell>
            <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {applications ? (
            applications.filter((row) =>
              userRole === 'Loan Officer'
                ? !row.forwardedtocm && row.status == 'Pending'
                : row.forwardedtocm && row.status == 'Pending'
            ).length > 0 ? (
              applications
                .filter((row) =>
                  userRole === 'Loan Officer'
                    ? !row.forwardedtocm && row.status == 'Pending'
                    : row.forwardedtocm && row.status == 'Pending'
                )
                .filter(
                  (row) =>
                    searchTerm === '' ||
                    row.firstName
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    row.lastName
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    row.mobileNumber?.toString().includes(searchTerm) ||
                    row.id?.toString().includes(searchTerm) ||
                    row.cnic?.toString().includes(searchTerm)
                )
                .reverse()
                .map((row, index) => (
                  <React.Fragment key={index}>
                    {row.status == 'Pending' && (
                      <React.Fragment key={index}>
                        <CTableRow key={index}>
                          <CTableDataCell
                            onClick={() => toggleVisibility(index)}
                            style={{ cursor: 'pointer' }}
                          >
                            {' '}
                            {visibleRows[index] ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{row.id}</CTableDataCell>
                          <CTableDataCell>
                            {row.firstName + ' ' + row.lastName}
                          </CTableDataCell>
                          <CTableDataCell>{row.mobileNumber}</CTableDataCell>
                          <CTableDataCell className="text-nowrap">
                            {row.product.title}
                          </CTableDataCell>
                          <CTableDataCell className="text-nowrap">
                            <span
                              className="rounded-pill px-2"
                              style={{ background: 'lightgrey' }}
                            >
                              {formatTimestamp(row.createdAt)}
                            </span>
                          </CTableDataCell>

                          <CTableDataCell className="d-flex justify-content-center gap-1">
                            {userRole == 'Loan Officer' && (
                              <>
                                <Button
                                  className="btn btn-outline py-0 rounded-2 border-black"
                                  style={{
                                    background: 'none',
                                    color: 'black'
                                  }}
                                  onClick={() => {
                                    addNotehandler(row.id)
                                  }}
                                >
                                  Add Note
                                </Button>
                                <Button
                                  className="btn btn-success py-0 rounded-2 border-black"
                                  onClick={() => {
                                    handleForward(row.id, 'Credit Manager')
                                  }}
                                >
                                  Forward to Credit Manager
                                </Button>
                              </>
                            )}
                            {(userRole == 'Credit Manager' ||
                              userRole == 'Admin' ||
                              userRole == 'CFO' ||
                              userRole == 'CEO') && (
                              <>
                                <Button
                                  className="btn btn-outline py-0 rounded-2 border-black"
                                  style={{
                                    background: 'none',
                                    color: 'black'
                                  }}
                                  onClick={() => {
                                    addCMNotehandler(row.id)
                                  }}
                                >
                                  Add Note
                                </Button>
                                <Button
                                  className="btn btn-success py-0 rounded-2"
                                  onClick={() =>
                                    handleApplicationStatus(row.id, 'Approved')
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  className="btn btn-danger text-white py-0 rounded-2"
                                  onClick={() => {
                                    handleApplicationStatus(row.id, 'Rejected')
                                  }}
                                >
                                  Reject
                                </Button>
                                <Button
                                  className="btn btn-success py-0 rounded-2 border-black"
                                  onClick={() => {
                                    handleForward(row.id, 'Loan Officer')
                                  }}
                                >
                                  Send to Loan Officer
                                </Button>
                              </>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                        {visibleRows[index] ? (
                          <CTableRow>
                            <CTableDataCell
                              className="px-5 py-2 w-100 bg-body-tertiary"
                              colSpan="7"
                            >
                              {/* <CCollapse visible={visibleRows[index]}> */}
                              <div className="d-flex bg-transparent gap-3 mb-3">
                                <div style={{ width: '19%' }}>
                                  <h6 className="fs-6">CNIC</h6>
                                  <div>{row.cnic}</div>
                                </div>
                                <div style={{ width: '40%' }}>
                                  <h6>CNIC Front Photo</h6>
                                  <div
                                    className={
                                      'imageView fs-6 border d-flex align-items-center justify-content-between w-75 px-2 rounded-2'
                                    }
                                  >
                                    <FaFile size={15} color="darkblue" /> CNIC
                                    Front Photo
                                    <a
                                      className="fw-bold text-decoration-none float-end"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleViewClick(row.cnicFrontPhoto)
                                      }}
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                                <div style={{ width: '38%' }}>
                                  <h6>CNIC Back Photo</h6>
                                  <div
                                    className={
                                      'imageView fs-6 border w-75 px-2 rounded-2 d-flex align-items-center justify-content-between'
                                    }
                                  >
                                    <FaFile size={15} color="darkblue" /> CNIC
                                    Back Photo{' '}
                                    <a
                                      className="fw-bold text-decoration-none float-end"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleViewClick(row.cnicBackPhoto)
                                      }}
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex bg-transparent gap-4 mb-3">
                                <div style={{ width: '20%' }}>
                                  <h6 className="fs-6">Product Name </h6>
                                  <span>{row.product.title}</span>
                                </div>
                                <div style={{ width: '20%' }}>
                                  <h6>Variant Details</h6>
                                  <span>
                                    {row?.product?.variants?.[0]?.option1 ||
                                      'N/A'}
                                  </span>
                                </div>
                                <div style={{ width: '20%' }}>
                                  <h6>Downpayements</h6>
                                  <span>
                                    {row?.installmentPlan?.downPayment.toFixed(
                                      0
                                    ) || 'N/A'}
                                  </span>
                                </div>
                                <div style={{ width: '20%' }}>
                                  <h6>Processing Fee</h6>
                                  <span>3% One tIme only fee</span>
                                </div>
                                <div style={{ width: '20%' }}>
                                  <h6>Installement Plan</h6>
                                  <span>
                                    {row?.installmentPlan?.selectedPlan ||
                                      'N/A'}
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex bg-transparent gap-4 mb-3">
                                <div style={{ width: '18%' }}>
                                  <h6 className="fs-6">Installment Amount </h6>
                                  <span>
                                    {Math.round(
                                      row?.installmentPlan?.installments?.[1]
                                        ?.amountWithInDueDate || 'N/A'
                                    )}
                                  </span>
                                </div>
                                <div style={{ width: '30%' }}>
                                  <h6>6 months Banks Statement </h6>
                                  <div
                                    className={
                                      'imageView fs-6 border w-75 px-2 rounded-2 d-flex align-items-center justify-content-between'
                                    }
                                  >
                                    <FaFile size={15} color="orange" /> Bank
                                    Statement{' '}
                                    <a
                                      className="fw-bold text-decoration-none float-end"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleViewClick(
                                          row.sixMonthBankStatement
                                        )
                                      }}
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                                <div style={{ width: '30%' }}>
                                  <h6>Utility Bills</h6>
                                  <div
                                    className={
                                      'imageView fs-6 border w-75 px-2 rounded-2 d-flex align-items-center justify-content-between'
                                    }
                                  >
                                    <FaFile size={15} color="orange" /> Utility
                                    Bill{' '}
                                    <a
                                      className="fw-bold text-decoration-none float-end"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleViewClick(row.utilityBill)
                                      }}
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex bg-transparent gap-4 mb-3">
                                <div style={{ width: '30%' }}>
                                  <h6 className="fs-6">Last Sallery </h6>
                                  <div
                                    className={
                                      'imageView fs-6 border w-75 px-2 rounded-2 d-flex align-items-center justify-content-between'
                                    }
                                  >
                                    <FaFile size={15} color="orange" /> Sallery
                                    Slip{' '}
                                    <a
                                      className="fw-bold text-decoration-none float-end"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleViewClick(row.lastPaySlip)
                                      }}
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                                <div style={{ width: '30%' }}>
                                  <h6>Credit Score </h6>
                                  {row.creditscore !== null ? (
                                    <Button
                                      variant="info"
                                      className="text-white"
                                      onClick={() =>
                                        handleDownloadCreditScore(
                                          row.creditscore
                                        )
                                      }
                                    >
                                      Download <MdDownload />
                                    </Button>
                                  ) : (
                                    <>
                                      {creditScoreData.length > 0 || (
                                        <button
                                          className="btn btn-success"
                                          onClick={() => {
                                            setShowExcelModal(true)
                                            setUpdatedApplicationId(row.id)
                                          }}
                                        >
                                          Upload Credit Score
                                        </button>
                                      )}
                                      {creditScoreData.length > 0 && (
                                        <div
                                          className={
                                            'imageView fs-6 border w-75 px-2 rounded-2 d-flex align-items-center justify-content-between'
                                          }
                                        >
                                          <FaFile size={15} color="orange" />{' '}
                                          Credit Score
                                          <a
                                            className="fw-bold text-decoration-none float-end"
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault()
                                              setShowExcelModal(true)
                                            }}
                                          >
                                            View
                                          </a>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div style={{ width: '30%' }}>
                                  <h6>Note</h6>
                                  <div>
                                    {row.loanofficerattachments[0] == '' ||
                                    row.loanofficerattachments.length == 0 ? (
                                      <div>No Note Added</div>
                                    ) : (
                                      <div>
                                        <b>Loan Officer Note:</b>{' '}
                                        {row.loanofficerattachments[0]}
                                      </div>
                                    )}
                                    {row.creditofficerattachments[0] == '' ||
                                    row.creditofficerattachments.length == 0 ? (
                                      <div>No Note Added</div>
                                    ) : (
                                      <div>
                                        <b>Credit Manager Note:</b>
                                        {row.creditofficerattachments[0]}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        ) : (
                          ''
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ))
            ) : (
              <CTableRow className="text-center" colSpan="7">
                <CTableDataCell className="text-center" colSpan="7">
                  No new applications
                </CTableDataCell>
              </CTableRow>
            )
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={7} className="text-center">
                <span className="loader"></span>
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
      <Modal
        show={showModalNote}
        onHide={() => setShowModalNote(false)}
        centered
      >
        <Formik
          initialValues={{
            note: '',
            attactment: ''
          }}
          handleSubmit={handleSubmitNote}
        >
          {({ values }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Add Note </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label for="note">Note</label>
                <Field
                  name="note"
                  id="note"
                  as="textarea"
                  cols="30"
                  rows="3"
                  className="form-control mb-2"
                ></Field>
                <label htmlFor=""> Add Your Excel Attachments Here</label>
                <Field
                  type="file"
                  id="attachment"
                  name="attachment"
                  className="form-control"
                  accept=".xls,.xlsx"
                  multiple
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowModalNote(false)}
                >
                  Close
                </Button>
                <Button
                  className="btn btn-success"
                  onClick={() => {
                    handleSubmitNote(values)
                  }}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal
        show={showCMModalNote}
        onHide={() => setShowCMModalNote(false)}
        centered
      >
        <Formik
          initialValues={{
            note: '',
            attactment: ''
          }}
          handleSubmit={handleSubmitCMNote}
        >
          {({ values }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Add Note </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label htmlFor="note">Note</label>
                <Field
                  name="note"
                  id="note"
                  as="textarea"
                  cols="30"
                  rows="3"
                  className="form-control my-2"
                ></Field>
                <label htmlFor="attachment">
                  Add Your Excel Attachments Here
                </label>
                <Field
                  type="file"
                  id="attachment"
                  name="attachment"
                  accept=".xls,.xlsx"
                  className="form-control my-2"
                  multiple
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowCMModalNote(false)}
                >
                  Close
                </Button>
                <Button
                  className="btn btn-success"
                  onClick={() => {
                    handleSubmitCMNote(values)
                  }}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageSrc} alt="Preview" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showExcelModal}
        onHide={() => setShowExcelModal(false)}
        centered
        size={creditScoreData.length > 0 ? 'xl' : 'md'}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {creditScoreData.length > 0 ? 'Uploaded' : 'Upload'} Credit Score
            Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {creditScoreData.length > 0 || (
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                handleFileChange(e)
                handleExcelUpload(e)
              }}
              // onChange={handleExcelUpload}
              className="form-control mb-3"
            />
          )}
          {creditScoreData.length > 0 && (
            <CTable align="middle" className="mt-3" hover responsive>
              <CTableHead className="text-nowrap">
                <CTableRow>
                  {Object.keys(creditScoreData[0]).map((key, idx) => (
                    <CTableHeaderCell key={idx}>{key}</CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {creditScoreData.map((row, idx) => (
                  <CTableRow key={idx}>
                    {Object.values(row).map((value, i) => (
                      <CTableDataCell key={i}>{value}</CTableDataCell>
                    ))}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowExcelModal(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!selectedFile}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Application

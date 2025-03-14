import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import dummyimg from '../../assets/dummyimg.png'

import {
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import { FaChevronDown, FaChevronUp, FaFile } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import DataModal from '../../components/ApplicationDetails'
import { MdDownload } from 'react-icons/md'

const Customers = () => {
  const [showModal, setShowModal] = useState(false)
  const [visibleRows, setVisibleRows] = useState({})
  const [imageSrc, setImageSrc] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const ApplicationList = useSelector((state) => state.applications)
  const [applications, setApplications] = useState([])
  const [creditScoreData, setCreditScoreData] = useState([])

  const [showExcelModal, setShowExcelModal] = useState(false)

  const dispatch = useDispatch()

  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  useEffect(() => {
    fetchData()
  }, [])
  const defaultUrl = useSelector((state) => state.BaseUrl)
  const fetchData = async () => {
    if (ApplicationList?.length === 0 && ApplicationList) {
      try {
        await axios
          .get(`${defaultUrl}/application/getapplication`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            console.log('API Response:', res)
            if (res.data.status == 'error') {
              console.log('Error Fetching Data', res.data.message)
            } else if (res.data.status == 'success') {
              console.log('Successfully fetched data')
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
  const handleViewClick = (image) => {
    setImageSrc(image)
    setShowModal(true)
  }
  const dummyImage = dummyimg
  // const filteredData = data.filter((item) =>
  //   Object.values(item)
  //     .join(' ')
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase())
  // )
  const handleCompleted = async (id) => {
    console.log(id)
    const obj = {
      status: 'Completed'
    }

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
        toast.success('Application Status Completed')

        // Update the local state with the modified application
        const updatedApplications = applications.map((app) =>
          app.id === res.data.updatedApplication.id
            ? res.data.updatedApplication
            : app
        )

        setApplications(updatedApplications)

        // Dispatch only the updated application to Redux
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

  const handleDefaulter = async (id) => {
    console.log(id)
    const obj = {
      status: 'Default'
    }

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
        toast.success('Application Status Default')

        // Update the local state with the modified application
        const updatedApplications = applications.map((app) =>
          app.id === res.data.updatedApplication.id
            ? res.data.updatedApplication
            : app
        )

        setApplications(updatedApplications)

        // Dispatch only the updated application to Redux
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
  const downloadPDF = (base64String, fileName = 'document.pdf') => {
    console.log(base64String)
    try {
      if (!base64String) {
        console.error('Base64 string is empty!')
        return
      }

      // Remove the data URI prefix if present
      const base64WithoutPrefix = base64String
        .replace(/^data:application\/pdf;base64,/, '')
        .trim()

      // Decode Base64 safely
      const binaryString = atob(base64WithoutPrefix)

      // Convert to byte array
      const byteNumbers = new Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        byteNumbers[i] = binaryString.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      // Create a download link and trigger the download
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error decoding Base64 PDF:', error)
    }
  }
  // console.log(ApplicationList, 'customers list')
  return (
    <div>
      <h4 className="fw-bold">Customers List</h4>
      {/* Table */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control fw-bold"
          placeholder="Search by Name and Mobile Number"
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
            <CTableHeaderCell>Customer ID</CTableHeaderCell>
            <CTableHeaderCell>Customer Name</CTableHeaderCell>
            <CTableHeaderCell>Mobile Number</CTableHeaderCell>
            <CTableHeaderCell className="text-center">Status</CTableHeaderCell>

            <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {ApplicationList ? (
            ApplicationList.filter(
              (row) =>
                (row.status === 'Approved' ||
                  row.status === 'Rejected' ||
                  row.status === 'Default' ||
                  row.status === 'Completed') &&
                (row.firstName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                  row.lastName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  row.mobileNumber.includes(searchTerm) ||
                  row.status.includes(searchTerm))
            ).length > 0 ? (
              ApplicationList.filter(
                (row) =>
                  (row.status === 'Approved' ||
                    row.status === 'Rejected' ||
                    row.status === 'Default' ||
                    row.status === 'Completed') &&
                  (row.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                    row.lastName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    row.mobileNumber.includes(searchTerm) ||
                    row.status.includes(searchTerm.toLowerCase()))
              ).map((row, index) => (
                <React.Fragment key={index}>
                  <CTableRow>
                    <CTableDataCell
                      onClick={() => toggleVisibility(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      {' '}
                      {visibleRows[index] ? <FaChevronUp /> : <FaChevronDown />}
                    </CTableDataCell>
                    <CTableDataCell>{row.id}</CTableDataCell>
                    <CTableDataCell>
                      {row.firstName + ' ' + row.lastName}
                    </CTableDataCell>
                    <CTableDataCell>{row.mobileNumber}</CTableDataCell>
                    <CTableDataCell className="text-center text-nowrap">
                      <div
                        className={`${row.status == 'Completed' ? 'badge bg-success py-1' : row.status == 'Approved' ? 'badge bg-primary py-1' : row.status == 'Rejected' ? 'badge bg-warning py-1' : 'badge bg-danger py-1'} w-100`}
                      >
                        {row.status}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="d-flex justify-content-center gap-2">
                      {row.status == 'Approved' ? (
                        <>
                          <Button
                            className="btn btn-success py-0 rounded-2"
                            onClick={() => handleCompleted(row.id)}
                          >
                            Mark as Complete
                          </Button>
                          <Button
                            className="btn btn-danger py-0 rounded-2 text-light"
                            onClick={() => handleDefaulter(row.id)}
                          >
                            Default
                          </Button>
                          <DataModal item={row} />
                        </>
                      ) : (
                        <DataModal item={row} />
                      )}
                    </CTableDataCell>
                  </CTableRow>
                  {visibleRows[index] ? (
                    <CTableDataCell
                      className="px-5 py-2 bg-body-tertiary"
                      colSpan="6"
                    >
                      {/* <CCollapse visible={visibleRows[index]}> */}
                      <div className="d-flex bg-transparent gap-3 mb-3">
                        <div style={{ width: '19%' }}>
                          <h6 className="fs-6">CNIC</h6>
                          <div className="pe-2">{row.cnic}</div>
                        </div>
                        <div style={{ width: '39%' }}>
                          <h6>CNIC Front Photo</h6>
                          <div
                            className={
                              'fs-6 border w-75  rounded-2 d-flex align-items-center justify-content-between px-2'
                            }
                          >
                            <FaFile size={15} color="darkblue" /> Image Preview{' '}
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
                        <div style={{ width: '39%' }}>
                          <h6>CNIC Back Photo</h6>
                          <div
                            className={
                              'fs-6 border w-75  rounded-2 d-flex align-items-center justify-content-between px-2'
                            }
                          >
                            <FaFile size={15} color="darkblue" /> Image Preview{' '}
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
                          <span> {row.product.variants[0].option1}</span>
                        </div>
                        <div style={{ width: '20%' }}>
                          <h6>Downpayements</h6>
                          <span>
                            {row.installmentPlan.downPayment.toFixed(0)}
                          </span>
                        </div>
                        <div style={{ width: '20%' }}>
                          <h6>Processing Fee</h6>
                          <span>3%</span>
                        </div>
                      </div>
                      <div className="d-flex bg-transparent gap-1 mb-3">
                        <div style={{ width: '30%' }}>
                          <h6>Installement Plan</h6>
                          <span>{row.installmentPlan.selectedPlan}</span>
                        </div>
                        <div style={{ width: '30%' }}>
                          <h6 className="fs-6">Installment Amount </h6>
                          <span>
                            {Math.round(
                              row.installmentPlan.installments[1].amount
                            )}
                          </span>
                        </div>

                        <div style={{ width: '35%' }}>
                          <h6>6 months Banks Statement </h6>
                          <div
                            className={
                              'fs-6 w-75 border rounded-2 d-flex align-items-center justify-content-between px-2'
                            }
                          >
                            <FaFile size={15} color="orange" /> Image Preview{' '}
                            <a
                              className="fw-bold text-decoration-none float-end"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handleViewClick(row.sixMonthBankStatement)
                              }}
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex bg-transparent gap-1 mb-3">
                        <div style={{ width: '25%' }}>
                          <h6 className="fs-6">City</h6>
                          <span>{row.city}</span>
                        </div>
                        <div style={{ width: '25%' }}>
                          <h6 className="fs-6">Current Address </h6>
                          <span>{row.currentAddress}</span>
                        </div>
                        <div style={{ width: '25%' }}>
                          <h6 className="fs-6">Living Since </h6>
                          <span>{row.livingSince}</span>
                        </div>
                        <div style={{ width: '25%' }}>
                          <h6 className="fs-6">Residence Type</h6>
                          <span>{row.residenceType}</span>
                        </div>
                      </div>
                      <div className="d-flex bg-transparent gap-4 mb-3">
                        <div style={{ width: '20%' }}>
                          <h6 className="fs-6">Occupation </h6>
                          <span>{row.occupation}</span>
                        </div>
                        <div style={{ width: '38%' }}>
                          <h6>Utility Bills</h6>
                          <div
                            className={
                              'fs-6 w-75 border rounded-2 d-flex align-items-center justify-content-between px-2'
                            }
                          >
                            <FaFile size={15} color="orange" /> Image Preview{' '}
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
                        <div style={{ width: '35%' }}>
                          <h6 className="fs-6">Last Sallery </h6>
                          <div
                            className={
                              'fs-6 w-75 border rounded-2 d-flex align-items-center justify-content-between px-2'
                            }
                          >
                            <FaFile size={15} color="orange" /> Image Preview{' '}
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
                      </div>
                      <div className="d-flex bg-transparent gap-4 mb-3">
                        <div style={{ width: '38%' }}>
                          <h6>Credit Score </h6>
                          {row.creditscore !== null ? (
                            <Button
                              variant="info"
                              className="text-white"
                              onClick={() =>
                                handleDownloadCreditScore(row.creditscore)
                              }
                            >
                              Download <MdDownload />
                            </Button>
                          ) : (
                            <>
                              {creditScoreData.length > 0 || (
                                <span>No Credit Score Found</span>
                              )}
                              {creditScoreData.length > 0 && (
                                <div
                                  className={
                                    'imageView fs-6 border w-75 px-2 rounded-2 d-flex align-items-center justify-content-between'
                                  }
                                >
                                  <FaFile size={15} color="orange" /> Credit
                                  Score
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
                        <div style={{ width: '60%' }}>
                          <h6>Notes</h6>
                          <span>{row.loanofficerattachments[0]}</span>
                        </div>
                      </div>
                      <div className="d-flex bg-transparent gap-4 mb-3">
                        <div style={{ width: '33%' }}>
                          <h6>Musawamah</h6>
                          {row?.signaturepdf?.musawamah !== null ? (
                            <button
                              className="btn btn-info text-white"
                              onClick={() =>
                                downloadPDF(
                                  row.signaturepdf.musawamah,
                                  'musawamahSigned.pdf'
                                )
                              }
                            >
                              Download
                              <MdDownload />
                            </button>
                          ) : (
                            <span>Not Available</span>
                          )}
                        </div>
                        <div style={{ width: '34%' }}>
                          <h6>Acknowledgement</h6>
                          {row?.signaturepdf?.acknowledgement !== null ? (
                            <button
                              className="btn btn-info text-white"
                              onClick={() =>
                                downloadPDF(
                                  row.signaturepdf.acknowledgement,
                                  'acknowledgementSigned.pdf'
                                )
                              }
                            >
                              Download
                              <MdDownload />
                            </button>
                          ) : (
                            <span>Not Available</span>
                          )}
                        </div>
                        <div style={{ width: '33%' }}>
                          <h6>Undertaking</h6>
                          {row?.signaturepdf?.undertaking !== null ? (
                            <button
                              className="btn btn-info text-white"
                              onClick={() =>
                                downloadPDF(
                                  row.signaturepdf.undertaking,
                                  'undertakingSigned.pdf'
                                )
                              }
                            >
                              Download
                              <MdDownload />
                            </button>
                          ) : (
                            <span>Not Available</span>
                          )}
                        </div>
                      </div>
                    </CTableDataCell>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={8} className="text-center">
                  No Customers Found
                </CTableDataCell>
              </CTableRow>
            )
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={8} className="text-center">
                <span className='loader'></span>
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
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
    </div>
  )
}

export default Customers

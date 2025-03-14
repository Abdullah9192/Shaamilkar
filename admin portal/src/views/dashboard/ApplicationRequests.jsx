import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import PDF from '../../assets/docs/musawamahAgrrement.pdf'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import PdfViewer from '../../components/PDFViewer'
import { useNavigate } from 'react-router-dom'

const ApplicationRequests = () => {
  const [data] = useState([
    {
      deviceName: 'customer1',
      make: '0332-XXXXXXX',
      model: 'Mobile',
      variant: '12/5/2024',
      applicationStatus: 'Approved'
    },
    {
      deviceName: 'customer2',
      make: '0332-XXXXXXX',
      model: 'Mobile',
      variant: '12/5/2024',
      applicationStatus: 'Pending'
    },
    {
      deviceName: 'customer3',
      make: '0332-XXXXXXX',
      model: 'Mobile',
      variant: '12/5/2024',
      applicationStatus: 'Rejected'
    },
    {
      deviceName: 'customer4',
      make: '0332-XXXXXXX',
      model: 'Mobile',
      variant: '12/5/2024',
      applicationStatus: 'Pending'
    },
    {
      deviceName: 'customer5',
      make: '0332-XXXXXXX',
      model: 'Mobile',
      variant: '12/5/2024',
      applicationStatus: 'Pending'
    }
  ])

  const [showModalPDF, setShowModalPDF] = useState(false)
  const [showModalSign, setShowModalSign] = useState(false)
  const [showModalDetails, setShowModalDetails] = useState(false)
  const [visibleRows, setVisibleRows] = useState({})
  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const productSections = [
    {
      title: 'Description',
      content:
        'Samsung Galaxy A05, with 64GB storage and 4GB RAM, operates on Android 13 OS and OneUI. Its 6.7-inch PLS LCD screen offers a resolution of 720 x 1600 pixels. The phone is powered by the MediaTek Helio G85 chipset and Mali-G52 GPU, ensuring smooth performance. It features a dual-camera setup with a 50MP main lens and a 2MP depth sensor, along with an 8MP front camera. With a robust 5000mAh battery, it supports 25W fast charging for extended use.'
    },
    {
      title: 'Build',
      content: [
        'OS: Android 13 OS Light Green',
        'OneUI Dimensions: 168.8 x 78.2 x 8.8 mm',
        'Weight: 195 g',
        'SIM: Dual SIM',
        'Dual Standby (Nano-SIM)',
        'Colors: Black, Silver'
      ]
    },
    {
      title: 'Frequency',
      content: [
        '2G Band SIM1/SIM2: GSM 850 / 900 / 1800 / 1900',
        '3G Band: HSDPA 850 / 900 / 2100',
        '4G LTE Band: (1)2100, (3)1800, (5)850, (7)2600, (8)900, (20)800, (38)2600, (40)2300, (41)2500'
      ]
    },
    {
      title: 'Display',
      content: [
        'Technology: PLS LCD Capacitive Touchscreen, 16M Colors, Multitouch',
        'Size: 6.7 Inches',
        'Resolution: 720 x 1600 Pixels (~262 PPI)'
      ]
    },
    {
      title: 'Processor',
      content: [
        'CPU: Octa-core (2 x 2.0 GHz Cortex-A75 + 6 x 1.8 GHz Cortex-A55)',
        'Chipset: Mediatek MT6769V/CZ Helio G85 (12nm)',
        'GPU: Mali-G52 MC2'
      ]
    },
    {
      title: 'Camera',
      content: [
        'Main (Dual Camera): 50 MP, f/1.8 (wide), AF + 2 MP, f/2.4 (depth), LED Flash,',
        'Features: Geo-tagging, touch focus, face detection, panorama, HDR, Video (1080p@30/60fps)',
        'Resolution: 720 x 1600 Pixels (~262 PPI)',
        'Front: 8 MP, f/2.0'
      ]
    },
    {
      title: 'Memory:',
      content: ['Built-in: 64GB Built-in, 4GB RAM', 'Card: microSDXC']
    },
    {
      title: 'Connectivity',
      content: [
        'WLAN: Wi-Fi 802.11 a/b/g/n/ac, dual-band, Wi-Fi Direct',
        'Bluetooth: v5.3 with A2DP, LE',
        'GPS: Yes + A-GPS support & Glonass, BDS',
        'Radio: FM Radio',
        'USB: Type-C 2.0',
        'NFC: No',
        'Data: GPRS, EDGE, 3G (HSPA 42.2/5.76 Mbps), 4G (LTE Cat4 150/50 Mbps)'
      ]
    },
    {
      title: 'Built-in Features',
      content: [
        'Sensors: Accelerometer, Proximity',
        'Audio Jack: 3.5mm',
        'Messaging: SMS (threaded view), MMS, Email, Push Mail, IM',
        'Games: Built-in + Downloadable',
        'Extra: Glass front, plastic back, plastic frame, Photo/video editor, Document viewer'
      ]
    },
    {
      title: 'Battery',
      content: [
        'Capacity: Li-Po (non-removable), 5000 mAh – Fast charging 25W wired'
      ]
    }
  ]
  let navigate = useNavigate()
  return (
    <div>
      <h4
        onClick={() => {
          navigate('/ApplicationForm')
        }}
      >
        Applications List
      </h4>

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
            <CTableHeaderCell>Device Name</CTableHeaderCell>
            <CTableHeaderCell>Make</CTableHeaderCell>
            <CTableHeaderCell>Model</CTableHeaderCell>
            <CTableHeaderCell>Variant</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <CTableRow key={index}>
                <CTableDataCell
                  onClick={() => toggleVisibility(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {visibleRows[index] ? <FaChevronUp /> : <FaChevronDown />}
                </CTableDataCell>
                <CTableDataCell>{index}</CTableDataCell>
                <CTableDataCell>{row.deviceName}</CTableDataCell>
                <CTableDataCell>{row.make}</CTableDataCell>
                <CTableDataCell>{row.model}</CTableDataCell>
                <CTableDataCell>{row.variant}</CTableDataCell>
                <CTableDataCell className="fw-semibold text-emphasis">
                  {row.applicationStatus == 'Approved' ? (
                    <span className="alert alert-success text-success py-1 px-3 rounded-pill">
                      Approved
                    </span>
                  ) : row.applicationStatus == 'Rejected' ? (
                    <span className="alert alert-danger text-danger py-1 px-3 rounded-pill">
                      Rejected
                    </span>
                  ) : (
                    <span className="alert alert-warning text-warning py-1 px-3 rounded-pill">
                      Pending
                    </span>
                  )}
                </CTableDataCell>
                <CTableDataCell className="d-flex justify-content-center gap-1">
                  <Button
                    className="btn btn-success py-2 rounded-2 "
                    onClick={() => setShowModalSign(true)}
                  >
                    Sign
                  </Button>
                  <Button
                    className="btn btn-secondary py-0 rounded-2 "
                    onClick={() => setShowModalDetails(true)}
                  >
                    View Details
                  </Button>
                </CTableDataCell>
              </CTableRow>
              {visibleRows[index] ? (
                <CTableDataCell
                  className="px-5 py-2 w-100 bg-body-tertiary text-start"
                  colSpan="8"
                >
                  <div className="p-4 bg-body-tertiary">
                    <div>
                      <h5>Product Description</h5>
                      <p className="mt-1">{productSections[0].content}</p>
                    </div>
                    <div
                      className="p-3"
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      {productSections.slice(1).map((section, index) => (
                        <div
                          key={index}
                          style={{ flex: '1 1 30%', minWidth: '200px' }}
                        >
                          <h5>{section.title}:</h5>
                          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                            {section.content.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </CTableDataCell>
              ) : (
                ''
              )}
            </React.Fragment>
          ))}
        </CTableBody>
      </CTable>
      <Modal
        show={showModalDetails}
        onHide={() => setShowModalDetails(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mb-3">
          <div
            className="bg-light px-2 rounded-2"
            style={{ borderLeft: '5px solid #38a237' }}
          >
            <div>
              <strong>Total Price:</strong>210,000
            </div>
            <div>
              <strong>Your Down payment Amound:</strong>15,000
            </div>
            <div>
              <strong>Selected Instalment Plan:</strong>12 Months Instalments
            </div>
            <div>
              <strong>Monthly instalment:</strong>210,000
            </div>
            <div>
              <strong>Total Amount on lease:</strong>230,000
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        className="text-center"
        show={showModalSign}
        onHide={() => setShowModalSign(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Musawamah Agreement</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <PdfViewer PDF={PDF} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ApplicationRequests

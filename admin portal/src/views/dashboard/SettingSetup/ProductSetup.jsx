import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { IoMdRefresh } from 'react-icons/io'
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
// import axios from 'axios'

const ProductSetup = () => {
  const [data, setData] = useState([])
  const [showModal1, setShowModal1] = useState(false)
  const [visibleRows, setVisibleRows] = useState({})
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    if (localStorage.getItem('products')) {
      // toast.success('Already Exists')
      setData(JSON.parse(localStorage.getItem('products')))
      return false
    } else {
      fetch('/api/products.json', {
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setData(data.products)
          localStorage.setItem('products', JSON.stringify(data.products))
        })
        .catch((error) => console.error('Error:', error))
    }
  }

  const toggleVisibility = (index) => {
    setVisibleRows((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleViewClick = (img) => {
    setImageSrc(img)
    setShowModal1(true)
  }
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Product Setup</h4>
        <button
          className="btn"
          onClick={() => {
            localStorage.removeItem('products')
            fetchData()
          }}
        >
          <IoMdRefresh />
        </button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control fw-bold"
          placeholder="Search by Id"
          value={searchTerm}
          style={{ height: '50px' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Table */}
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell></CTableHeaderCell>
            <CTableHeaderCell>Product ID</CTableHeaderCell>
            <CTableHeaderCell>Vendor</CTableHeaderCell>
            <CTableHeaderCell>Model</CTableHeaderCell>
            <CTableHeaderCell>Base Price</CTableHeaderCell>
            <CTableHeaderCell>Quantity</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            {/* <CTableHeaderCell>Actions</CTableHeaderCell> */}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredData.map((row, index) => (
            <React.Fragment key={index}>
              <CTableRow>
                <CTableDataCell
                  onClick={() => toggleVisibility(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {visibleRows[index] ? <FaChevronUp /> : <FaChevronDown />}
                </CTableDataCell>
                <CTableDataCell>{row.id}</CTableDataCell>
                <CTableDataCell>{row.vendor}</CTableDataCell>
                <CTableDataCell>{row.title}</CTableDataCell>
                <CTableDataCell>{row.variants[0].price}</CTableDataCell>
                <CTableDataCell>
                  {row.variants[0].inventory_quantity}
                </CTableDataCell>
                <CTableDataCell>
                  {row.status == 'active' ? (
                    <CBadge
                      color="success"
                      className="px-2 rounded-pill opacity-75"
                    >
                      Active
                    </CBadge>
                  ) : (
                    <CBadge
                      color="danger"
                      className="px-2 rounded-pill opacity-75"
                    >
                      Inactive
                    </CBadge>
                  )}
                </CTableDataCell>
                {/* <CTableDataCell>
                  <Button
                    className="btn btn-secondary py-0"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                </CTableDataCell> */}
              </CTableRow>
              {visibleRows[index] ? (
                <CTableDataCell
                  className="px-5 py-2 bg-body-tertiary"
                  colSpan="8"
                >
                  {/* <CCollapse visible={visibleRows[index]}> */}
                  <div className="d-flex bg-transparent gap-3 mb-3">
                    <div style={{ width: '19%' }}>
                      <h6 className="fs-6">Category</h6>
                      <div className="pe-2">Cellular Devices</div>
                    </div>
                    <div style={{ width: '19%' }}>
                      <h6 className="fs-6">Variant</h6>
                      <div className="pe-2">{row.variants[0].title}</div>
                    </div>
                    <div style={{ width: '19%' }}>
                      <h6 className="fs-6">Price Off</h6>
                      <div className="pe-2">
                        {row.variants[0].compare_at_price}
                      </div>
                    </div>
                    <div style={{ width: '39%' }}>
                      <h6>Product Image</h6>
                      <div
                        className={
                          'fs-6 border w-75  rounded-2 d-flex align-items-center justify-content-between px-2'
                        }
                      >
                        <FaFile size={15} color="darkblue" /> {row.title}{' '}
                        <a
                          className="fw-bold text-decoration-none float-end"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handleViewClick(row.image.src)
                          }}
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex bg-transparent gap-3 mb-3">
                    <div style={{ width: '100%' }}>
                      <h6 className="fs-6">Description</h6>
                      <div className="pe-2">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Mollitia porro suscipit eligendi eius quo ratione
                        voluptatum, et eveniet praesentium illum voluptate
                        dolores unde? Sit vero est quas alias nam
                        consequatur.Lorem ipsum dolor sit amet consectetur,
                        adipisicing elit. Mollitia porro suscipit eligendi eius
                        quo ratione voluptatum, et eveniet praesentium illum
                        voluptate dolores unde? Sit vero est quas alias nam
                        consequatur.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex bg-transparent gap-3 mb-3">
                    <div style={{ width: '30%' }}>
                      <h6 className="fs-6">Build</h6>
                      <div className="pe-2">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                      </div>
                    </div>
                    <div style={{ width: '30%' }}>
                      <h6 className="fs-6">Frequency</h6>
                      <div className="pe-2">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                      </div>
                    </div>
                    <div style={{ width: '30%' }}>
                      <h6 className="fs-6">Processor</h6>
                      <div className="pe-2">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                      </div>
                    </div>
                  </div>
                  {/* </CCollapse> */}
                </CTableDataCell>
              ) : (
                ''
              )}
            </React.Fragment>
          ))}
        </CTableBody>
      </CTable>
      <Modal show={showModal1} onHide={() => setShowModal1(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageSrc} alt="Preview" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal1(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ProductSetup

import React, { useState } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'

const DynamicTable = ({ tableHeader, data, handleEdit, handleDelete }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data
    // .filter((item) => item.role !== 'user')
    .filter((item) =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )

  return (
    <div>
      {/* Search input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control fw-bold"
          placeholder="Search by ID, Name, Email, CNIC, or Phone Number"
          value={searchTerm}
          style={{ height: '50px' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <CTable className="mb-0 border align-middle" hover responsive>
        <CTableHead className="text-nowrap">
          <CTableRow className="text-center">
            {tableHeader.map((header, index) => (
              <CTableHeaderCell key={index}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredData.length > 0 ? (
            [...filteredData].reverse().map((item, index) => (
              <CTableRow className="text-nowrap" key={index}>
                <CTableDataCell className="text-nowrap">
                  {item.id}
                </CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.role}</CTableDataCell>
                <CTableDataCell>{item.phoneNumber}</CTableDataCell>
                <CTableDataCell>{item.email}</CTableDataCell>
                <CTableDataCell>{item.cnic}</CTableDataCell>
                <CTableDataCell className="">
                  <div className="d-flex justify-content-center gap-2 align-items-center">
                    <button
                      className="btn btn-success"
                      onClick={() => handleEdit(item.id)}
                    >
                      Update Role
                    </button>
                    <button
                      className="btn btn-danger text-white"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell
                colSpan={tableHeader.length}
                className="text-center"
              >
                No Users Found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default DynamicTable

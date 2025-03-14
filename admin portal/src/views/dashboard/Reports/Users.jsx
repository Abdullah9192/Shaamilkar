import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '../../../assets/images/LOGO.png'

const Users = () => {
  const allUsers = useSelector((state) => state.users)
  const [searchTerm, setSearchTerm] = useState('')

  //   console.log(allUsers)
  const handleSave = () => {
    const doc = new jsPDF()
    const title = 'User Report'
    const padding = 17
    const imageWidth = 40
    const imageHeight = 10
    const imageX = 12
    const imageY = 10
    doc.addImage(logo, 'PNG', imageX, imageY, imageWidth, imageHeight)
    doc.setFont('Times', 'bold')
    const titleWidth = doc.getTextWidth(title)
    const END =
      doc.internal.pageSize.width -
      (titleWidth / 2 + imageWidth / 2) -
      padding / 2 -
      1
    doc.setTextColor(65, 217, 181)

    doc.text(title, END, padding)
    doc.setFont('Helvetics', 'normal')
    console.log(doc.getFontList())
    const tableStartY = imageY + imageHeight + 5
    doc.autoTable({
      startY: tableStartY,
      styles: {
        overflow: 'linebreak',
        fontSize: 12,
        valign: 'middle'
      },
      theme: 'grid',
      head: [['ID', 'Name', 'Email', 'Phone', 'CNIC']],
      body: allUsers
        .filter((user) => user.role == 'user')
        .map((user, index) => [
          index + 1,
          user.name,
          user.email,
          user.phoneNumber,
          user.cnic
        ])
    })
    doc.save(title + '.pdf')
  }
  const filteredData = allUsers.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4>Users List</h4>
        <Button className="btn btn-success" onClick={handleSave}>
          Save as PDF
        </Button>
      </div>
      <input
        type="text"
        className="form-control my-3"
        value={searchTerm}
        style={{ height: '50px' }}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
      />
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr className="text-nowrap">
              <th>Sr#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>CNIC</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.filter((user) => user.role === 'user').length > 0 ? (
              filteredData
                .filter((user) => user.role === 'user')
                .map((user, index) => (
                  <tr key={user.id + index} className="text-nowrap">
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.cnic}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No matching user found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Users

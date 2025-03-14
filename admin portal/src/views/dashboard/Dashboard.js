import React, { useState } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowTop } from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import { IoMdTrendingDown, IoMdTrendingUp } from 'react-icons/io'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState('Shaamilkar')
  const UserData = useSelector((state) => state.loggedUser)

  const handleChange = (event) => {
    setSelectedPortfolio(event.target.value)
  }

  const PortfolioSize = [
    {
      user: {
        name: 'Shaamilkar'
      },
      usage: {
        value: 502322
      },
      activity: '3%'
    },
    {
      user: {
        name: 'BOP'
      },
      usage: {
        value: 302322
      },
      activity: '1%'
    },
    {
      user: {
        name: 'HBL'
      },
      usage: {
        value: 356565
      },
      activity: '4%'
    },
    {
      user: {
        name: 'UBL'
      },
      usage: {
        value: 123123
      },
      activity: '2%'
    }
  ]
  const tableExample = [
    {
      user: {
        name: 'Honda',
        brand: 'H'
      },
      usage: {
        value: 502322
      },
      activity: '23%'
    },
    {
      user: {
        name: 'Samsung',
        brand: 'S'
      },
      usage: {
        value: 502322
      },
      activity: '43%'
    },
    {
      user: {
        name: 'Apple',
        brand: 'A'
      },
      usage: {
        value: 502322
      },
      activity: '53%'
    }
  ]
  const handleRowClick = (item) => {
    setSelectedPortfolio(item.user.name)
    // console.log(UserData)
  }
  const selectedDetails = PortfolioSize.find(
    (item) => item.user.name === selectedPortfolio
  )
  const ApplicationList = useSelector((state) => state.applications) || []
  let approvedApplications = Array.isArray(ApplicationList)
    ? ApplicationList.filter((app) => app.status === 'Approved').length
    : 0

  let pendingApplications = Array.isArray(ApplicationList)
    ? ApplicationList.filter((app) => app.status === 'Pending').length
    : 0

  let rejectedApplications = Array.isArray(ApplicationList)
    ? ApplicationList.filter((app) => app.status === 'Rejected').length
    : 0

  let applicationsChartData = [
    approvedApplications,
    pendingApplications,
    rejectedApplications
  ]
  return (
    <>
      <WidgetsDropdown />
      <div className="row mt-1 mb-4 g-4">
        <div className="col-8 ps-1 d-flex align-items-stretch">
          <CCard className="w-100">
            <CCardBody>
              <CRow>
                <CCol sm={7}>
                  <h4 id="traffic" className="card-title mb-0">
                    Portfolio Size{' '}
                    <span className="text-success">
                      <CIcon
                        className="rounded-circle flex-grow-1 p-1"
                        style={{
                          background: '#1b9e3e50',
                          fontSize: '1.5rem',
                          width: '1.5rem',
                          height: '1.5rem'
                        }}
                        icon={cilArrowTop}
                      />{' '}
                      +{selectedDetails ? selectedDetails.usage.value : 0}$
                    </span>
                  </h4>
                </CCol>
                <CCol sm={5} className="d-none d-md-block">
                  <div className="d-flex gap-2 justify-content-end">
                    <select
                      as="select"
                      name="portfolioSize"
                      id="portfolioSize"
                      value={selectedPortfolio}
                      onChange={handleChange}
                      className="form-select w-50"
                    >
                      {PortfolioSize.map((item, index) => (
                        <option value={item.user.name} key={index}>
                          {item.user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </CCol>
              </CRow>
              <MainChart />
            </CCardBody>
          </CCard>
        </div>
        <div className="col-4 d-flex align-items-stretch">
          <CCard className="w-100">
            <CCardHeader>
              <h6>Application Status Overview</h6>
            </CCardHeader>
            <CCardBody>
              {approvedApplications == 0 &&
              pendingApplications == 0 &&
              rejectedApplications == 0 ? (
                <h6 className="d-dlex justify-content-center align-items-center h-100 w-100">
                  No Applications Found
                </h6>
              ) : (
                <CChartDoughnut
                  data={{
                    labels: ['Approved', 'Pending', 'Rejected'],
                    datasets: [
                      {
                        backgroundColor: ['#28c36e', '#f0c84b', '#ff4646'],
                        data: applicationsChartData
                      }
                    ]
                  }}
                  options={{
                    cutout: '70%',
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              )}
            </CCardBody>
          </CCard>
        </div>
      </div>

      {/* <WidgetsBrand className="mb-4" withCharts /> */}
      <div className="row  align-items-stretch">
        <div className="col-4">
          <CCard className="h-100">
            <CCardHeader>
              <div className="d-flex align-items-center justify-content-between">
                <h5>Finiancial Analytics</h5>
                <input
                  type="date"
                  className="form-control"
                  style={{ width: '39%' }}
                  id="date2"
                  name="date2"
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </CCardHeader>
            <CCardBody>
              <CChartBar
                style={{ height: '195px' }}
                data={{
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July'
                  ],
                  datasets: [
                    {
                      barPercentage: 1.5,
                      barThickness: 10,
                      maxBarThickness: 18,
                      label: 'GitHub Commits',
                      backgroundColor: [
                        'red',
                        'blue',
                        'green',
                        'pink',
                        'yellow',
                        'blueviolet',
                        '#f87979',
                        '#f87979',
                        '#f87979'
                      ],
                      data: [40, 20, 12, 39, 10, 40, 139, 80, 40]
                    }
                  ]
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  responsive: true, // Ensure it's responsive
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        // Adjust rotation of the x-axis labels to 0 degrees
                        maxRotation: 90,
                        minRotation: 90
                      }
                    },

                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 10
                      }
                    }
                  }
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </div>
        <div className="col-8">
          <CCard className="mb-4 h-100">
            <CCardBody>
              <div className="d-flex gap-3">
                <div className="w-50">
                  <div className="d-flex justify-content-between align-items-center mb-2 ">
                    <h5>Store Analytics</h5>
                    <input
                      type="date"
                      className="form-control"
                      style={{ width: '37%' }}
                      id="date"
                      name="date"
                      placeholder="date"
                    />
                  </div>
                  <div className="d-flex">
                    <div className="d-flex align-items-center w-50">
                      <IoMdTrendingUp
                        size={40}
                        color="darkGreen"
                        className="p-1 rounded-circle green-bg me-1"
                      />
                      <div>
                        <p className="m-0 fw-bold fs-6">Atlas Honda</p>
                        <span style={{ fontSize: '12px' }}>
                          Best Performing
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center w-50">
                      <IoMdTrendingDown
                        size={40}
                        color="darkred"
                        className="p-1 rounded-circle red-bg me-1"
                      />
                      <div>
                        <p className="m-0 fw-bold fs-6">Apple Inc</p>
                        <span style={{ fontSize: '12px' }}>Low Performing</span>
                      </div>
                    </div>
                  </div>
                  <CTable
                    align="middle"
                    className="mb-0 border-none mt-2"
                    hover
                    responsive
                  >
                    <CTableBody>
                      {tableExample.map((item, index) => (
                        <CTableRow v-for="item in tableItems" key={index}>
                          <CTableDataCell>
                            <div
                              className="d-flex justify-content-center align-items-center fw-bolder"
                              style={{
                                height: undefined,
                                width: '25px',
                                border: '1px solid black',
                                aspectRatio: 1 / 1
                              }}
                            >
                              {item.user.brand}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{item.user.name}</div>
                          </CTableDataCell>
                          <CTableDataCell>{item.usage.value}</CTableDataCell>
                          <CTableDataCell>
                            <div className="fw-semibold text-nowrap">
                              {item.activity}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <IoMdTrendingDown />
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
                <div className="w-50">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Enterprises</h5>
                    <input
                      type="date"
                      className="form-control "
                      style={{ width: '37%' }}
                      id="date1"
                      name="date1"
                      placeholder="date"
                    />
                  </div>
                  <CTable
                    align="middle"
                    className="mb-0 border-none"
                    style={{ marginTop: '20px' }}
                    hover
                    responsive
                  >
                    <CTableBody>
                      {PortfolioSize.map((item, index) => (
                        <CTableRow
                          onClick={() => handleRowClick(item)}
                          v-for="item in tableItems"
                          key={index}
                          style={{
                            cursor: 'pointer'
                          }}
                        >
                          <CTableDataCell>
                            <div>{item.user.name}</div>
                          </CTableDataCell>
                          <CTableDataCell>{item.usage.value}</CTableDataCell>
                          <CTableDataCell>
                            <div className="fw-semibold text-nowrap">
                              {item.activity}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <IoMdTrendingUp />
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </>
  )
}

export default Dashboard

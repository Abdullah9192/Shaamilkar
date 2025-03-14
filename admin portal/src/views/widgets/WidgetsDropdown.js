import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { CWidgetStatsA } from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilArrowBottom,
  cilArrowRight,
  cilArrowTop,
  cilOptions
} from '@coreui/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { all } from 'axios'
import useFilteredApplications from '../../components/useFilteredApplications'

const WidgetsDropdown = () => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor =
            getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor =
            getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])
  let navigate = useNavigate()
  let location = useLocation()
  const UserData = useSelector((state) => state.loggedUser)
  const AllUser = useSelector((state) => state.users)
  const getDailyUserData = () => {
    const dailyCounts = {}

    AllUser.forEach((user) => {
      const date = new Date(user.createdAt).toISOString().split('T')[0]
      if (dailyCounts[date]) {
        dailyCounts[date] += 1
      } else {
        dailyCounts[date] = 1
      }
    })

    return Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))
  }
  const dailyData = getDailyUserData()
  const getUserGrowthPercentage = () => {
    const dailyCounts = {}

    AllUser.forEach((user) => {
      const date = new Date(user.createdAt).toISOString().split('T')[0]
      if (dailyCounts[date]) {
        dailyCounts[date] += 1
      } else {
        dailyCounts[date] = 1
      }
    })

    const dailyData = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    const growthData = dailyData.map((data, index) => {
      if (index === 0) {
        return { ...data, growth: 0 }
      }

      const previousCount = dailyData[index - 1].count
      const growth = ((data.count - previousCount) / previousCount) * 100
      return { ...data, growth: growth.toFixed(0) }
    })

    return growthData
  }

  const dailyGrowthData = getUserGrowthPercentage()

  const renderGrowthIndicator = () => {
    console.log(dailyGrowthData)
    if (dailyGrowthData.length < 2) {
      return <span className="fs-6 fw-normal text-muted"></span>
    }

    const latestGrowth = parseFloat(
      dailyGrowthData[dailyGrowthData.length - 1].growth
    )
    const previousGrowth = parseFloat(
      dailyGrowthData[dailyGrowthData.length - 2].growth
    )
    console.log(latestGrowth, previousGrowth, 'growth')
    if (latestGrowth > previousGrowth || latestGrowth == 0) {
      return (
        <span className="fs-6 fw-normal text-success">
          {' '}
          ({latestGrowth}% <CIcon icon={cilArrowTop} />)
        </span>
      )
    } else if (latestGrowth <= previousGrowth) {
      return (
        <span className="fs-6 fw-normal text-danger">
          {' '}
          ({latestGrowth}% <CIcon icon={cilArrowBottom} />)
        </span>
      )
    } else {
      return (
        <span className="fs-6 fw-normal text-success">
          ({latestGrowth}% <CIcon icon={cilArrowTop} />)
        </span>
      )
    }
  }
  const ApplicationList = useSelector((state) => state.applications)
  const filteredApplications = useFilteredApplications()

  const newApplications1 =
    filteredApplications?.notForwarded?.counts[
      filteredApplications?.notForwarded?.counts.length - 1
    ] || 0
  // console.log(dailyData, 'dailydata')
  let approvedApplications =
    ApplicationList?.filter((app) => app.status == 'Approved').length || 0
  return (
    <div className={'row'} xs={{ gutter: 4 }}>
      {location.pathname == '/reports' || (
        <div className="col-md-3 p-1">
          <div className="card p-2 h-100">
            <h6>Good Morning 💐</h6>
            <h4>{UserData.name}</h4>
            {/* <h4>Admin</h4> */}
            <p className="fs-6 text-dark">Here's is weekly overview report</p>
            <div className="d-flex align-items-end h-100">
              <button
                className="btn btn-success btn-sm fw-bold text-light"
                onClick={() => navigate('/reports')}
              >
                View Report
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="col-md p-1">
        <CWidgetStatsA
          color="white"
          style={{ cursor: 'pointer' }}
          className="p-0"
          onClick={() => {
            navigate('/reports/users')
          }}
          value={
            <>
              <span className="fs-6 text-black">Total Users</span>
              <h4 className="text-black">
                {AllUser.length}
                <span className="fs-6 fw-normal text-success">
                  {renderGrowthIndicator()}
                </span>
              </h4>
            </>
          }
          chart={
            <CChartLine
              className="mt-3 p-3"
              style={{ height: '70px' }}
              data={{
                labels: dailyGrowthData?.map((item) => item.date),
                datasets: [
                  {
                    label: 'Users',
                    backgroundColor: 'transparent',
                    borderColor: '#41d9b5',
                    data: dailyGrowthData?.map((item) => item.count),
                    fill: true
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: {
                    display: false
                  }
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false
                  },
                  y: {
                    display: false
                  }
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4
                  }
                }
              }}
            />
          }
        />
      </div>
      <div className="col-md p-1">
        <CWidgetStatsA
          color="white"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            navigate('/settings/installment-plan')
          }}
          value={
            <>
              <span className="fs-6 text-black">Active Customers</span>
              <h4 className="text-black">
                {approvedApplications}
                <span className="fs-6 fw-normal text-success">
                  (40.9% <CIcon icon={cilArrowTop} />)
                </span>
              </h4>
            </>
          }
          chart={
            <CChartLine
              className="mt-3 p-3"
              style={{ height: '70px' }}
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
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: '#41d9b5',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: {
                    display: false
                  }
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false
                  },
                  y: {
                    display: false
                  }
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4
                  }
                }
              }}
            />
          }
        />
      </div>
      <div className="col-md p-1">
        <CWidgetStatsA
          style={{ cursor: 'pointer' }}
          onClick={() => {
            navigate('/settings/penalty-setup')
          }}
          color="white"
          value={
            <>
              <span className="fs-6 text-black">Overdue Payments</span>
              <h4 className="text-black">
                56K
                <span className="fs-6 fw-normal text-success">
                  (+12.4% <CIcon icon={cilArrowTop} />)
                </span>
              </h4>
            </>
          }
          chart={
            <CChartLine
              className="mt-3 p-3"
              style={{ height: '70px' }}
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
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: '#41d9b5',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: {
                    display: false
                  }
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false
                  },
                  y: {
                    display: false
                  }
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4
                  }
                }
              }}
            />
          }
        />
      </div>
      <div className="col-md p-1">
        <CWidgetStatsA
          style={{ cursor: 'pointer' }}
          color="white"
          onClick={() => {
            navigate('/application')
          }}
          value={
            <>
              <span className="fs-6 text-black">New Applications</span>
              <h4 className="text-black">
                {newApplications1}
                <span
                  className={`fs-6 fw-normal ${filteredApplications?.notForwarded?.growth >= 0 ? 'text-success' : 'text-danger'}`}
                >
                  ({filteredApplications.notForwarded.growth.toFixed(1)}%{' '}
                  <CIcon
                    icon={
                      filteredApplications.notForwarded.growth >= 0
                        ? cilArrowTop
                        : cilArrowBottom
                    }
                  />
                  )
                </span>
              </h4>
            </>
          }
          chart={
            <CChartLine
              className="mt-3 p-3"
              style={{ height: '70px' }}
              data={{
                labels: filteredApplications.notForwarded.dates,
                datasets: [
                  {
                    backgroundColor: 'transparent',
                    borderColor: '#41d9b5',
                    data: filteredApplications.notForwarded.counts,
                    fill: true
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: {
                    display: false
                  }
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false
                  },
                  y: {
                    display: false
                  }
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4
                  }
                }
              }}
            />
          }
        />
      </div>
    </div>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool
}

export default WidgetsDropdown

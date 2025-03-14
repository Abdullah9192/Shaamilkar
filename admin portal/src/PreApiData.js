import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const PreApiData = () => {
  const userRole = useSelector((state) => state.loggedUser?.role)
  const users = useSelector((state) => state.users || [])
  const defaultUrl = useSelector((state) => state.BaseUrl)
  const ApplicationList = useSelector((state) => state.applications || [])
  const dispatch = useDispatch()

  const [applications, setApplications] = useState([])
  const [loggedIn, setLoggedIn] = useState(
    JSON.parse(localStorage.getItem('loggedIn'))
  )

  useEffect(() => {
    if (loggedIn && loggedIn === true) {
      GetData()

      fetchData()
      // console.log("fetching Data")
    }
  }, [userRole])

  const GetData = async () => {
    if (['Admin', 'CFO', 'CEO'].includes(userRole) && userRole) {
      // console.log(userRole)

      try {
        const res = await axios.get(`${defaultUrl}/user/AllUsers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'application/json'
          }
        })

        if (res.data.status === 'error') {
          console.error('Error Fetching Users:', res.data.message)
        } else if (res.data.status === 'success') {
          // console.log('Successfully fetched users');
          dispatch({ type: 'SET_USERS', payload: res.data.users })
        } else {
          console.error('Unexpected response format')
        }
      } catch (err) {
        console.error('Request failed:', err)
      }
    }
  }

  const fetchData = async () => {
    if (ApplicationList.length === 0) {
      try {
        const res = await axios.get(
          `${defaultUrl}/application/getapplication`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accesstoken')}`,
              'Content-Type': 'application/json'
            }
          }
        )

        // console.log('API Response:', res)
        if (res.data.status === 'error') {
          console.error('Error Fetching Applications:', res.data.message)
        } else if (res.data.status === 'success') {
          // console.log('Successfully fetched applications')
          dispatch({
            type: 'SET_APPLICATIONS',
            payload: res.data.Applications ||[]
          })
          setApplications(res.data.Applications)
        } else {
          console.error('Unexpected response format')
        }
      } catch (err) {
        console.error('Error fetching applications:', err)
      }
    } else {
      setApplications(ApplicationList)
    }
  }

  return <div></div>
}

export default PreApiData

import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'
import { ToastContainer } from 'react-toastify'
import { pdfjs } from 'react-pdf'
import PreApiData from './PreApiData'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn'))
  // const [loggedIn, setLoggedIn] = useState(true)
  const dispatch = useDispatch()
  const { isColorModeSet, setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme'
  )
  const storedTheme = useSelector((state) => state.theme)
  const UserData = useSelector((state) => state.loggedUser)

  useEffect(() => {
    dispatch({
      type: 'SET_LOGGED_USER',
      payload: JSON.parse(localStorage.getItem('user'))
    })
    // console.log(UserData)

    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme =
      urlParams.get('theme') &&
      urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (!theme) {
      setColorMode('light')
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PreApiData />
      <HashRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Suspense
          fallback={
            <div
              className="d-flex justify-content-center align-items-center text-center"
              style={{ height: '100vh' }}
            >
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route
              path="/login"
              name="Login Page"
              element={
                loggedIn ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />
            <Route
              path="/register"
              name="Register Page"
              element={
                loggedIn ? <Navigate to="/dashboard" replace /> : <Register />
              }
            />
            <Route path="/404" name="Page 404" element={<Page404 />} />
            <Route path="/500" name="Page 500" element={<Page500 />} />
            <Route
              path="*"
              name="Home"
              element={
                loggedIn ? <DefaultLayout /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </Suspense>
        <ToastContainer />
      </HashRouter>
    </>
  )
}

export default App

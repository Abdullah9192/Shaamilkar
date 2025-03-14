import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ element: Component, roles, user }) => {
  if (roles.includes(user.role)) {
    return <Component />
  }
  if (user.role == 'Loan Officer' || user.role == 'Credit Manager') {
    return <Navigate to="/application" replace />
  } else {
    return <Navigate to="/dashboard" replace />
  }
}

export default PrivateRoute

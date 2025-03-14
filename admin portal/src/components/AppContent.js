import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import PrivateRoute from './PrivateRoute'
import { useSelector } from 'react-redux'

const AppContent = () => {
  const user = useSelector((state) => state.loggedUser)
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map(({ path, element, role, exact }) => (
            <Route
              key={path}
              path={path}
              exact={exact}
              element={
                <PrivateRoute element={element} roles={role} user={user} />
              }
            />
          ))}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)

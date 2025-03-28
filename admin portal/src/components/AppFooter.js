import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className="m-auto">
        <span className="me-1">Powered by</span>
        <a
          href="https://shaamilkar.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shaamilkar.com
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

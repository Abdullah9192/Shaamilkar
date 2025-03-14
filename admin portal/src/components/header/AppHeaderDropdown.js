import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'

import { LuLogOut } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { FaRegCircleUser, FaUser } from 'react-icons/fa6'
import { useSelector } from 'react-redux'

const AppHeaderDropdown = () => {
  let navigate = useNavigate()
  const UserData = useSelector((state) => state.loggedUser)

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <FaRegCircleUser size={30} color="black" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <h5
          className="fw-bold p-2"
          style={{ borderBottom: '1px solid #41d9b5' }}
        >
          {UserData.name}
        </h5>
        <CDropdownItem
          className="dropdown_item"
          href="#"
          onClick={() => navigate('/profile')}
        >
          <FaUser className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem
          className="dropdown_item"
          href="#"
          onClick={() => {
            localStorage.clear()
            navigate('/login')
            window.location.reload()
          }}
        >
          <LuLogOut className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

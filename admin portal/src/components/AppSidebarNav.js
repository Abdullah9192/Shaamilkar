import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items, userRole }) => {
  const navLink = (name, icon, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, role, ...rest } = item

    // Check if the user's role matches the item's allowed roles
    if (role && !role.includes(userRole)) {
      return null
    }

    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, role, ...rest } = item

    // Check if the user's role matches the group's allowed roles
    if (role && !role.includes(userRole)) {
      return null
    }

    const Component = component
    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(name, icon)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true)
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  userRole: PropTypes.string.isRequired // Ensure the user's role is passed as a prop
}

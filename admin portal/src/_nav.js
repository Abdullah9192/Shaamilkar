import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAddressBook,
  cilBorderAll,
  cilDescription,
  cilLayers,
  cilLibraryBuilding,
  cilPeople,
  cilViewQuilt
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    role: ['Admin', 'CFO', 'CEO', 'super admin'],
    icon: <CIcon icon={cilViewQuilt} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Applications',
    to: '/application',
    role: [
      'Admin',
      'CFO',
      'CEO',
      'super admin',
      'Credit Manager',
      'Loan Officer'
    ],
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Customers',
    to: '/customers',
    role: ['Admin', 'CFO', 'CEO', 'super admin', 'Credit Manager'],
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'User Management',
    to: '/user-management',
    role: ['Admin', 'CFO', 'CEO', 'super admin'],
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Enterprises',
    to: '/enterprises',
    role: ['Admin', 'CFO', 'CEO', 'super admin'],
    icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/settings',
    role: ['Admin', 'CFO', 'CEO', 'super admin'],
    icon: <CIcon icon={cilBorderAll} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/reports',
    role: ['Admin', 'CFO', 'CEO', 'super admin',],
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />
  }
]

export default _nav

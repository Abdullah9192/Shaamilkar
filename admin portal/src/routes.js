import React from 'react'
import ApplicationForm from './views/dashboard/ApplicationForm'
import ApplicationRequests from './views/dashboard/ApplicationRequests'
// import Application from './views/dashboard/Application'
// import UserManagement from './views/dashboard/UserManagement'

const Application = React.lazy(() => import('./views/dashboard/Application'))
const ProductCategorySetup = React.lazy(
  () => import('./views/dashboard/SettingSetup/ProductCategorySetup')
)
const EnterPrizes = React.lazy(() => import('./views/dashboard/EnterPrizes'))
const UserManagement = React.lazy(
  () => import('./views/dashboard/UserManagement')
)
const Reports = React.lazy(() => import('./views/dashboard/Reports'))
const Users = React.lazy(() => import('./views/dashboard/Reports/Users'))
const InstallmentPlan = React.lazy(
  () => import('./views/dashboard/SettingSetup/InstallmentPlan')
)
const CompanySetup = React.lazy(
  () => import('./views/dashboard/SettingSetup/CompanySetup')
)
const PenaltySetup = React.lazy(
  () => import('./views/dashboard/SettingSetup/PenaltySetup')
)
const ProductSetup = React.lazy(
  () => import('./views/dashboard/SettingSetup/ProductSetup')
)
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Settings = React.lazy(() => import('./views/dashboard/Settings'))
const Customers = React.lazy(() => import('./views/dashboard/Customers'))

const routes = [
  {
    path: '/dashboard',
    exact: true,
    name: 'Home',
    role: ['Admin', 'CFO', 'CEO', 'super admin'],
    element: Dashboard
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/reports',
    name: 'Reports',
    element: Reports,
    role: ['Admin', 'CFO', 'CEO', 'super admin', 'Credit Manager']
  },
  {
    path: '/application',
    name: 'Application',
    element: Application,
    role: [
      'Admin',
      'CFO',
      'CEO',
      'super admin',
      'Loan Officer',
      'Credit Manager'
    ]
  },
  {
    path: '/customers',
    name: 'Customers',
    element: Customers,
    role: [
      'Admin',
      'CFO',
      'CEO',
      'super admin',
      'Loan Officer',
      'Credit Manager'
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    element: Settings,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/enterprises',
    name: 'Enterprises',
    element: EnterPrizes,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/settings/penalty-setup',
    name: 'Penalty Setup',
    element: PenaltySetup,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/settings/product-setup',
    name: 'Product Setup',
    element: ProductSetup,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/reports/users',
    name: 'Users',
    element: Users,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/settings/product-category-setup',
    name: 'Product Category Setup',
    element: ProductCategorySetup,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/settings/company-setup',
    name: 'Company Setup',
    element: CompanySetup,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/settings/installment-plan',
    name: 'Installment Plan',
    element: InstallmentPlan,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  },
  {
    path: '/user-management',
    name: 'User Management',
    element: UserManagement,
    role: ['Admin', 'CFO', 'CEO', 'super admin']
  }
]

export default routes

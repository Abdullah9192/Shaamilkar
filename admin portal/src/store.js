import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarUnfoldable: false,
  sidebarShow: true,
  // BaseUrl: 'http://localhost:5000/api',
  // BaseUrl: 'http://192.168.15.190:5000/api',
  // BaseUrl: 'https://api-shamilkar.enaam.pk/api',
  // BaseUrl: 'https://apig-shamilkar.enaam.pk/api',
  // BaseUrl: 'https://st-api-shamilkar.enaam.pk/api',
  // BaseUrl: 'http://api-shamilkar.enaam.pk:5000/api',
  // BaseUrl: 'http://192.168.12.169:5000/api',
  // BaseUrl: 'http://192.168.137.1:5000/api',
  BaseUrl: 'https://api.shaamilkar.com/api',
  theme: 'light',
  users: [],
  loggedUser: {},
  applications: []
}

const changeState = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'set':
      return { ...state, ...payload }
    case 'ADD_USER':
      return { ...state, users: [...state.users, payload] }
    case 'SET_USERS':
      return { ...state, users: payload }
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === payload.user.id ? payload.user : user
        )
      }
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((user) => user.id !== payload)
      }
    case 'SET_LOGGED_USER':
      return { ...state, loggedUser: payload }
    case 'RESET_LOGGED_USER':
      return { ...state, loggedUser: {} }
    case 'SET_APPLICATIONS':
      return { ...state, applications: payload }
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === payload.id ? payload : app
        )
      }

    default:
      return state
  }
}

const store = createStore(changeState)
export default store

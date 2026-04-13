import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebar: {
    open: false,
    type: 'CONTACT' // can be CONTACT, STARRED, SHARED
  },
  snackbar: {
    open: null,
    message: null,
    severity: null
  }
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Toggle Sidebar
    toggleSidebar(state) {
      state.sidebar.open = !state.sidebar.open
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type
    },
    openSnackbar(state, action) {
      state.snackbar.open = true
      state.snackbar.severity = action.payload.severity
      state.snackbar.message = action.payload.message
    },
    closeSnackbar (state, action) {
      state.snackbar.open = false
      state.snackbar.severity = null
      state.snackbar.message = null
    }
  }
})

// Reducer
export default slice.reducer

// Định nghĩa thunk action
export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSidebar())
  }
}

export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSidebarType({ type }))
  }
}

export function showSnackbar ({ severity, message}) {
  return async(dispatch, getState) => {
    dispatch(slice.actions.openSnackbar({ message, severity }))
    setTimeout(() => {
      dispatch(slice.actions.closeSnackbar())
    }, 4000)
  }
}

export const closeSnackbar = () => async(dispatch, getState) => {
  dispatch(slice.actions.closeSnackbar())
}

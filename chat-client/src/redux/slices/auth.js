/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit'
import axios from '~/utils/axios'
import { showSnackbar } from './app'

const initialState = {
  isLoggedIn: false,
  token: '',
  isLoading: false
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn
      state.token = action.payload.token
    },
    signOut(state) {
      state.isLoggedIn = false,
      state.token = ''
    }
  }
})

// Reducer
export default slice.reducer

export function RegisterUser(formValues, navigate) {
  return async () => {
    try {
      const res = await axios.post('/auth/register', formValues)

      // Sau khi register thành công → gọi gửi OTP
      await axios.post('/auth/send-otp', {
        userId: res.data.userId
      })
      navigate('/auth/verify', {
        state: { email: formValues.email }
      })
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Register failed')
    }
  }
}

export function VerifyOTP(formValues) {
  return async (dispatch) => {
    try {
      const res = await axios.post('/auth/verify', formValues)

      dispatch(slice.actions.logIn({
        isLoggedIn: true,
        token: res.data.token
      }))
      return res.data

    } catch (error) {
      const message = error.response?.data?.message || 'Verify thất bại'
      throw new Error(message)
    }
  }
}

// Log in
export function LoginUser(formValues) {
  // formValues => { email, password }
  return async (dispatch, getState) => {
    await axios.post('/auth/login', {
      ...formValues
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    ).then(function (response) {
      console.log(response)

      dispatch(slice.actions.logIn({
        isLoggedIn: true,
        token: response.data.token
      }))

      dispatch(showSnackbar({ severity: 'success', message: response.data.message }))
    }).catch(function (error) {
      console.log(error)
      dispatch(showSnackbar({ severity: 'error', message: error.message }))
    })
  }
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.signOut())
  }
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    await axios
      .post('/auth/forgot-password', {
        ...formValues
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      .then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
  }
}

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    await axios.post('/auth/reset-password', { ...formValues }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log(response)
      dispatch(slice.actions.logIn({
        isLoggedIn: true,
        token: response.data.token
      }))
    }).catch((error) => {
      console.log(error)
    })
  }
}

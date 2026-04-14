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
      const res = await axios.post(
        '/auth/verify',
        { ...formValues },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          dispatch(slice.actions.logIn({
            isLoggedIn: true,
            token: res.data.token
          }))

          window.localStorage.setItem('user_id', res.data.user_id)
        })
        .catch((error) => console.log(error))


      return res.data

    } catch (error) {
      const message = error.response?.data?.message || 'Verify thất bại'
      throw new Error(message)
    }
  }
}

// Log in
export function LoginUser(formValues) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        '/auth/login',
        { ...formValues },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log(response)

      dispatch(slice.actions.logIn({
        isLoggedIn: true,
        token: response.data.token
      }))

      window.localStorage.setItem('user_id', response.data.user_id)

      dispatch(showSnackbar({
        severity: 'success',
        message: response.data.message
      }))

      return response.data
    } catch (error) {
      console.log(error)

      dispatch(showSnackbar({
        severity: 'error',
        message: error.response?.data?.message || error.message
      }))

      throw error
    }
  }
}

export function LogoutUser() {
  return async (dispatch) => {
    window.localStorage.removeItem('user_id')
    dispatch(slice.actions.signOut())

  }
}

export function ForgotPassword(formValues) {
  return async ( ) => {
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
  return async (dispatch) => {
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

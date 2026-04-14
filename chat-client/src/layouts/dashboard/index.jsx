import { Stack } from '@mui/material'
import { Navigate, Outlet } from 'react-router-dom'
import SideBar from './SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { connectSocket, socket } from '~/socket'
import { showSnackbar } from '~/redux/slices/app'


const DashboardLayout = () => {

  const dispatch = useDispatch()

  const { isLoggedIn } = useSelector((state) => state.auth)
  const user_id = window.localStorage.getItem('user_id')
  useEffect(() => {
    if (isLoggedIn) {
      if (!socket) {
        connectSocket(user_id)
      }
      // 'new_friend_request'
      socket.on('new_friend_request', (data) => {
        dispatch(showSnackbar({ severity: 'success', message: data.message }))
      })

      socket.on('request_accepted', (data) => {
        dispatch(showSnackbar({ severity: 'success', message: data.message }))
      })

      socket.on('request_sent', (data) => {
        dispatch(showSnackbar({ severity: 'success', message: data.message }))
      })
    }
    return () => {
      socket?.off('new_friend_request')
      socket?.off('request_accepted')
      socket?.off('request_sent')
    }
  }, [dispatch])
  if (!isLoggedIn) {
    return <Navigate to='/auth/login' />
  }



  return (
    <Stack direction='row'>
      {/* SideBar */}
      <SideBar />
      {/* Nội dung trang */}
      <Outlet />
    </Stack>
  )
}

export default DashboardLayout

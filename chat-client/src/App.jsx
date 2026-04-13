import '~/App.css'
import Router from '~/routes'
import Snackbar from '@mui/material/Snackbar'
import ThemeSettings from './components/settings'
import ThemeProvider from './theme'
import React from 'react'
import MuiAlert from '@mui/material/Alert'
import { useDispatch, useSelector } from 'react-redux'
import { closeSnackbar } from './redux/slices/app'


const vertical = 'bottom'
const horizontal = 'center'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

function App() {
  const { open, message, severity } = useSelector((state) => state.app.snackbar)
  const dispatch = useDispatch()
  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          {' '}
          <Router /> {' '}
        </ThemeSettings>
      </ThemeProvider>

      { message && open ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={4000}
          key={vertical + horizontal}
          onclose={() => {
            dispatch(closeSnackbar())
          }}
        >
          <Alert onclose={() => {
            dispatch(closeSnackbar())
          }}
          severity={severity}
          sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}

    </>

  )
}

export default App

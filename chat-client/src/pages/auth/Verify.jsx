import { Stack, Typography } from '@mui/material'
import VerifyForm from '~/sections/auth/VerifyForm'
import { useLocation } from 'react-router-dom'

const Verify = () => {
  const location = useLocation()
  const email = location.state?.email

  return (
    <div>
      <Stack
        spacing={2}
        sx={{
          mb: 5,
          position: 'relative'
        }}
      >
        <Typography variant='h4'>Please Verify OTP</Typography>
        <Stack direction='row' spacing='0.5'>
          <Typography>
            Sent to email ({email})
          </Typography>
        </Stack>
      </Stack>

      {/* Verify Form */}
      <VerifyForm email={email} />
    </div>
  )
}

export default Verify

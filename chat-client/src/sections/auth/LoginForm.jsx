/* eslint-disable no-console */
import { useState } from 'react'
import * as Yup from 'yup'
import { Link as RouterLink } from 'react-router-dom'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// MUI Components
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

// Components
import { Eye, EyeSlash } from 'phosphor-react'
import FormProvider, { RHFTextField } from '~/components/hook-form'
import { LoginUser } from '~/redux/slices/auth'
import { useDispatch } from 'react-redux'

// ------------------------------------------------------------------------
const LoginForm = () => {

  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required')
  })

  const defaultValues = {
    email: 'demo@gmail.com',
    password: 'demo1234'
  }

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    try {
      // Submit data to backend

      dispatch(LoginUser(data))
    } catch (error) {
      console.error(error)
      reset()
      setError('afterSubmit', {
        ...error,
        message: error.message || 'Something went wrong'
      })
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link component={RouterLink} to="/auth/reset-password" variant="body2" color="inherit" underline="always">
          Forgot password?
        </Link>
      </Stack>
      <Button
        fullWidth
        color='inherit'
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting.toString()}
        sx={{
          bgcolor: (theme) => theme.palette.mode === 'light' ? '#4D6FB2' : '#90CAF9',
          color: 'common.white',
          '&:hover': {
            bgcolor: (theme) => theme.palette.mode === 'light' ? '#3a5aa5' : '#64b5f6'
          },
          padding: 1.5,
          borderRadius: 2,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
        }}

      >
          Login
      </Button>
    </FormProvider>
  )
}

export default LoginForm

import { useState } from 'react'
import * as Yup from 'yup'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// MUI Components
import { Stack, Alert, Button, IconButton, InputAdornment } from '@mui/material'

// Components
import { Eye, EyeSlash } from 'phosphor-react'
import FormProvider, { RHFTextField } from '~/components/hook-form'
import { useDispatch } from 'react-redux'
import { RegisterUser } from '~/redux/slices/auth'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required')
  })

  const defaultValues = {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@gmail.com',
    password: 'demo1234'
  }

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
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
      await dispatch(RegisterUser(data, navigate))
    } catch (error) {
      alert(error)
      reset()
      setError('afterSubmit', {
        ...error,
        message: error.message || 'Something went wrong'
      })
    }
  }
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ my: 2 }}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
          <Stack direction={{ sx: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name='firstName' label='First Name' />
            <RHFTextField name='lastName' label='Last Name' />
          </Stack >
          <RHFTextField name='email' label='Email' />
          <RHFTextField
            name='password'
            label='Password'
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
          Create Account
        </Button>
      </FormProvider>
    </>
  )
}

export default RegisterForm

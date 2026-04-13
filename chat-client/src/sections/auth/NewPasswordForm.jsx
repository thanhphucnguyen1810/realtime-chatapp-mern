/* eslint-disable no-console */
import { useState } from 'react'
import * as Yup from 'yup'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// MUI Components
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

// Components
import { Eye, EyeSlash } from 'phosphor-react'
import FormProvider, { RHFTextField } from '~/components/hook-form'
import { useDispatch } from 'react-redux'
import { NewPassword } from '~/redux/slices/auth'

// ------------------------------------------------------------------------
const NewPasswordForm = () => {
  const [queryParameters] = useSearchParams()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    passwordConfirm: Yup.string()
      .required('Password is required')
      .oneOf([Yup.ref('password'), null], 'Password must match')
  })

  const defaultValues = {
    password: '',
    passwordConfirm: ''
  }

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
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
      console.log('Submitted:', data)
      dispatch(NewPassword({ ...data, token: queryParameters.get('token') }))
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

        <RHFTextField
          name="password"
          label="New Password"
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

        <RHFTextField
          name="passwordConfirm"
          label="Confirm Password"
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
          Submit
        </Button>

      </Stack>


    </FormProvider>
  )
}

export default NewPasswordForm

/* eslint-disable no-console */
import * as Yup from 'yup'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// MUI Components
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

// Components
import FormProvider, { RHFTextField } from '~/components/hook-form'
import { ForgotPassword } from '~/redux/slices/auth'
import { useDispatch } from 'react-redux'

// ------------------------------------------------------------------------
const ResetPasswordForm = () => {

  const dispatch = useDispatch()

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address')
  })

  const defaultValues = {
    email: 'demo@gmail.com'
  }

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
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
      // data = {email: ""}
      dispatch(ForgotPassword(data))
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
          Send Request
        </Button>

      </Stack>


    </FormProvider>
  )
}

export default ResetPasswordForm
